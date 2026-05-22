import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface TituloSQL {
  id: string;
  tipo: 'receber' | 'pagar';
  numero_documento: string;
  entidade_id: string;
  valor: number;
  valor_pago: number;
  vencimento: string;
  data_emissao: string;
  status: string;
  data_alteracao?: Date;
}

export async function syncTitulos(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de titulos');

  const fonte = await retry(() => query<TituloSQL>(`
    SELECT 
      CAST(id AS VARCHAR(36)) AS id,
      tipo,
      numero_documento,
      CAST(entidade_id AS VARCHAR(36)) AS entidade_id,
      valor,
      valor_pago,
      CONVERT(VARCHAR(10), vencimento, 120) AS vencimento,
      CONVERT(VARCHAR(10), data_emissao, 120) AS data_emissao,
      status,
      data_alteracao
    FROM titulos
  `), { label: 'query-titulos' });

  const { data: destinoData } = await supabase.from('titulos').select('*');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    tipo: d.tipo,
    numero_documento: d.numero_documento,
    entidade_id: d.entidade_id,
    valor: d.valor,
    valor_pago: d.valor_pago,
    vencimento: d.vencimento,
    data_emissao: d.data_emissao,
    status: d.status,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    tipo: f.tipo,
    numero_documento: f.numero_documento,
    entidade_id: f.entidade_id,
    valor: f.valor,
    valor_pago: f.valor_pago,
    vencimento: f.vencimento,
    data_emissao: f.data_emissao,
    status: f.status,
    updated_at: f.data_alteracao ? f.data_alteracao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    await retry(() => supabase.from('titulos').insert(delta.inseridos).then(r => r as any), { label: 'insert-titulos' });
  }
  if (delta.atualizados.length > 0) {
    for (const t of delta.atualizados) {
      await retry(() => supabase.from('titulos').update(t).eq('id', t.id).then(r => r as any), { label: 'update-titulo' });
    }
  }
  if (delta.deletados.length > 0) {
    await retry(() => supabase.from('titulos').delete().in('id', delta.deletados).then(r => r as any), { label: 'delete-titulos' });
  }

  logger.info(`Titulos: +${delta.inseridos.length} ~${delta.atualizados.length} -${delta.deletados.length}`);
  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
