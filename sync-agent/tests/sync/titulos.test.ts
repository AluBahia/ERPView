import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('mssql', () => ({
  default: {
    connect: vi.fn().mockResolvedValue({
      connected: true,
      request: vi.fn().mockReturnValue({
        query: vi.fn().mockResolvedValue({
          recordset: [
            { id: '1', tipo: 'receber', numero_documento: 'NF001', entidade_id: 'c1', valor: 1000, valor_pago: 0, vencimento: '2024-02-01', data_emissao: '2024-01-01', status: 'Aberto', data_alteracao: new Date('2024-01-01') },
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

import { syncTitulos } from '../../src/sync/titulos.js';

describe('syncTitulos', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('insere titulos novos no Supabase', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    const result = await syncTitulos();
    expect(result.inseridos).toBe(1);
  });

  test('atualiza titulos com valor pago alterado', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ id: '1', tipo: 'receber', numero_documento: 'NF001', entidade_id: 'c1', valor: 1000, valor_pago: 0, vencimento: '2024-02-01', data_emissao: '2024-01-01', status: 'Aberto', updated_at: '2023-01-01' }],
        error: null,
      }),
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });
    const result = await syncTitulos();
    expect(result.atualizados).toBe(1);
  });
});
