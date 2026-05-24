import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('mssql', () => ({
  default: {
    connect: vi.fn().mockResolvedValue({
      connected: true,
      request: vi.fn().mockReturnValue({
        query: vi.fn().mockResolvedValue({
          recordset: [
            { id: '1', numero: '0001', contraparte: 'Cliente A', valor: 5000, data_emissao: '2024-01-15', status: 'OK', tipo: 'Saída', data_atualizacao: new Date('2024-01-01') },
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

import { syncNotasFiscais } from '../../src/sync/notas-fiscais.js';

describe('syncNotasFiscais', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('insere notas fiscais novas no Supabase', async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    mockFetchAll.mockResolvedValueOnce([]);
    const result = await syncNotasFiscais();
    expect(result.inseridos).toBe(1);
  });

  test('atualiza notas fiscais com status alterado', async () => {
    mockFrom.mockReturnValue({
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });
    mockFetchAll.mockResolvedValueOnce([{
      id: '1',
      numero: '0001',
      contraparte: 'Cliente A',
      valor: 5000,
      data_emissao: '2024-01-15',
      status: 'Pendente',
      tipo: 'Saída',
      updated_at: '2023-01-01',
    }]);
    const result = await syncNotasFiscais();
    expect(result.atualizados).toBe(1);
  });
});
