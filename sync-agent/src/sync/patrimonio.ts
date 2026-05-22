import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
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
  valor_atual?: number;
  data_aquisicao: Date;
  vida_util_anos?: number;
  taxa_depreciacao?: number;
  status: string;
  data_alteracao?: Date;
}

interface BemPatrimonialSupabase {
  id: string;
  codigo: string;
  descricao: string;
  categoria: string;
  localizacao: string | null;
  valor_aquisicao: number;
  valor_atual: number | null;
  data_aquisicao: string;
  vida_util_anos: number | null;
  taxa_depreciacao: number | null;
  status: string;
  updated_at: string | null;
}

export async function syncPatrimonio(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de bens patrimoniais');

  const fonte = await retry(() => query<BemPatrimonialSQL>(`
    SELECT
      CAST(id AS VARCHAR(36)) AS id,
      codigo,
      descricao,
      categoria,
      localizacao,
      valor_aquisicao,
      valor_atual,
      data_aquisicao,
      vida_util_anos,
      taxa_depreciacao,
      status,
      data_alteracao
    FROM bens_patrimoniais
    WHERE status NOT IN ('Baixado')
  `), { label: 'query-patrimonio' });

  const { data: destinoData } = await supabase.from('bens_patrimoniais').select('*');
  const destino: BemPatrimonialSupabase[] = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    codigo: d.codigo,
    descricao: d.descricao,
    categoria: d.categoria,
    localizacao: d.localizacao ?? null,
    valor_aquisicao: d.valor_aquisicao,
    valor_atual: d.valor_atual ?? null,
    data_aquisicao: d.data_aquisicao,
    vida_util_anos: d.vida_util_anos ?? null,
    taxa_depreciacao: d.taxa_depreciacao ?? null,
    status: d.status,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    codigo: f.codigo,
    descricao: f.descricao,
    categoria: f.categoria,
    localizacao: f.localizacao ?? null,
    valor_aquisicao: f.valor_aquisicao,
    valor_atual: f.valor_atual ?? null,
    data_aquisicao: f.data_aquisicao instanceof Date ? f.data_aquisicao.toISOString().split('T')[0] : String(f.data_aquisicao),
    vida_util_anos: f.vida_util_anos ?? null,
    taxa_depreciacao: f.taxa_depreciacao ?? null,
    status: f.status,
    updated_at: f.data_alteracao ? f.data_alteracao.toISOString() : null,
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
