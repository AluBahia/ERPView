import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('mssql', () => ({
  default: {
    connect: vi.fn().mockResolvedValue({
      connected: true,
      request: vi.fn().mockReturnValue({
        query: vi.fn().mockResolvedValue({
          recordset: [
            { id: '1', codigo: 'P001', descricao: 'Produto A', unidade: 'UN', preco_venda: 100, custo_medio: 60, ativo: 'S', data_atualizacao: new Date('2024-01-01') },
          ],
        }),
      }),
      close: vi.fn(),
    }),
  },
}));

const mockFrom = vi.hoisted(() => vi.fn());
vi.mock('../../src/db/supabase.js', () => ({
  supabase: { from: mockFrom },
}));

import { syncProdutos } from '../../src/sync/produtos.js';

describe('syncProdutos', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('insere produtos novos no Supabase', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    const result = await syncProdutos();
    expect(result.inseridos).toBe(1);
  });

  test('atualiza produtos com preço alterado', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ id: '1', codigo: 'P001', descricao: 'Produto A', unidade: 'UN', preco_venda: 90, custo_medio: 60, ativo: true, updated_at: '2023-01-01' }],
        error: null,
      }),
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });
    const result = await syncProdutos();
    expect(result.atualizados).toBe(1);
  });
});
