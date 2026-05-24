import { query } from '../db/sqlserver.js';
import { supabase, fetchAll } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface ClienteSQL {
  id: string;
  nome: string;
  data_atualizacao?: Date;
}

export async function syncClientes(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de clientes');

  const fonte = await retry(() => query<ClienteSQL>(`
    SELECT 
      CAST(Cliente AS VARCHAR(36)) AS id,
      Nome AS nome,
      DataAtualizacao AS data_atualizacao
    FROM Clientes
    WHERE Ativo = 'S'
  `), { label: 'query-clientes' });

  const destinoData = await fetchAll('clientes', 'id,codigo,nome,segmento,volume_compras,frequencia,prazo_medio,classe_abc,status_credito,updated_at');
  const destino: {
    id: string;
    codigo: string;
    nome: string;
    segmento: string | null;
    volume_compras: number | null;
    frequencia: string | null;
    prazo_medio: string | null;
    classe_abc: string | null;
    status_credito: string | null;
    updated_at: string | null;
  }[] = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    codigo: d.codigo ?? '',
    nome: d.nome ?? '',
    segmento: d.segmento ?? null,
    volume_compras: d.volume_compras ?? 0,
    frequencia: d.frequencia ?? null,
    prazo_medio: d.prazo_medio ?? null,
    classe_abc: d.classe_abc ?? null,
    status_credito: d.status_credito ?? null,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    codigo: String(f.id),
    nome: f.nome ?? '',
    segmento: 'Geral',
    volume_compras: 0,
    frequencia: 'Eventual',
    prazo_medio: 'Fatura',
    classe_abc: 'C',
    status_credito: 'OK',
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
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
      () => supabase.from('clientes').delete().in('id', delta.deletados).then(r => r as any),
      { label: 'delete-clientes' }
    );
    logger.info(`Removidos ${delta.deletados.length} clientes`);
  }

  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
