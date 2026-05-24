import { query } from '../db/sqlserver.js';
import { supabase, fetchAll } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface NotaFiscalSQL {
  id: string;
  numero: string;
  contraparte: string;
  valor: number;
  data_emissao: string;
  status: string;
  tipo: string;
  data_atualizacao?: Date;
}

export async function syncNotasFiscais(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de notas fiscais');

  const fonte = await retry(() => query<NotaFiscalSQL>(`
    SELECT 
      CAST(N.Numero AS VARCHAR(36)) AS id,
      CAST(N.Numero AS VARCHAR) AS numero,
      COALESCE(C.Nome, F.Nome, 'Desconhecido') AS contraparte,
      COALESCE(N.ValorTotal, 0) AS valor,
      CONVERT(VARCHAR(10), N.DataEmissao, 120) AS data_emissao,
      N.Status AS status,
      CASE
        WHEN N.Origem IN ('Entrada', 'ENTRADA') THEN 'Entrada'
        WHEN N.Origem IN ('Saida', 'Saída', 'SAIDA') THEN 'Saída'
        ELSE N.Origem
      END AS tipo,
      N.DataEmissao AS data_atualizacao
    FROM CtrlNotaFiscal N
    LEFT JOIN Clientes C ON C.Cliente = N.Codigo
    LEFT JOIN Fornecedor F ON F.Fornecedor = N.Codigo
  `), { label: 'query-notas-fiscais' });

  const destinoData = await fetchAll('notas_fiscais', 'id,numero,contraparte,data_emissao,valor,tipo,status,updated_at');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    numero: d.numero ?? '',
    contraparte: d.contraparte ?? '',
    valor: d.valor ?? 0,
    data_emissao: d.data_emissao ?? '',
    status: d.status ?? '',
    tipo: d.tipo ?? 'Saída',
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    numero: f.numero ?? '',
    contraparte: f.contraparte ?? '',
    valor: f.valor ?? 0,
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
