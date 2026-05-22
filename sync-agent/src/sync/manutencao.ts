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
      CAST(Codigo AS VARCHAR) AS numero,
      CAST(TipoOS AS VARCHAR) AS tipo,
      Status AS status,
      Descricao1 AS descricao,
      Data AS data_abertura,
      DataFechamento AS data_conclusao,
      DataAtualizacao AS data_atualizacao
    FROM OrdemServico
    WHERE Status NOT IN ('Cancelado')
  `), { label: 'query-manutencao' });

  const { data: destinoData } = await supabase.from('ordens_servico').select('*');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    numero: d.numero ?? '',
    tipo: d.tipo ?? '',
    status: d.status ?? '',
    descricao: d.descricao ?? null,
    data_abertura: d.data_abertura ?? null,
    data_conclusao: d.data_conclusao ?? null,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    numero: f.numero ?? '',
    tipo: f.tipo ?? '',
    status: f.status ?? '',
    descricao: f.descricao ?? null,
    data_abertura: f.data_abertura ? f.data_abertura.toISOString() : null,
    data_conclusao: f.data_conclusao ? f.data_conclusao.toISOString() : null,
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
