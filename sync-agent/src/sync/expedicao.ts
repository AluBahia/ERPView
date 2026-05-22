import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface PedidoExpedicaoSQL {
  id: string;
  numero: string;
  cliente_id: string;
  transportadora?: string;
  status: string;
  data_pedido?: Date;
  data_previsao?: Date;
  data_entrega?: Date;
  peso_total?: number;
  data_atualizacao?: Date;
}

export async function syncExpedicao(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de expedição');

  const fonte = await retry(() => query<PedidoExpedicaoSQL>(`
    SELECT
      CAST(Pedido AS VARCHAR(36)) AS id,
      CAST(Pedido AS VARCHAR) AS numero,
      CAST(Cliente AS VARCHAR(36)) AS cliente_id,
      '' AS transportadora,
      Status AS status,
      DataPedido AS data_pedido,
      NULL AS data_previsao,
      DataEntrega AS data_entrega,
      NULL AS peso_total,
      FimProc AS data_atualizacao
    FROM WMSExpedicao
    WHERE Status NOT IN ('Cancelado')
  `), { label: 'query-expedicao' });

  const { data: destinoData } = await supabase.from('pedidos_expedicao').select('*');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    numero: d.numero ?? '',
    cliente_id: String(d.cliente_id ?? '0'),
    transportadora: d.transportadora ?? null,
    status: d.status ?? '',
    data_pedido: d.data_pedido ?? null,
    data_previsao: d.data_previsao ?? null,
    data_entrega: d.data_entrega ?? null,
    peso_total: d.peso_total ?? null,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    numero: f.numero ?? '',
    cliente_id: String(f.cliente_id ?? '0'),
    transportadora: f.transportadora ?? null,
    status: f.status ?? '',
    data_pedido: f.data_pedido ? f.data_pedido.toISOString() : null,
    data_previsao: f.data_previsao ? f.data_previsao.toISOString() : null,
    data_entrega: f.data_entrega ? f.data_entrega.toISOString() : null,
    peso_total: f.peso_total ?? null,
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    const toInsert = delta.inseridos.map((p) => ({
      ...p,
      created_at: new Date().toISOString(),
    }));
    await retry(() => supabase.from('pedidos_expedicao').insert(toInsert).then(r => r as any), { label: 'insert-expedicao' });
    logger.info(`Inseridos ${delta.inseridos.length} pedidos de expedição`);
  }

  if (delta.atualizados.length > 0) {
    for (const pedido of delta.atualizados) {
      await retry(
        () => supabase.from('pedidos_expedicao').update(pedido).eq('id', pedido.id).then(r => r as any),
        { label: 'update-expedicao' }
      );
    }
    logger.info(`Atualizados ${delta.atualizados.length} pedidos de expedição`);
  }

  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
