import { query } from '../db/sqlserver.js';
import { supabase, fetchAll } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface EstoqueSQL {
  codigo: string;
  descricao: string;
  quantidade: number;
  data_atualizacao?: Date;
}

export async function syncEstoque(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de estoque');

  const fonte = await retry(() => query<EstoqueSQL>(`
    SELECT 
      P.Referencia AS codigo,
      P.Nome AS descricao,
      E.Quantidade AS quantidade,
      NULL AS data_atualizacao
    FROM EstoqueProduto E
    INNER JOIN Produtos P ON P.Produto = E.Produto
  `), { label: 'query-estoque' });

  const destinoData = await fetchAll('itens_estoque', 'id,codigo,descricao,deposito,saldo,minimo,status,cobertura');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    codigo: d.codigo ?? '',
    descricao: d.descricao ?? '',
    deposito: d.deposito ?? null,
    saldo: d.saldo ?? 0,
    minimo: d.minimo ?? 0,
    status: d.status ?? null,
    cobertura: d.cobertura ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    codigo: f.codigo ?? '',
    descricao: f.descricao ?? '',
    saldo: f.quantidade ?? 0,
    minimo: 0,
    status: 'OK',
    cobertura: '',
    deposito: 'Principal',
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'codigo');

  if (delta.inseridos.length > 0) {
    await retry(() => supabase.from('itens_estoque').insert(delta.inseridos).then(r => r as any), { label: 'insert-estoque' });
  }
  if (delta.atualizados.length > 0) {
    for (const e of delta.atualizados) {
      await retry(() => supabase.from('itens_estoque').update(e).eq('codigo', e.codigo).then(r => r as any), { label: 'update-estoque' });
    }
  }
  if (delta.deletados.length > 0) {
    await retry(() => supabase.from('itens_estoque').delete().in('codigo', delta.deletados).then(r => r as any), { label: 'delete-estoque' });
  }

  logger.info(`Estoque: +${delta.inseridos.length} ~${delta.atualizados.length} -${delta.deletados.length}`);
  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
