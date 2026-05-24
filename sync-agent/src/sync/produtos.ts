import { query } from '../db/sqlserver.js';
import { supabase, fetchAll } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface ProdutoSQL {
  id: string;
  codigo: string;
  descricao: string;
  preco_venda: number;
  custo_medio: number;
  data_atualizacao?: Date;
}

export async function syncProdutos(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de produtos');

  const fonte = await retry(() => query<ProdutoSQL>(`
    SELECT 
      CAST(Produto AS VARCHAR(36)) AS id,
      Referencia AS codigo,
      Nome AS descricao,
      Preco1 AS preco_venda,
      CustoRep AS custo_medio,
      DataAtualizacao AS data_atualizacao
    FROM Produtos
    WHERE Ativo = 'S'
  `), { label: 'query-produtos' });

  const destinoData = await fetchAll('produtos', 'id,codigo,descricao,familia,custo,preco_venda,margem,giro,updated_at');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    codigo: d.codigo ?? '',
    descricao: d.descricao ?? '',
    familia: d.familia ?? null,
    custo: d.custo ?? 0,
    preco_venda: d.preco_venda ?? 0,
    margem: d.margem ?? 0,
    giro: d.giro ?? null,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    codigo: f.codigo ?? '',
    descricao: f.descricao ?? '',
    familia: 'Geral',
    custo: f.custo_medio ?? 0,
    preco_venda: f.preco_venda ?? 0,
    margem: f.preco_venda > 0 ? ((f.preco_venda - (f.custo_medio ?? 0)) / f.preco_venda) * 100 : 0,
    giro: 'Médio',
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    await retry(() => supabase.from('produtos').insert(delta.inseridos).then(r => r as any), { label: 'insert-produtos' });
  }
  if (delta.atualizados.length > 0) {
    for (const p of delta.atualizados) {
      await retry(() => supabase.from('produtos').update(p).eq('id', p.id).then(r => r as any), { label: 'update-produto' });
    }
  }
  if (delta.deletados.length > 0) {
    await retry(() => supabase.from('produtos').delete().in('id', delta.deletados).then(r => r as any), {
      label: 'delete-produtos',
    });
  }

  logger.info(`Produtos: +${delta.inseridos.length} ~${delta.atualizados.length} -${delta.deletados.length}`);
  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
