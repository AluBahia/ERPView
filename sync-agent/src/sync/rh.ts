import { query } from '../db/sqlserver.js';
import { supabase, fetchAll } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface FuncionarioSQL {
  id: string;
  matricula: string;
  nome: string;
  cargo: string;
  data_admissao?: Date;
  status: string;
  data_atualizacao?: Date;
}

export async function syncRH(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de funcionários (RH)');

  const fonte = await retry(() => query<FuncionarioSQL>(`
    SELECT
      CAST(Matricula AS VARCHAR(36)) AS id,
      CAST(Matricula AS VARCHAR) AS matricula,
      Nome AS nome,
      CAST(Cargo AS VARCHAR) AS cargo,
      AdmData AS data_admissao,
      AdmStatus AS status,
      DataMov AS data_atualizacao
    FROM Funcionario
    WHERE AdmStatus NOT IN ('Desligado')
  `), { label: 'query-rh' });

  const destinoData = await fetchAll('rh_colaboradores', 'id,matricula,nome,cargo,data_admissao,status,updated_at');
  const destino = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    matricula: d.matricula ?? '',
    nome: d.nome ?? '',
    cargo: d.cargo ?? '',
    data_admissao: d.data_admissao ?? null,
    status: d.status ?? '',
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    matricula: f.matricula ?? '',
    nome: f.nome ?? '',
    cargo: f.cargo ?? '',
    data_admissao: f.data_admissao ? f.data_admissao.toISOString().split('T')[0] : null,
    status: f.status ?? '',
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    const toInsert = delta.inseridos.map((c) => ({
      ...c,
      created_at: new Date().toISOString(),
    }));
    await retry(() => supabase.from('rh_colaboradores').insert(toInsert).then(r => r as any), { label: 'insert-rh' });
    logger.info(`Inseridos ${delta.inseridos.length} funcionários`);
  }

  if (delta.atualizados.length > 0) {
    for (const func of delta.atualizados) {
      await retry(
        () => supabase.from('rh_colaboradores').update(func).eq('id', func.id).then(r => r as any),
        { label: 'update-rh' }
      );
    }
    logger.info(`Atualizados ${delta.atualizados.length} funcionários`);
  }

  if (delta.deletados.length > 0) {
    await retry(
      () => supabase.from('rh_colaboradores').update({ status: 'Desligado' }).in('id', delta.deletados).then(r => r as any),
      { label: 'soft-delete-rh' }
    );
    logger.info(`Marcados como Desligados ${delta.deletados.length} funcionários`);
  }

  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
