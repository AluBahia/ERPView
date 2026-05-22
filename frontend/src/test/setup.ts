import './mocks/supabase';
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './mocks/server';

// Mock localStorage para testes com Zustand persist
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(() => {}),
  removeItem: vi.fn(() => {}),
  clear: vi.fn(() => {}),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Inicia a interceptação de requisições do MSW antes de todos os testes
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reseta os handlers após cada teste (útil para testes que modificam handlers dinamicamente)
afterEach(() => server.resetHandlers());

// Fecha o servidor de mock após os testes terminarem
afterAll(() => server.close());
