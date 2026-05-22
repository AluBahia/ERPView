import { executarScriptCR, type ResultadoGeracao } from './base.js';

export interface ParamsRelatorioCompras {
  dataInicio: string;
  dataFim: string;
  fornecedorId?: string;
  status?: string;
}

/**
 * Gera o relatório de Compras por Período usando Crystal Reports.
 * Arquivo .rpt: ComprasPeriodo.rpt
 */
export async function gerarRelatorioCompras(params: ParamsRelatorioCompras): Promise<ResultadoGeracao> {
  return executarScriptCR({
    nome: 'compras-periodo',
    rptFile: 'ComprasPeriodo.rpt',
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
    fornecedorId: params.fornecedorId,
    status: params.status,
  });
}
