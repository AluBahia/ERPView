import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface TituloSQL {
  id: string;
  tipo: string;
  numero_documento: string;
  entidade_id: string;
  valor: number;
  valor_pago: number;
  vencimento: string;
  data_emissao: string;
  status: string;
  data_atualizacao?: Date;
}

export async function syncTitulos(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de titulos');

  const fonte = await retry(() => query<TituloSQL>(`
    SELECT 
      CAST(Id AS VARCHAR(36)) AS id,
      Tipo AS tipo,
      Documento AS numero_documento,
      CAST(COALESCE(Cliente, Fornecedor, 0) AS VARCHAR(36)) AS entidade_id,
      ValorDocumento AS valor,
      COALESCE(ValorPagamento, 0) AS valor_pago,
      CONVERT(VARCHAR(10), DataVencimento, 120) AS vencimento,
      CONVERT(VARCHAR(10), DataEmissao, 120) AS data_emissao,
      Status AS status,
      DataAtualizacao AS data_atualizacao
    FROM Financeiro
    WHERE Status NOT IN ('Cancelado', 'Baixado')
  `), { label: 'query-titulos' });

  const { data: destinoData } = await supabase.from('titulos').select('*');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    tipo: d.tipo ?? 'receber',
    numero_documento: d.numero_documento ?? '',
    entidade_id: d.entidade_id ?? '0',
    valor: d.valor ?? 0,
    valor_pago: d.valor_pago ?? 0,
    vencimento: d.vencimento ?? '',
    data_emissao: d.data_emissao ?? '',
    status: d.status ?? '',
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    tipo: f.tipo ?? 'receber',
    numero_documento: f.numero_documento ?? '',
    entidade_id: f.entidade_id ?? '0',
    valor: f.valor ?? 0,
    valor_pago: f.valor_pago ?? 0,
    vencimento: f.vencimento ?? '',
    data_emissao: f.data_emissao ?? '',
    status: f.status ?? '',
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
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
