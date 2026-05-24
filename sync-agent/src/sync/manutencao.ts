import { query } from '../db/sqlserver.js';
import { supabase, fetchAll } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface OrdemServicoSQL {
  id: string;
  tipo: string;
  status: string;
  descricao?: string;
  data_abertura?: Date;
  data_conclusao?: Date;
  data_atualizacao?: Date;
}

export async function syncManutencao(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de ordens de serviço (manutenção)');

  const fonte = await retry(() => query<OrdemServicoSQL>(`
    SELECT
      CAST(Codigo AS VARCHAR(36)) AS id,
      CAST(TipoOS AS VARCHAR) AS tipo,
      Status AS status,
      Descricao1 AS descricao,
      Data AS data_abertura,
      DataFechamento AS data_conclusao,
      DataAtualizacao AS data_atualizacao
    FROM OrdemServico
    WHERE Status NOT IN ('Cancelado')
  `), { label: 'query-manutencao' });

  const destinoData = await fetchAll('ordens_servico', 'id,equipamento,tipo,prioridade,abertura,prev_conclusao,status,updated_at');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    equipamento: d.equipamento ?? '',
    tipo: d.tipo ?? '',
    prioridade: d.prioridade ?? null,
    status: d.status ?? '',
    abertura: d.abertura ?? null,
    prev_conclusao: d.prev_conclusao ?? null,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    equipamento: f.descricao ?? '',
    tipo: f.tipo ?? '',
    prioridade: 'Média',
    status: f.status ?? '',
    abertura: f.data_abertura ? f.data_abertura.toISOString().split('T')[0] : null,
    prev_conclusao: f.data_conclusao ? f.data_conclusao.toISOString().split('T')[0] : null,
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
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
