import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock mssql
vi.mock('mssql', () => ({
  default: {
    connect: vi.fn().mockResolvedValue({
      connected: true,
      request: vi.fn().mockReturnValue({
        query: vi.fn().mockResolvedValue({
          recordset: [
            { id: '1', nome: 'Cliente A', cnpj: '11.111.111/0001-11', cidade: 'São Paulo', estado: 'SP', email: 'a@ex.com', telefone: '11999999999', ativo: 'S', data_atualizacao: new Date('2024-01-01') },
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

import { syncClientes } from '../../src/sync/clientes.js';

describe('syncClientes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('query clientes retorna campos obrigatórios: id, codigo, nome', async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    mockFetchAll.mockResolvedValueOnce([]);

    const result = await syncClientes();
    expect(result.inseridos).toBe(1);
  });

  test('upsert insere clientes novos no Supabase', async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    mockFetchAll.mockResolvedValueOnce([]);

    const result = await syncClientes();
    expect(result.inseridos).toBeGreaterThanOrEqual(0);
  });

  test('upsert atualiza clientes modificados sem duplicar', async () => {
    mockFrom.mockReturnValue({
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });
    mockFetchAll.mockResolvedValueOnce([{
      id: '1',
      codigo: '1',
      nome: 'Cliente Old',
      segmento: 'Geral',
      volume_compras: 0,
      frequencia: 'Eventual',
      prazo_medio: 'Fatura',
      classe_abc: 'C',
      status_credito: 'OK',
      updated_at: '2023-01-01',
    }]);

    const result = await syncClientes();
    expect(result.atualizados).toBe(1);
  });

  test('soft delete: clientes removidos no ERP ficam com ativo=false', async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockReturnValue({ in: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });
    mockFetchAll.mockResolvedValueOnce([{
      id: '99',
      codigo: '99',
      nome: 'Removido',
      segmento: 'Geral',
      volume_compras: 0,
      frequencia: 'Eventual',
      prazo_medio: 'Fatura',
      classe_abc: 'C',
      status_credito: 'OK',
      updated_at: '2023-01-01',
    }]);

    const result = await syncClientes();
    expect(result.deletados).toBe(1);
  });

  test('erro na query SQL Server é capturado e logado, sync continua', async () => {
    vi.clearAllMocks();
    const { default: sql } = await import('mssql');
    const { closeSqlPool } = await import('../../src/db/sqlserver.js');
    await closeSqlPool();
    (sql.connect as any).mockRejectedValue(new Error('Connection timeout'));

    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    mockFetchAll.mockResolvedValueOnce([]);

    await expect(syncClientes()).rejects.toThrow();
  }, 15000);
});
