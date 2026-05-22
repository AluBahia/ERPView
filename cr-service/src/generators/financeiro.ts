import { executarScriptCR, type ResultadoGeracao } from './base.js';

export interface ParamsRelatorioTitulos {
  dataInicio: string;
  dataFim: string;
  status?: string;
  clienteId?: string;
  fornecedorId?: string;
}

export interface ParamsRelatorioDRE {
  dataInicio: string;
  dataFim: string;
  periodo?: string;
}

export interface ParamsRelatorioFluxoCaixa {
  dataInicio: string;
  dataFim: string;
  tipo?: string;
}

/**
 * Gera o relatório de Títulos a Receber usando Crystal Reports.
 * Arquivo .rpt: TitulosReceber.rpt
 */
export async function gerarRelatorioTitulosReceber(params: ParamsRelatorioTitulos): Promise<ResultadoGeracao> {
  return executarScriptCR({
    nome: 'titulos-receber',
    rptFile: 'TitulosReceber.rpt',
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
    status: params.status,
    clienteId: params.clienteId,
  });
}

/**
 * Gera o relatório de Títulos a Pagar usando Crystal Reports.
 * Arquivo .rpt: TitulosPagar.rpt
 */
export async function gerarRelatorioTitulosPagar(params: ParamsRelatorioTitulos): Promise<ResultadoGeracao> {
  return executarScriptCR({
    nome: 'titulos-pagar',
    rptFile: 'TitulosPagar.rpt',
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
    status: params.status,
    fornecedorId: params.fornecedorId,
  });
}

/**
 * Gera o relatório de DRE Mensal usando Crystal Reports.
 * Arquivo .rpt: DREMensal.rpt
 */
export async function gerarRelatorioDRE(params: ParamsRelatorioDRE): Promise<ResultadoGeracao> {
  return executarScriptCR({
    nome: 'dre-mensal',
    rptFile: 'DREMensal.rpt',
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
    periodo: params.periodo,
  });
}

/**
 * Gera o relatório de Fluxo de Caixa usando Crystal Reports.
 * Arquivo .rpt: FluxoCaixa.rpt
 */
export async function gerarRelatorioFluxoCaixa(params: ParamsRelatorioFluxoCaixa): Promise<ResultadoGeracao> {
  return executarScriptCR({
    nome: 'fluxo-caixa',
    rptFile: 'FluxoCaixa.rpt',
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
    tipo: params.tipo,
  });
}
