import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface OrdemServicoSQL {
  id: string;
  numero: string;
  tipo: string;
  status: string;
  equipamento?: string;
  descricao?: string;
  tecnico?: string;
  data_abertura?: Date;
  data_conclusao?: Date;
  data_alteracao?: Date;
}

interface OrdemServicoSupabase {
  id: string;
  numero: string;
  tipo: string;
  status: string;
  equipamento: string | null;
  descricao: string | null;
  tecnico: string | null;
  data_abertura: string | null;
  data_conclusao: string | null;
  updated_at: string | null;
}

export async function syncManutencao(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de ordens de serviço (manutenção)');

  const fonte = await retry(() => query<OrdemServicoSQL>(`
    SELECT
      CAST(id AS VARCHAR(36)) AS id,
      numero,
      tipo,
      status,
      equipamento,
      descricao,
      tecnico,
      data_abertura,
      data_conclusao,
      data_alteracao
    FROM ordens_servico
    WHERE status NOT IN ('Cancelado')
  `), { label: 'query-manutencao' });

  const { data: destinoData } = await supabase.from('ordens_servico').select('*');
  const destino: OrdemServicoSupabase[] = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    numero: d.numero,
    tipo: d.tipo,
    status: d.status,
    equipamento: d.equipamento ?? null,
    descricao: d.descricao ?? null,
    tecnico: d.tecnico ?? null,
    data_abertura: d.data_abertura ?? null,
    data_conclusao: d.data_conclusao ?? null,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    numero: f.numero,
    tipo: f.tipo,
    status: f.status,
    equipamento: f.equipamento ?? null,
    descricao: f.descricao ?? null,
    tecnico: f.tecnico ?? null,
    data_abertura: f.data_abertura ? f.data_abertura.toISOString() : null,
    data_conclusao: f.data_conclusao ? f.data_conclusao.toISOString() : null,
    updated_at: f.data_alteracao ? f.data_alteracao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    const toInsert = delta.inseridos.map((o) => ({
      ...o,
      created_at: new Date().toISOString(),
    }));
    await retry(() => supabase.from('ordens_servico').insert(toInsert).then(r => r as any), { label: 'insert-manutencao' });
    logger.info(`Inseridas ${delta.inseridos.length} ordens de serviço`);
  }

  if (delta.atualizados.length > 0) {
    for (const ordem of delta.atualizados) {
      await retry(
        () => supabase.from('ordens_servico').update(ordem).eq('id', ordem.id).then(r => r as any),
        { label: 'update-manutencao' }
      );
    }
    logger.info(`Atualizadas ${delta.atualizados.length} ordens de serviço`);
  }

  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
