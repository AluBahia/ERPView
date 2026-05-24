import { query } from '../db/sqlserver.js';
import { supabase, fetchAll } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface FornecedorSQL {
  id: string;
  nome: string;
  data_atualizacao?: Date;
}

export async function syncFornecedores(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de fornecedores');

  const fonte = await retry(() => query<FornecedorSQL>(`
    SELECT 
      CAST(Fornecedor AS VARCHAR(36)) AS id,
      Nome AS nome,
      DataAtualizacao AS data_atualizacao
    FROM Fornecedor
    WHERE Ativo = 'S'
  `), { label: 'query-fornecedores' });

  const destinoData = await fetchAll('fornecedores', 'id,nome,categoria,avaliacao,homologacao,documentacao,updated_at');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    nome: d.nome ?? '',
    categoria: d.categoria ?? null,
    avaliacao: d.avaliacao ?? null,
    homologacao: d.homologacao ?? null,
    documentacao: d.documentacao ?? null,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    nome: f.nome ?? '',
    categoria: 'Geral',
    avaliacao: 5.0,
    homologacao: 'Homologado',
    documentacao: 'OK',
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    const toInsert = delta.inseridos.map((f) => ({
      ...f,
      created_at: new Date().toISOString(),
    }));
    await retry(() => supabase.from('fornecedores').insert(toInsert).then(r => r as any), { label: 'insert-fornecedores' });
    logger.info(`Inseridos ${delta.inseridos.length} fornecedores`);
  }

  if (delta.atualizados.length > 0) {
    for (const fornecedor of delta.atualizados) {
      await retry(
        () => supabase.from('fornecedores').update(fornecedor).eq('id', fornecedor.id).then(r => r as any),
        { label: 'update-fornecedor' }
      );
    }
    logger.info(`Atualizados ${delta.atualizados.length} fornecedores`);
  }

  if (delta.deletados.length > 0) {
    await retry(
      () => supabase.from('fornecedores').delete().in('id', delta.deletados).then(r => r as any),
      { label: 'delete-fornecedores' }
    );
    logger.info(`Removidos ${delta.deletados.length} fornecedores`);
  }

  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
