import 'dotenv/config';
import schedule from 'node-schedule';
import { runAllSyncs, sendHeartbeat } from './sync/orchestrator.js';
import { syncTitulos } from './sync/titulos.js';
import { sqlHealthCheck } from './db/sqlserver.js';
import { logger } from './logger.js';
import { config } from './config.js';

// Locks para evitar execuções concorrentes
let syncCompletoRodando = false;
let syncCriticoRodando = false;

async function main() {
  logger.info('Sync Agent iniciado');

  const healthy = await sqlHealthCheck();
  if (!healthy) {
    logger.error('SQL Server não está acessível. Encerrando.');
    process.exit(1);
  }

  // Sync completo a cada N minutos — pula se ainda estiver rodando
  schedule.scheduleJob(`*/${config.sync.intervalMinutes} * * * *`, async () => {
    if (syncCompletoRodando) {
      logger.warn('Sync completo ainda em execução — pulando ciclo para evitar concorrência.');
      return;
    }
    syncCompletoRodando = true;
    logger.info('Agendador: iniciando sync completo');
    try {
      await runAllSyncs();
    } catch (err) {
      logger.error('Sync completo falhou', { error: (err as Error).message });
    } finally {
      syncCompletoRodando = false;
    }
  });

  // Sync crítico (financeiro) a cada 1 minuto — pula se ainda estiver rodando
  schedule.scheduleJob(`*/${config.sync.criticalIntervalMinutes} * * * *`, async () => {
    if (syncCriticoRodando) {
      logger.warn('Sync crítico ainda em execução — pulando ciclo para evitar concorrência.');
      return;
    }
    syncCriticoRodando = true;
    logger.info('Agendador: iniciando sync crítico (financeiro)');
    try {
      await syncTitulos();
    } catch (err) {
      logger.error('Sync crítico falhou', { error: (err as Error).message });
    } finally {
      syncCriticoRodando = false;
    }
  });

  // Heartbeat a cada 30 segundos
  schedule.scheduleJob('*/30 * * * * *', async () => {
    await sendHeartbeat();
  });

  logger.info(`Agendamentos configurados: sync completo a cada ${config.sync.intervalMinutes}min, sync crítico a cada ${config.sync.criticalIntervalMinutes}min, heartbeat a cada 30s`);
}

main().catch((err) => {
  logger.error('Erro fatal no Sync Agent', { error: err.message });
  process.exit(1);
});

