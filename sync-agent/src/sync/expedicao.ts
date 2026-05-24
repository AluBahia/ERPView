import { query } from '../db/sqlserver.js';
import { supabase, fetchAll } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface PedidoExpedicaoSQL {
  id: string;
  numero: string;
  cliente: string;
  cidade?: string;
  transportadora?: string;
  status: string;
  prev_entrega?: Date;
  peso?: number;
  data_atualizacao?: Date;
}

export async function syncExpedicao(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de expedição');

  const fonte = await retry(() => query<PedidoExpedicaoSQL>(`
    SELECT
      CAST(E.Pedido AS VARCHAR(36)) AS id,
      CAST(E.Pedido AS VARCHAR) AS numero,
      C.Nome AS cliente,
      C.Cidade AS cidade,
      E.Status AS status,
      E.DataEntrega AS prev_entrega,
      E.PesoTotal AS peso,
      E.Transportadora AS transportadora,
      E.FimProc AS data_atualizacao
    FROM WMSExpedicao E
    LEFT JOIN Clientes C ON C.Cliente = E.Cliente
    WHERE Status NOT IN ('Cancelado')
  `), { label: 'query-expedicao' });

  const destinoData = await fetchAll('pedidos_expedicao', 'id,numero,cliente,cidade,peso,transportadora,prev_entrega,status,updated_at');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    numero: d.numero ?? '',
    cliente: d.cliente ?? '',
    cidade: d.cidade ?? null,
    peso: d.peso ?? null,
    transportadora: d.transportadora ?? null,
    status: d.status ?? '',
    prev_entrega: d.prev_entrega ?? null,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    numero: f.numero ?? '',
    cliente: f.cliente ?? '',
    cidade: f.cidade ?? null,
    peso: f.peso ?? null,
    transportadora: f.transportadora ?? null,
    status: f.status ?? '',
    prev_entrega: f.prev_entrega ? f.prev_entrega.toISOString().split('T')[0] : null,
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
