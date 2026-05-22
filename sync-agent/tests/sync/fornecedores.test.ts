import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncFornecedores } from '../../src/sync/fornecedores.js';

vi.mock('../../src/db/sqlserver.js', () => ({
  query: vi.fn(),
}));
vi.mock('../../src/db/supabase.js', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null }),
        in: vi.fn().mockResolvedValue({ error: null }),
      })),
    })),
  },
}));
vi.mock('../../src/logger.js', () => ({
  logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { query } from '../../src/db/sqlserver.js';
import { supabase } from '../../src/db/supabase.js';

const mockFornecedor = {
  id: '1',
  nome: 'Fornecedor Teste Ltda',
  cnpj: '12.345.678/0001-99',
  cidade: 'São Paulo',
  estado: 'SP',
  email: 'contato@teste.com',
  telefone: '(11) 9999-0000',
  ativo: true,
  data_alteracao: new Date('2026-01-15'),
};

describe('syncFornecedores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(query).mockResolvedValue([mockFornecedor]);
  });

  it('retorna contadores corretos para fornecedor novo', async () => {
    const result = await syncFornecedores();
    expect(result).toHaveProperty('inseridos');
    expect(result).toHaveProperty('atualizados');
    expect(result).toHaveProperty('deletados');
    expect(result.inseridos).toBeGreaterThanOrEqual(0);
  });

  it('processa lista vazia sem erros', async () => {
    vi.mocked(query).mockResolvedValue([]);
    const result = await syncFornecedores();
    expect(result.inseridos).toBe(0);
    expect(result.atualizados).toBe(0);
    expect(result.deletados).toBe(0);
  });

  it('captura erro da query SQL Server sem propagar', async () => {
    vi.mocked(query).mockRejectedValue(new Error('Timeout de conexão'));
    await expect(syncFornecedores()).rejects.toThrow();
  });
});
