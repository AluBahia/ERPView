import { describe, test, expect, vi, beforeEach } from 'vitest';
import Fastify from 'fastify';
import { relatoriosRoutes } from '../src/routes/relatorios.js';
import { clearCache } from '../src/utils/pdf-cache.js';

const mockGetUser = vi.hoisted(() => vi.fn());
vi.mock('../src/auth.js', () => ({
  validateAuth: async (request: any, reply: any) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Token não fornecido' });
    }
    const token = authHeader.slice(7);
    if (token === 'invalid') {
      return reply.status(401).send({ error: 'Token inválido' });
    }
    request.user = { id: 'user-1' };
    return null;
  },
}));

async function buildApp() {
  const app = Fastify({ logger: false });
  await app.register(relatoriosRoutes, { prefix: '/' });
  return app;
}

describe('relatorios', () => {
  beforeEach(() => {
    clearCache();
    vi.clearAllMocks();
  });

  test('GET /relatorios/vendas sem Authorization retorna 401', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/relatorios/vendas-periodo?dataInicio=2024-01-01' });
    expect(res.statusCode).toBe(401);
  });

  test('GET /relatorios/vendas com token expirado retorna 401', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/relatorios/vendas-periodo?dataInicio=2024-01-01',
      headers: { authorization: 'Bearer invalid' },
    });
    expect(res.statusCode).toBe(401);
  });

  test('GET /relatorios sem dataInicio retorna 400 com mensagem clara', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/relatorios/vendas-periodo',
      headers: { authorization: 'Bearer valid-token' },
    });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error).toContain('dataInicio');
  });

  test('segunda request com mesmos params retorna do cache em <50ms', async () => {
    const app = await buildApp();
    const url = '/relatorios/vendas-periodo?dataInicio=2024-01-01&dataFim=2024-01-31';

    const res1 = await app.inject({ method: 'GET', url, headers: { authorization: 'Bearer valid-token' } });
    expect(res1.statusCode).toBe(200);

    const start = Date.now();
    const res2 = await app.inject({ method: 'GET', url, headers: { authorization: 'Bearer valid-token' } });
    const duration = Date.now() - start;

    expect(res2.statusCode).toBe(200);
    expect(duration).toBeLessThan(50);
  });

  test('GET /relatorios/inexistente retorna 404', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/relatorios/inexistente?dataInicio=2024-01-01',
      headers: { authorization: 'Bearer valid-token' },
    });
    expect(res.statusCode).toBe(404);
  });
});
