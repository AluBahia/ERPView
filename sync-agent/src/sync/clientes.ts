import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface ClienteSQL {
  id: string;
  nome: string;
  cnpj: string;
  cidade: string;
  estado: string;
  email?: string;
  telefone?: string;
  ativo: boolean;
  data_alteracao?: Date;
}

interface ClienteSupabase {
  id: string;
  nome: string;
  cnpj: string;
  cidade: string;
  estado: string;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
  updated_at: string | null;
}

export async function syncClientes(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de clientes');

  const fonte = await retry(() => query<ClienteSQL>(`
    SELECT 
      CAST(id AS VARCHAR(36)) AS id,
      nome,
      cnpj,
      cidade,
      estado,
      email,
      telefone,
      ativo,
      data_alteracao
    FROM clientes
    WHERE ativo = 1
  `), { label: 'query-clientes' });

  const { data: destinoData } = await supabase.from('clientes').select('*');
  const destino: ClienteSupabase[] = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    nome: d.nome,
    cnpj: d.cnpj,
    cidade: d.cidade,
    estado: d.estado,
    email: d.email ?? null,
    telefone: d.telefone ?? null,
    ativo: d.ativo ?? true,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    nome: f.nome,
    cnpj: f.cnpj,
    cidade: f.cidade,
    estado: f.estado,
    email: f.email ?? null,
    telefone: f.telefone ?? null,
    ativo: f.ativo,
    updated_at: f.data_alteracao ? f.data_alteracao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    const toInsert = delta.inseridos.map((c) => ({
      ...c,
      created_at: new Date().toISOString(),
    }));
    await retry(() => supabase.from('clientes').insert(toInsert).then(r => r as any), { label: 'insert-clientes' });
    logger.info(`Inseridos ${delta.inseridos.length} clientes`);
  }

  if (delta.atualizados.length > 0) {
    for (const cliente of delta.atualizados) {
      await retry(
        () => supabase.from('clientes').update(cliente).eq('id', cliente.id).then(r => r as any),
        { label: 'update-cliente' }
      );
    }
    logger.info(`Atualizados ${delta.atualizados.length} clientes`);
  }

  if (delta.deletados.length > 0) {
    await retry(
      () => supabase.from('clientes').update({ ativo: false }).in('id', delta.deletados).then(r => r as any),
      { label: 'soft-delete-clientes' }
    );
    logger.info(`Soft-deleted ${delta.deletados.length} clientes`);
  }

  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
