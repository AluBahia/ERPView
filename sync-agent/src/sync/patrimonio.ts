import { query } from '../db/sqlserver.js';
import { supabase, fetchAll } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface BemPatrimonialSQL {
  id: string;
  codigo: string;
  descricao: string;
  categoria: string;
  localizacao?: string;
  valor_aquisicao: number;
  status: string;
  data_atualizacao?: Date;
}

export async function syncPatrimonio(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de bens patrimoniais');

  const fonte = await retry(() => query<BemPatrimonialSQL>(`
    SELECT
      CAST(Codigo AS VARCHAR(36)) AS id,
      Referencia AS codigo,
      Nome AS descricao,
      CAST(Grupo AS VARCHAR) AS categoria,
      CAST(Localizacao AS VARCHAR) AS localizacao,
      ValorAquisicao AS valor_aquisicao,
      Situacao AS status,
      DataUltMovimentacao AS data_atualizacao
    FROM BemPatrimonial
    WHERE Situacao NOT IN ('Baixado')
  `), { label: 'query-patrimonio' });

  const destinoData = await fetchAll('bens_patrimoniais', 'id,codigo,descricao,categoria,localizacao,valor_original,depreciacao_acumulada,valor_liquido,status,updated_at');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    codigo: d.codigo ?? '',
    descricao: d.descricao ?? '',
    categoria: d.categoria ?? '',
    localizacao: d.localizacao ?? null,
    valor_original: d.valor_original ?? 0,
    depreciacao_acumulada: d.depreciacao_acumulada ?? 0,
    valor_liquido: d.valor_liquido ?? 0,
    status: d.status ?? '',
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    codigo: f.codigo ?? '',
    descricao: f.descricao ?? '',
    categoria: f.categoria ?? '',
    localizacao: f.localizacao ?? null,
    valor_original: f.valor_aquisicao ?? 0,
    depreciacao_acumulada: 0,
    valor_liquido: f.valor_aquisicao ?? 0,
    status: f.status ?? '',
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    const toInsert = delta.inseridos.map((b) => ({
      ...b,
      created_at: new Date().toISOString(),
    }));
    await retry(() => supabase.from('bens_patrimoniais').insert(toInsert).then(r => r as any), { label: 'insert-patrimonio' });
    logger.info(`Inseridos ${delta.inseridos.length} bens patrimoniais`);
  }

  if (delta.atualizados.length > 0) {
    for (const bem of delta.atualizados) {
      await retry(
        () => supabase.from('bens_patrimoniais').update(bem).eq('id', bem.id).then(r => r as any),
        { label: 'update-patrimonio' }
      );
    }
    logger.info(`Atualizados ${delta.atualizados.length} bens patrimoniais`);
  }

  if (delta.deletados.length > 0) {
    await retry(
      () => supabase.from('bens_patrimoniais').update({ status: 'Baixado' }).in('id', delta.deletados).then(r => r as any),
      { label: 'soft-delete-patrimonio' }
    );
    logger.info(`Baixados ${delta.deletados.length} bens patrimoniais`);
  }

  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
