import { query } from '../db/sqlserver.js';
import { supabase, fetchAll } from '../db/supabase.js';
import { computeDelta } from '../utils/delta.js';
import { retry } from '../utils/retry.js';
import { logger } from '../logger.js';

interface TituloSQL {
  id: string;
  tipo: string;
  numero_documento: string;
  entidade_id: string;
  valor: number;
  vencimento: string;
  data_emissao: string;
  status: string;
  data_atualizacao?: Date;
}

export async function syncTitulos(): Promise<{ inseridos: number; atualizados: number; deletados: number }> {
  logger.info('Iniciando sync de titulos');

  const fonte = await retry(() => query<TituloSQL>(`
    SELECT 
      CAST(Id AS VARCHAR(36)) AS id,
      Tipo AS tipo,
      Documento AS numero_documento,
      CAST(COALESCE(Cliente, Fornecedor, 0) AS VARCHAR(36)) AS entidade_id,
      ValorDocumento AS valor,
      CONVERT(VARCHAR(10), DataVencimento, 120) AS vencimento,
      CONVERT(VARCHAR(10), DataEmissao, 120) AS data_emissao,
      Status AS status,
      DataAtualizacao AS data_atualizacao
    FROM Financeiro
    WHERE Status NOT IN ('Cancelado', 'Baixado')
  `), { label: 'query-titulos' });

  const tipoNormalizado = (tipo: string) => tipo.trim().toUpperCase();
  const receber = fonte.filter((f) => tipoNormalizado(f.tipo) === 'R' || tipoNormalizado(f.tipo).startsWith('R'));
  const pagar = fonte.filter((f) => tipoNormalizado(f.tipo) === 'P' || tipoNormalizado(f.tipo).startsWith('P'));

  const destinoReceberData = await fetchAll('titulos_receber', 'id,cliente_id,numero,emissao,vencimento,valor,status,dias_atraso,updated_at');
  const destinoReceber = (destinoReceberData || []).map((d: any) => ({
    id: String(d.id),
    cliente_id: d.cliente_id ?? null,
    numero: d.numero ?? '',
    emissao: d.emissao ?? null,
    vencimento: d.vencimento ?? null,
    valor: d.valor ?? 0,
    status: d.status ?? '',
    dias_atraso: d.dias_atraso ?? 0,
    updated_at: d.updated_at ?? null,
  }));

  const clienteIdFromERP = (raw: string | null | undefined) => {
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const fonteReceber = receber.map((f) => ({
    id: String(f.id),
    cliente_id: clienteIdFromERP(f.entidade_id),
    numero: f.numero_documento ?? '',
    emissao: f.data_emissao ?? '',
    vencimento: f.vencimento ?? '',
    valor: f.valor ?? 0,
    status: f.status ?? '',
    dias_atraso: 0,
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
  }));

  const deltaReceber = computeDelta(fonteReceber, destinoReceber, 'id', 'updated_at');

  if (deltaReceber.inseridos.length > 0) {
    await retry(() => supabase.from('titulos_receber').insert(deltaReceber.inseridos).then(r => r as any), { label: 'insert-titulos-receber' });
  }
  if (deltaReceber.atualizados.length > 0) {
    for (const t of deltaReceber.atualizados) {
      await retry(() => supabase.from('titulos_receber').update(t).eq('id', t.id).then(r => r as any), { label: 'update-titulo-receber' });
    }
  }
  if (deltaReceber.deletados.length > 0) {
    await retry(() => supabase.from('titulos_receber').delete().in('id', deltaReceber.deletados).then(r => r as any), { label: 'delete-titulos-receber' });
  }

  logger.info(`Titulos receber: +${deltaReceber.inseridos.length} ~${deltaReceber.atualizados.length} -${deltaReceber.deletados.length}`);

  const destinoPagarData = await fetchAll('titulos_pagar', 'id,fornecedor,numero,emissao,vencimento,valor,status,categoria,updated_at');
  const destinoPagar = (destinoPagarData || []).map((d: any) => ({
    id: String(d.id),
    fornecedor: d.fornecedor ?? '',
    numero: d.numero ?? '',
    emissao: d.emissao ?? null,
    vencimento: d.vencimento ?? null,
    valor: d.valor ?? 0,
    status: d.status ?? '',
    categoria: d.categoria ?? null,
    updated_at: d.updated_at ?? null,
  }));

  const fontePagar = pagar.map((f) => ({
    id: String(f.id),
    fornecedor: f.entidade_id ?? '',
    numero: f.numero_documento ?? '',
    emissao: f.data_emissao ?? '',
    vencimento: f.vencimento ?? '',
    valor: f.valor ?? 0,
    status: f.status ?? '',
    categoria: 'Geral',
    updated_at: f.data_atualizacao ? f.data_atualizacao.toISOString() : null,
  }));

  const deltaPagar = computeDelta(fontePagar, destinoPagar, 'id', 'updated_at');

  if (deltaPagar.inseridos.length > 0) {
    await retry(() => supabase.from('titulos_pagar').insert(deltaPagar.inseridos).then(r => r as any), { label: 'insert-titulos-pagar' });
  }
  if (deltaPagar.atualizados.length > 0) {
    for (const t of deltaPagar.atualizados) {
      await retry(() => supabase.from('titulos_pagar').update(t).eq('id', t.id).then(r => r as any), { label: 'update-titulo-pagar' });
    }
  }
  if (deltaPagar.deletados.length > 0) {
    await retry(() => supabase.from('titulos_pagar').delete().in('id', deltaPagar.deletados).then(r => r as any), { label: 'delete-titulos-pagar' });
  }

  logger.info(`Titulos pagar: +${deltaPagar.inseridos.length} ~${deltaPagar.atualizados.length} -${deltaPagar.deletados.length}`);

  const totalInseridos = deltaReceber.inseridos.length + deltaPagar.inseridos.length;
  const totalAtualizados = deltaReceber.atualizados.length + deltaPagar.atualizados.length;
  const totalDeletados = deltaReceber.deletados.length + deltaPagar.deletados.length;

  return {
    inseridos: totalInseridos,
    atualizados: totalAtualizados,
    deletados: totalDeletados,
  };
}
