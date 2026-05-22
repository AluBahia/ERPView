import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface EstoqueSQL {
  produto_id: string;
  quantidade: number;
  qtd_minima: number;
  qtd_maxima: number;
  deposito: string;
  data_alteracao?: Date;
}

export async function syncEstoque(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de estoque');

  const fonte = await retry(() => query<EstoqueSQL>(`
    SELECT 
      CAST(produto_id AS VARCHAR(36)) AS produto_id,
      quantidade,
      qtd_minima,
      qtd_maxima,
      deposito,
      data_alteracao
    FROM estoque
  `), { label: 'query-estoque' });

  const { data: destinoData } = await supabase.from('estoque').select('*');
  const destino = (destinoData || []).map((d: any) => ({
    produto_id: String(d.produto_id),
    quantidade: d.quantidade,
    qtd_minima: d.qtd_minima,
    qtd_maxima: d.qtd_maxima,
    deposito: d.deposito,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    produto_id: String(f.produto_id),
    quantidade: f.quantidade,
    qtd_minima: f.qtd_minima,
    qtd_maxima: f.qtd_maxima,
    deposito: f.deposito,
    updated_at: f.data_alteracao ? f.data_alteracao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'produto_id', 'updated_at');

  if (delta.inseridos.length > 0) {
    await retry(() => supabase.from('estoque').insert(delta.inseridos).then(r => r as any), { label: 'insert-estoque' });
  }
  if (delta.atualizados.length > 0) {
    for (const e of delta.atualizados) {
      await retry(() => supabase.from('estoque').update(e).eq('produto_id', e.produto_id).then(r => r as any), { label: 'update-estoque' });
    }
  }
  if (delta.deletados.length > 0) {
    await retry(() => supabase.from('estoque').delete().in('produto_id', delta.deletados).then(r => r as any), { label: 'delete-estoque' });
  }

  logger.info(`Estoque: +${delta.inseridos.length} ~${delta.atualizados.length} -${delta.deletados.length}`);
  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
