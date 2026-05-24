import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('mssql', () => ({
  default: {
    connect: vi.fn().mockResolvedValue({
      connected: true,
      request: vi.fn().mockReturnValue({
        query: vi.fn().mockResolvedValue({
          recordset: [
            { id: '1', numero: 'PED001', cliente_id: 'c1', vendedor_id: 'v1', valor_total: 5000, status: 'Faturado', data_emissao: '2024-01-15', data_atualizacao: new Date('2024-01-01') },
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

import { syncPedidosVenda } from '../../src/sync/pedidos-venda.js';

describe('syncPedidosVenda', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('insere pedidos novos no Supabase', async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    mockFetchAll.mockResolvedValueOnce([]);
    const result = await syncPedidosVenda();
    expect(result.inseridos).toBe(1);
  });

  test('atualiza pedidos com status alterado', async () => {
    mockFrom.mockReturnValue({
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });
    mockFetchAll.mockResolvedValueOnce([{
      id: '1',
      numero: 'PED001',
      cliente_id: 1,
      vendedor: 'v1',
      valor_total: 5000,
      status: 'Pendente',
      data_pedido: '2024-01-15',
      updated_at: '2023-01-01',
    }]);
    const result = await syncPedidosVenda();
    expect(result.atualizados).toBe(1);
  });
});
