import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface OrdemProducaoSQL {
  id: string;
  numero: string;
  produto_id: string;
  quantidade: number;
  status: string;
  data_inicio?: Date;
  data_previsao?: Date;
  data_conclusao?: Date;
  linha?: string;
  data_alteracao?: Date;
}

interface OrdemProducaoSupabase {
  id: string;
  numero: string;
  produto_id: string;
  quantidade: number;
  status: string;
  data_inicio: string | null;
  data_previsao: string | null;
  data_conclusao: string | null;
  linha: string | null;
  updated_at: string | null;
}

export async function syncProducao(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de ordens de produção');

  const fonte = await retry(() => query<OrdemProducaoSQL>(`
    SELECT
      CAST(id AS VARCHAR(36)) AS id,
      numero,
      CAST(produto_id AS VARCHAR(36)) AS produto_id,
      quantidade,
      status,
      data_inicio,
      data_previsao,
      data_conclusao,
      linha,
      data_alteracao
    FROM ordens_producao
    WHERE status NOT IN ('Cancelado')
  `), { label: 'query-producao' });

  const { data: destinoData } = await supabase.from('ordens_producao').select('*');
  const destino: OrdemProducaoSupabase[] = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    numero: d.numero,
    produto_id: String(d.produto_id),
    quantidade: d.quantidade,
    status: d.status,
    data_inicio: d.data_inicio ?? null,
    data_previsao: d.data_previsao ?? null,
    data_conclusao: d.data_conclusao ?? null,
    linha: d.linha ?? null,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    numero: f.numero,
    produto_id: String(f.produto_id),
    quantidade: f.quantidade,
    status: f.status,
    data_inicio: f.data_inicio ? f.data_inicio.toISOString() : null,
    data_previsao: f.data_previsao ? f.data_previsao.toISOString() : null,
    data_conclusao: f.data_conclusao ? f.data_conclusao.toISOString() : null,
    linha: f.linha ?? null,
    updated_at: f.data_alteracao ? f.data_alteracao.toISOString() : null,
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
