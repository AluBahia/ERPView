import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './config.js';
import { logger } from './utils/logger.js';
import { relatoriosRoutes } from './routes/relatorios.js';
import { cleanupOldFiles } from './utils/cleanup.js';

const fastify = Fastify({ logger: false });

async function main() {
  await fastify.register(cors, { origin: true });
  await fastify.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  await fastify.register(relatoriosRoutes, { prefix: '/' });

  // Cleanup job a cada hora
  setInterval(() => {
    cleanupOldFiles(config.cr.tempPath, 60);
  }, 60 * 60 * 1000);

  fastify.listen({ port: config.port, host: '0.0.0.0' }, (err) => {
    if (err) {
      logger.error('Erro ao iniciar servidor', { error: err.message });
      process.exit(1);
    }
    logger.info(`CR Service rodando na porta ${config.port}`);
  });
}

main();
