import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('mssql', () => ({
  default: {
    connect: vi.fn().mockResolvedValue({
      connected: true,
      request: vi.fn().mockReturnValue({
        query: vi.fn().mockResolvedValue({
          recordset: [
            { id: '1', tipo: 'R', numero_documento: 'NF001', entidade_id: '1', valor: 1000, vencimento: '2024-02-01', data_emissao: '2024-01-01', status: 'A vencer', data_atualizacao: new Date('2024-01-01') },
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

import { syncTitulos } from '../../src/sync/titulos.js';

describe('syncTitulos', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('insere titulos novos no Supabase', async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    mockFetchAll.mockResolvedValueOnce([]);
    mockFetchAll.mockResolvedValueOnce([]);
    const result = await syncTitulos();
    expect(result.inseridos).toBe(1);
  });

  test('atualiza titulos com valor pago alterado', async () => {
    mockFrom.mockReturnValue({
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });
    mockFetchAll.mockResolvedValueOnce([{
      id: '1',
      cliente_id: 1,
      numero: 'NF001',
      emissao: '2024-01-01',
      vencimento: '2024-02-01',
      valor: 1000,
      status: 'A vencer',
      dias_atraso: 0,
      updated_at: '2023-01-01',
    }]);
    mockFetchAll.mockResolvedValueOnce([]);
    const result = await syncTitulos();
    expect(result.atualizados).toBe(1);
  });
});
