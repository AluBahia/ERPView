import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface ProdutoSQL {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  preco_venda: number;
  custo_medio: number;
  ativo: string;
  data_atualizacao?: Date;
}

export async function syncProdutos(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de produtos');

  const fonte = await retry(() => query<ProdutoSQL>(`
    SELECT 
      CAST(Produto AS VARCHAR(36)) AS id,
      Referencia AS codigo,
      Nome AS descricao,
      Unidade AS unidade,
      Preco1 AS preco_venda,
      CustoRep AS custo_medio,
      Ativo AS ativo,
      DataAtualizacao AS data_atualizacao
    FROM Produtos
    WHERE Ativo = 'S'
  `), { label: 'query-produtos' });

  const { data: destinoData } = await supabase.from('produtos').select('*');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    codigo: d.codigo ?? '',
    descricao: d.descricao ?? '',
    unidade: d.unidade ?? '',
    preco_venda: d.preco_venda ?? 0,
    custo_medio: d.custo_medio ?? 0,
    ativo: d.ativo ?? true,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    codigo: f.codigo ?? '',
    descricao: f.descricao ?? '',
    unidade: f.unidade ?? '',
    preco_venda: f.preco_venda ?? 0,
    custo_medio: f.custo_medio ?? 0,
    ativo: f.ativo === 'S',
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
    await retry(() => supabase.from('produtos').update({ ativo: false }).in('id', delta.deletados).then(r => r as any), {
      label: 'soft-delete-produtos',
    });
  }

  logger.info(`Produtos: +${delta.inseridos.length} ~${delta.atualizados.length} -${delta.deletados.length}`);
  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
