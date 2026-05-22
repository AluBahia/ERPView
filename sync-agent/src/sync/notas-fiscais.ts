import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface NotaFiscalSQL {
  id: string;
  numero: string;
  serie: string;
  entidade_id: string;
  valor_total: number;
  data_emissao: string;
  status: string;
  tipo: string;
  data_atualizacao?: Date;
}

export async function syncNotasFiscais(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de notas fiscais');

  const fonte = await retry(() => query<NotaFiscalSQL>(`
    SELECT 
      CAST(Numero AS VARCHAR(36)) AS id,
      CAST(Numero AS VARCHAR) AS numero,
      Serie AS serie,
      CAST(COALESCE(Codigo, 0) AS VARCHAR(36)) AS entidade_id,
      COALESCE(ValorTotal, 0) AS valor_total,
      CONVERT(VARCHAR(10), DataEmissao, 120) AS data_emissao,
      Status AS status,
      Origem AS tipo,
      DataAtualizacao AS data_atualizacao
    FROM CtrlNotaFiscal
  `), { label: 'query-notas-fiscais' });

  const { data: destinoData } = await supabase.from('notas_fiscais').select('*');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    numero: d.numero ?? '',
    serie: d.serie ?? '',
    entidade_id: d.entidade_id ?? '0',
    valor_total: d.valor_total ?? 0,
    data_emissao: d.data_emissao ?? '',
    status: d.status ?? '',
    tipo: d.tipo ?? 'Saída',
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    numero: f.numero ?? '',
    serie: f.serie ?? '',
    entidade_id: f.entidade_id ?? '0',
    valor_total: f.valor_total ?? 0,
    data_emissao: f.data_emissao ?? '',
    status: f.status ?? '',
    tipo: f.tipo ?? 'Saída',
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    await retry(() => supabase.from('notas_fiscais').insert(delta.inseridos).then(r => r as any), { label: 'insert-nfs' });
  }
  if (delta.atualizados.length > 0) {
    for (const nf of delta.atualizados) {
      await retry(() => supabase.from('notas_fiscais').update(nf).eq('id', nf.id).then(r => r as any), { label: 'update-nf' });
    }
  }
  if (delta.deletados.length > 0) {
    await retry(() => supabase.from('notas_fiscais').delete().in('id', delta.deletados).then(r => r as any), { label: 'delete-nfs' });
  }

  logger.info(`NFs: +${delta.inseridos.length} ~${delta.atualizados.length} -${delta.deletados.length}`);
  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
