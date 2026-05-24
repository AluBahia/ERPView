import { query } from '../db/sqlserver.js';
import { supabase, fetchAll } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface OrdemProducaoSQL {
  id: string;
  quantidade: number;
  status: string;
  data_inicio?: Date;
  data_previsao?: Date;
  data_conclusao?: Date;
  linha?: string;
  data_atualizacao?: Date;
}

export async function syncProducao(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de ordens de produção');

  const fonte = await retry(() => query<OrdemProducaoSQL>(`
    SELECT
      CAST(Codigo AS VARCHAR(36)) AS id,
      COALESCE(Quantidade, 0) AS quantidade,
      Status AS status,
      Data AS data_inicio,
      NULL AS data_previsao,
      DataBaixa AS data_conclusao,
      CentroCusto AS linha,
      DataBaixa AS data_atualizacao
    FROM Producao
    WHERE Status NOT IN ('Cancelado')
  `), { label: 'query-producao' });

  const destinoData = await fetchAll('ordens_producao', 'id,produto,quantidade,inicio_prev,fim_prev,status,desvio,updated_at');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    produto: d.produto ?? '',
    quantidade: d.quantidade ?? 0,
    status: d.status ?? '',
    inicio_prev: d.inicio_prev ?? null,
    fim_prev: d.fim_prev ?? null,
    desvio: d.desvio ?? null,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    produto: f.linha && f.linha.trim() ? f.linha : 'Produto A',
    quantidade: f.quantidade ?? 0,
    status: f.status ?? '',
    inicio_prev: f.data_inicio ? f.data_inicio.toISOString().split('T')[0] : null,
    fim_prev: f.data_previsao ? f.data_previsao.toISOString().split('T')[0] : null,
    desvio: 'Nenhum',
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    const toInsert = delta.inseridos.map((o) => ({
      ...o,
      created_at: new Date().toISOString(),
    }));
    await retry(() => supabase.from('ordens_producao').insert(toInsert).then(r => r as any), { label: 'insert-producao' });
    logger.info(`Inseridas ${delta.inseridos.length} ordens de produção`);
  }

  if (delta.atualizados.length > 0) {
    for (const ordem of delta.atualizados) {
      await retry(
        () => supabase.from('ordens_producao').update(ordem).eq('id', ordem.id).then(r => r as any),
        { label: 'update-producao' }
      );
    }
    logger.info(`Atualizadas ${delta.atualizados.length} ordens de produção`);
  }

  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
