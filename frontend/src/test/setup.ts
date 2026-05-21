import './mocks/supabase';
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// Inicia a interceptação de requisições do MSW antes de todos os testes
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reseta os handlers após cada teste (útil para testes que modificam handlers dinamicamente)
afterEach(() => server.resetHandlers());

// Fecha o servidor de mock após os testes terminarem
afterAll(() => server.close());
