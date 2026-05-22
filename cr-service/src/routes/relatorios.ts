import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import { validateAuth } from '../auth.js';
import { getCacheKey, getCachedPdf, setCachedPdf } from '../utils/pdf-cache.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { gerarRelatorioVendas } from '../generators/vendas.js';
import { gerarRelatorioCompras } from '../generators/compras.js';
import { gerarRelatorioEstoque } from '../generators/estoque.js';
import {
  gerarRelatorioTitulosReceber,
  gerarRelatorioTitulosPagar,
  gerarRelatorioDRE,
  gerarRelatorioFluxoCaixa,
} from '../generators/financeiro.js';
import { gerarRelatorioNotasFiscais } from '../generators/fiscal.js';

const relatoriosDisponiveis = [
  'vendas-periodo',
  'compras-periodo',
  'estoque-atual',
  'titulos-receber',
  'titulos-pagar',
  'dre-mensal',
  'fluxo-caixa',
  'notas-fiscais',
];

const paramsSchema = z.object({
  nome: z.string(),
});

type RelatorioQuery = {
  dataInicio?: string;
  dataFim?: string;
  clienteId?: string;
  fornecedorId?: string;
  status?: string;
  almoxarifado?: string;
  apenasAbaixoMinimo?: string;
  tipoNF?: string;
  cfop?: string;
  periodo?: string;
  tipo?: string;
};

async function despacharGerador(nome: string, query: RelatorioQuery) {
  if (!query.dataInicio) {
    throw new Error('dataInicio é obrigatória');
  }
  const dataFim = query.dataFim ?? new Date().toISOString().split('T')[0];

  switch (nome) {
    case 'vendas-periodo':
      return gerarRelatorioVendas({ dataInicio: query.dataInicio, dataFim, clienteId: query.clienteId, status: query.status });
    case 'compras-periodo':
      return gerarRelatorioCompras({ dataInicio: query.dataInicio, dataFim, fornecedorId: query.fornecedorId, status: query.status });
    case 'estoque-atual':
      return gerarRelatorioEstoque({ dataInicio: query.dataInicio, dataFim, almoxarifado: query.almoxarifado, apenasAbaixoMinimo: query.apenasAbaixoMinimo });
    case 'titulos-receber':
      return gerarRelatorioTitulosReceber({ dataInicio: query.dataInicio, dataFim, status: query.status, clienteId: query.clienteId });
    case 'titulos-pagar':
      return gerarRelatorioTitulosPagar({ dataInicio: query.dataInicio, dataFim, status: query.status, fornecedorId: query.fornecedorId });
    case 'dre-mensal':
      return gerarRelatorioDRE({ dataInicio: query.dataInicio, dataFim, periodo: query.periodo });
    case 'fluxo-caixa':
      return gerarRelatorioFluxoCaixa({ dataInicio: query.dataInicio, dataFim, tipo: query.tipo });
    case 'notas-fiscais':
      return gerarRelatorioNotasFiscais({ dataInicio: query.dataInicio, dataFim, tipoNF: query.tipoNF, cfop: query.cfop });
    default:
      throw new Error(`Relatório desconhecido: ${nome}`);
  }
}

export async function relatoriosRoutes(fastify: FastifyInstance) {
  fastify.get('/relatorios/:nome', async (request: FastifyRequest, reply: FastifyReply) => {
    const authResult = await validateAuth(request, reply);
    if (authResult) return authResult;

    const parsed = paramsSchema.safeParse(request.params);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.format() });
    }

    const { nome } = parsed.data;
    const query = request.query as RelatorioQuery;

    if (!relatoriosDisponiveis.includes(nome)) {
      return reply.status(404).send({ error: 'Relatório não encontrado' });
    }

    if (!query.dataInicio) {
      return reply.status(400).send({ error: 'dataInicio é obrigatória' });
    }

    const cacheKey = getCacheKey(nome, query as Record<string, string>);
    const cachedPath = getCachedPdf(cacheKey, config.cr.cacheTtlMinutes);

    if (cachedPath && fs.existsSync(cachedPath)) {
      logger.info(`Cache hit para relatório ${nome}`);
      const pdfBuffer = fs.readFileSync(cachedPath);
      return reply
        .status(200)
        .header('Content-Type', 'application/pdf')
        .header('Content-Disposition', `attachment; filename="${nome}.pdf"`)
        .send(pdfBuffer);
    }

    try {
      const resultado = await despacharGerador(nome, query);
      setCachedPdf(cacheKey, resultado.pdfPath);

      logger.info(`Relatório ${nome} gerado em ${resultado.duracaoMs}ms`);

      const pdfBuffer = fs.readFileSync(resultado.pdfPath);
      return reply
        .status(200)
        .header('Content-Type', 'application/pdf')
        .header('Content-Disposition', `attachment; filename="${nome}.pdf"`)
        .send(pdfBuffer);
    } catch (err) {
      const msg = (err as Error).message;
      logger.error(`Falha ao gerar relatório ${nome}`, { error: msg });
      return reply.status(500).send({ error: 'Falha ao gerar relatório', detalhe: msg });
    }
  });
}
