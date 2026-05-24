import { syncClientes } from './clientes.js';
import { syncProdutos } from './produtos.js';
import { syncEstoque } from './estoque.js';
import { syncTitulos } from './titulos.js';
import { syncPedidosVenda } from './pedidos-venda.js';
import { syncNotasFiscais } from './notas-fiscais.js';
import { syncFornecedores } from './fornecedores.js';
import { syncProducao } from './producao.js';
import { syncExpedicao } from './expedicao.js';
import { syncManutencao } from './manutencao.js';
import { syncRH } from './rh.js';
import { syncPatrimonio } from './patrimonio.js';
import { supabase } from '../db/supabase.js';
import { logger } from '../logger.js';

export interface SyncResult {
  modulo: string;
  inseridos: number;
  atualizados: number;
  deletados: number;
  duracaoMs: number;
  sucesso: boolean;
  erro?: string;
}

const syncModules: { name: string; fn: () => Promise<{ inseridos: number; atualizados: number; deletados: number }> }[] = [
  { name: 'clientes', fn: syncClientes },
  { name: 'produtos', fn: syncProdutos },
  { name: 'estoque', fn: syncEstoque },
  { name: 'titulos', fn: syncTitulos },
  { name: 'pedidos-venda', fn: syncPedidosVenda },
  { name: 'notas-fiscais', fn: syncNotasFiscais },
  { name: 'fornecedores', fn: syncFornecedores },
  { name: 'producao', fn: syncProducao },
  { name: 'expedicao', fn: syncExpedicao },
  { name: 'manutencao', fn: syncManutencao },
  { name: 'rh', fn: syncRH },
  { name: 'patrimonio', fn: syncPatrimonio },
];

export async function runAllSyncs(): Promise<SyncResult[]> {
  logger.info('=== ORQUESTRADOR: Iniciando ciclo de sync ===');
  const results: SyncResult[] = [];

  for (const mod of syncModules) {
    const inicio = Date.now();
    try {
      const res = await mod.fn();
      const duracaoMs = Date.now() - inicio;
      results.push({
        modulo: mod.name,
        ...res,
        duracaoMs,
        sucesso: true,
      });
      logger.info(`Sync ${mod.name} concluído em ${duracaoMs}ms`);
    } catch (err) {
      const duracaoMs = Date.now() - inicio;
      const erro = (err as Error).message;
      results.push({
        modulo: mod.name,
        inseridos: 0,
        atualizados: 0,
        deletados: 0,
        duracaoMs,
        sucesso: false,
        erro,
      });
      logger.error(`Sync ${mod.name} falhou após ${duracaoMs}ms: ${erro}`);
    }
  }

  await writeLogAuditoria(results);
  logger.info('=== ORQUESTRADOR: Ciclo de sync finalizado ===');
  return results;
}

async function writeLogAuditoria(results: SyncResult[]): Promise<void> {
  try {
    const totalInseridos = results.reduce((s, r) => s + r.inseridos, 0);
    const totalAtualizados = results.reduce((s, r) => s + r.atualizados, 0);
    const totalErros = results.filter((r) => !r.sucesso).length;

    await supabase.from('log_auditoria').insert({
      acao: 'sync',
      tabela: 'sistema',
      dados: {
        resultados: results,
        totalInseridos,
        totalAtualizados,
        totalErros,
      },
      timestamp: new Date().toISOString(),
    }).then(r => r as any);
  } catch (err) {
    logger.error('Falha ao gravar log_auditoria', { error: (err as Error).message });
  }
}

export async function sendHeartbeat(): Promise<void> {
  try {
    await supabase.from('log_auditoria').insert({
      acao: 'heartbeat',
      tabela: 'sistema',
      dados: { status: 'running', timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString(),
    }).then(r => r as any);
    logger.debug('Heartbeat enviado');
  } catch (err) {
    logger.error('Falha ao enviar heartbeat', { error: (err as Error).message });
  }
}
