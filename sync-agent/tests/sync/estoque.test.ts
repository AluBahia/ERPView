import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('mssql', () => ({
  default: {
    connect: vi.fn().mockResolvedValue({
      connected: true,
      request: vi.fn().mockReturnValue({
        query: vi.fn().mockResolvedValue({
          recordset: [
            { produto_id: '1', quantidade: 100, qtd_minima: 10, qtd_maxima: 500, deposito: 'CD1', data_alteracao: new Date('2024-01-01') },
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

import { syncEstoque } from '../../src/sync/estoque.js';

describe('syncEstoque', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('insere itens de estoque novos no Supabase', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    const result = await syncEstoque();
    expect(result.inseridos).toBe(1);
  });

  test('atualiza quantidade quando alterada no ERP', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ produto_id: '1', quantidade: 50, qtd_minima: 10, qtd_maxima: 500, deposito: 'CD1', updated_at: '2023-01-01' }],
        error: null,
      }),
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });
    const result = await syncEstoque();
    expect(result.atualizados).toBe(1);
  });
});
