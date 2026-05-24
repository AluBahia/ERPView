import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('mssql', () => ({
  default: {
    connect: vi.fn().mockResolvedValue({
      connected: true,
      request: vi.fn().mockReturnValue({
        query: vi.fn().mockResolvedValue({
          recordset: [
            { codigo: 'P001', descricao: 'Produto A', quantidade: 100, data_atualizacao: new Date('2024-01-01') },
          ],
        }),
      }),
      close: vi.fn(),
    }),
  },
}));

const mockFrom = vi.hoisted(() => vi.fn());
const mockFetchAll = vi.hoisted(() => vi.fn().mockResolvedValue([]));
vi.mock('../../src/db/supabase.js', () => ({
  supabase: { from: mockFrom },
  fetchAll: mockFetchAll,
}));

import { syncEstoque } from '../../src/sync/estoque.js';

describe('syncEstoque', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('insere itens de estoque novos no Supabase', async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    mockFetchAll.mockResolvedValueOnce([]);
    const result = await syncEstoque();
    expect(result.inseridos).toBe(1);
  });

  test('atualiza quantidade quando alterada no ERP', async () => {
    mockFrom.mockReturnValue({
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });
    mockFetchAll.mockResolvedValueOnce([{
      id: '1',
      codigo: 'P001',
      descricao: 'Produto A',
      deposito: 'Principal',
      saldo: 50,
      minimo: 0,
      status: 'OK',
      cobertura: '',
      updated_at: '2023-01-01',
    }]);
    const result = await syncEstoque();
    expect(result.atualizados).toBe(1);
  });
});
