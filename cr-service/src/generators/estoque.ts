import { executarScriptCR, type ResultadoGeracao } from './base.js';

export interface ParamsRelatorioEstoque {
  dataInicio: string;
  dataFim?: string;
  almoxarifado?: string;
  apenasAbaixoMinimo?: string;
}

/**
 * Gera o relatório de Estoque Atual usando Crystal Reports.
 * Arquivo .rpt: EstoqueAtual.rpt
 */
export async function gerarRelatorioEstoque(params: ParamsRelatorioEstoque): Promise<ResultadoGeracao> {
  return executarScriptCR({
    nome: 'estoque-atual',
    rptFile: 'EstoqueAtual.rpt',
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
    almoxarifado: params.almoxarifado,
    apenasAbaixoMinimo: params.apenasAbaixoMinimo,
  });
}
