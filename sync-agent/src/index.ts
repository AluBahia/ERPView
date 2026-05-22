import 'dotenv/config';
import schedule from 'node-schedule';
import { runAllSyncs, sendHeartbeat } from './sync/orchestrator.js';
import { sqlHealthCheck } from './db/sqlserver.js';
import { logger } from './logger.js';
import { config } from './config.js';

async function main() {
  logger.info('Sync Agent iniciado');

  const healthy = await sqlHealthCheck();
  if (!healthy) {
    logger.error('SQL Server não está acessível. Encerrando.');
    process.exit(1);
  }

  // Sync completo a cada N minutos
  schedule.scheduleJob(`*/${config.sync.intervalMinutes} * * * *`, async () => {
    logger.info('Agendador: iniciando sync completo');
    await runAllSyncs();
  });

  // Sync crítico (financeiro) a cada 1 minuto
  schedule.scheduleJob(`*/${config.sync.criticalIntervalMinutes} * * * *`, async () => {
    logger.info('Agendador: iniciando sync crítico (financeiro)');
    const { syncTitulos } = await import('./sync/titulos.js');
    try {
      await syncTitulos();
    } catch (err) {
      logger.error('Sync crítico falhou', { error: (err as Error).message });
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
