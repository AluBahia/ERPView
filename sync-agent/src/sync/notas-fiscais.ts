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
  tipo: 'entrada' | 'saida';
  data_alteracao?: Date;
}

export async function syncNotasFiscais(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de notas fiscais');

  const fonte = await retry(() => query<NotaFiscalSQL>(`
    SELECT 
      CAST(id AS VARCHAR(36)) AS id,
      numero,
      serie,
      CAST(entidade_id AS VARCHAR(36)) AS entidade_id,
      valor_total,
      CONVERT(VARCHAR(10), data_emissao, 120) AS data_emissao,
      status,
      tipo,
      data_alteracao
    FROM notas_fiscais
  `), { label: 'query-notas-fiscais' });

  const { data: destinoData } = await supabase.from('notas_fiscais').select('*');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    numero: d.numero,
    serie: d.serie,
    entidade_id: d.entidade_id,
    valor_total: d.valor_total,
    data_emissao: d.data_emissao,
    status: d.status,
    tipo: d.tipo,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    numero: f.numero,
    serie: f.serie,
    entidade_id: f.entidade_id,
    valor_total: f.valor_total,
    data_emissao: f.data_emissao,
    status: f.status,
    tipo: f.tipo,
    updated_at: f.data_alteracao ? f.data_alteracao.toISOString() : null,
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
