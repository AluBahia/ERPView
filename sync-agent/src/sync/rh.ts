import { query } from '../db/sqlserver.js';
import { supabase } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface ColaboradorSQL {
  id: string;
  matricula: string;
  nome: string;
  cargo: string;
  departamento: string;
  salario: number;
  data_admissao: Date;
  status: string;
  data_alteracao?: Date;
}

interface ColaboradorSupabase {
  id: string;
  matricula: string;
  nome: string;
  cargo: string;
  departamento: string;
  salario: number;
  data_admissao: string;
  status: string;
  updated_at: string | null;
}

export async function syncRH(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de colaboradores (RH)');

  const fonte = await retry(() => query<ColaboradorSQL>(`
    SELECT
      CAST(id AS VARCHAR(36)) AS id,
      matricula,
      nome,
      cargo,
      departamento,
      salario,
      data_admissao,
      status,
      data_alteracao
    FROM colaboradores
    WHERE status NOT IN ('Desligado')
  `), { label: 'query-rh' });

  const { data: destinoData } = await supabase.from('rh_colaboradores').select('*');
  const destino: ColaboradorSupabase[] = (destinoData || []).map((d: any) => ({
    id: String(d.id),
    matricula: d.matricula,
    nome: d.nome,
    cargo: d.cargo,
    departamento: d.departamento,
    salario: d.salario,
    data_admissao: d.data_admissao,
    status: d.status,
    updated_at: d.updated_at ?? null,
  }));

  const fonteNormalizada = fonte.map((f) => ({
    id: String(f.id),
    matricula: f.matricula,
    nome: f.nome,
    cargo: f.cargo,
    departamento: f.departamento,
    salario: f.salario,
    data_admissao: f.data_admissao instanceof Date ? f.data_admissao.toISOString().split('T')[0] : String(f.data_admissao),
    status: f.status,
    updated_at: f.data_alteracao ? f.data_alteracao.toISOString() : null,
  }));

  const delta = computeDelta(fonteNormalizada, destino, 'id', 'updated_at');

  if (delta.inseridos.length > 0) {
    const toInsert = delta.inseridos.map((c) => ({
      ...c,
      created_at: new Date().toISOString(),
    }));
    await retry(() => supabase.from('rh_colaboradores').insert(toInsert).then(r => r as any), { label: 'insert-rh' });
    logger.info(`Inseridos ${delta.inseridos.length} colaboradores`);
  }

  if (delta.atualizados.length > 0) {
    for (const colaborador of delta.atualizados) {
      await retry(
        () => supabase.from('rh_colaboradores').update(colaborador).eq('id', colaborador.id).then(r => r as any),
        { label: 'update-rh' }
      );
    }
    logger.info(`Atualizados ${delta.atualizados.length} colaboradores`);
  }

  if (delta.deletados.length > 0) {
    await retry(
      () => supabase.from('rh_colaboradores').update({ status: 'Desligado' }).in('id', delta.deletados).then(r => r as any),
      { label: 'soft-delete-rh' }
    );
    logger.info(`Marcados como Desligados ${delta.deletados.length} colaboradores`);
  }

  return {
    inseridos: delta.inseridos.length,
    atualizados: delta.atualizados.length,
    deletados: delta.deletados.length,
  };
}
