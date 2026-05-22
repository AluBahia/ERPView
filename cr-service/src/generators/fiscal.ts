import { executarScriptCR, type ResultadoGeracao } from './base.js';

export interface ParamsRelatorioFiscal {
  dataInicio: string;
  dataFim: string;
  tipoNF?: string;
  cfop?: string;
}

/**
 * Gera o relatório de Notas Fiscais usando Crystal Reports.
 * Arquivo .rpt: NotasFiscais.rpt
 */
export async function gerarRelatorioNotasFiscais(params: ParamsRelatorioFiscal): Promise<ResultadoGeracao> {
  return executarScriptCR({
    nome: 'notas-fiscais',
    rptFile: 'NotasFiscais.rpt',
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
    tipoNF: params.tipoNF,
    cfop: params.cfop,
  });
}
