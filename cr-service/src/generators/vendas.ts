import { executarScriptCR, type GerarRelatorioParams, type ResultadoGeracao } from './base.js';

export interface ParamsRelatorioVendas {
  dataInicio: string;
  dataFim: string;
  clienteId?: string;
  status?: string;
}

/**
 * Gera o relatório de Vendas por Período usando Crystal Reports.
 * Arquivo .rpt: VendasPeriodo.rpt
 */
export async function gerarRelatorioVendas(params: ParamsRelatorioVendas): Promise<ResultadoGeracao> {
  const crParams: GerarRelatorioParams = {
    nome: 'vendas-periodo',
    rptFile: 'VendasPeriodo.rpt',
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
    clienteId: params.clienteId,
    status: params.status,
  };

  return executarScriptCR(crParams);
}
