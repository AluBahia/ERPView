import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface PedidoSQL {
  id: string;
  numero: string;
  cliente_id: string;
  vendedor_id: string;
  valor_total: number;
  status: string;
  data_emissao: string;
  data_atualizacao?: Date;
}

export async function syncPedidosVenda(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de pedidos de venda');

  const fonte = await retry(() => query<PedidoSQL>(`
    SELECT 
      CAST(Pedido AS VARCHAR(36)) AS id,
      CAST(Pedido AS VARCHAR) AS numero,
      CAST(Cliente AS VARCHAR(36)) AS cliente_id,
      CAST(Vendedor AS VARCHAR(36)) AS vendedor_id,
      ValorNF AS valor_total,
      Status AS status,
      CONVERT(VARCHAR(10), DataEmissao, 120) AS data_emissao,
      UltimaAlteracao AS data_atualizacao
    FROM Vendas
    WHERE Status NOT IN ('Cancelado')
  `), { label: 'query-pedidos-venda' });

  const { data: destinoData } = await supabase.from('pedidos_venda').select('*');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    numero: d.numero ?? '',
    cliente_id: String(d.cliente_id ?? '0'),
    vendedor_id: String(d.vendedor_id ?? '0'),
    valor_total: d.valor_total ?? 0,
    status: d.status ?? '',
    data_emissao: d.data_emissao ?? '',
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    numero: f.numero ?? '',
    cliente_id: f.cliente_id ?? '0',
    vendedor_id: f.vendedor_id ?? '0',
    valor_total: f.valor_total ?? 0,
    status: f.status ?? '',
    data_emissao: f.data_emissao ?? '',
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    await retry(() => supabase.from('pedidos_venda').insert(delta.inseridos).then(r => r as any), { label: 'insert-pedidos' });
  }
  if (delta.atualizados.length > 0) {
    for (const p of delta.atualizados) {
      await retry(() => supabase.from('pedidos_venda').update(p).eq('id', p.id).then(r => r as any), { label: 'update-pedido' });
    }
  }
  if (delta.deletados.length > 0) {
    await retry(() => supabase.from('pedidos_venda').delete().in('id', delta.deletados).then(r => r as any), { label: 'delete-pedidos' });
  }

  logger.info(`Pedidos: +${delta.inseridos.length} ~${delta.atualizados.length} -${delta.deletados.length}`);
  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
