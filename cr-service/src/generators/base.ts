import { execSync } from 'child_process';
import path from 'path';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export interface GerarRelatorioParams {
  nome: string;
  dataInicio?: string;
  dataFim?: string;
  [key: string]: string | undefined;
}

export interface ResultadoGeracao {
  pdfPath: string;
  tamanhoBytes: number;
  duracaoMs: number;
}

/**
 * Executa o script PowerShell que aciona o Crystal Reports Runtime.
 * O script aceita o nome do relatório e parâmetros em formato JSON.
 */
export async function executarScriptCR(params: GerarRelatorioParams): Promise<ResultadoGeracao> {
  const inicio = Date.now();
  const scriptPath = path.resolve(process.cwd(), 'scripts', 'gerar-relatorio.ps1');
  const paramsJson = JSON.stringify(params).replace(/"/g, '\\"');
  const nomeArquivo = `${params.nome}-${Date.now()}.pdf`;
  const pdfPath = path.join(config.cr.tempPath, nomeArquivo);

  const comando = `powershell.exe -NonInteractive -ExecutionPolicy Bypass -File "${scriptPath}" -NomeRelatorio "${params.nome}" -Parametros "${paramsJson}" -SaidaPdf "${pdfPath}"`;

  logger.info(`Executando script CR: ${params.nome}`, { params });

  try {
    execSync(comando, { timeout: 60_000, stdio: 'pipe' });
  } catch (err: any) {
    logger.error(`Erro ao executar script CR para ${params.nome}`, {
      stderr: err.stderr?.toString(),
      stdout: err.stdout?.toString(),
    });
    throw new Error(`Falha na geração do relatório ${params.nome}: ${err.message}`);
  }

  const fs = await import('fs');
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF não foi gerado em: ${pdfPath}`);
  }

  const { size } = fs.statSync(pdfPath);
  const duracaoMs = Date.now() - inicio;

  logger.info(`Relatório ${params.nome} gerado em ${duracaoMs}ms (${size} bytes)`);

  return { pdfPath, tamanhoBytes: size, duracaoMs };
}
