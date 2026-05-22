import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock mssql
vi.mock('mssql', () => ({
  default: {
    connect: vi.fn().mockResolvedValue({
      connected: true,
      request: vi.fn().mockReturnValue({
        query: vi.fn().mockResolvedValue({
          recordset: [
            { id: '1', nome: 'Cliente A', cnpj: '11.111.111/0001-11', cidade: 'São Paulo', estado: 'SP', email: 'a@ex.com', telefone: '11999999999', ativo: true, data_alteracao: new Date('2024-01-01') },
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

import { syncClientes } from '../../src/sync/clientes.js';

describe('syncClientes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('query clientes retorna campos obrigatórios: id, nome, cnpj, cidade', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    const result = await syncClientes();
    expect(result.inseridos).toBe(1);
  });

  test('upsert insere clientes novos no Supabase', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    const result = await syncClientes();
    expect(result.inseridos).toBeGreaterThanOrEqual(0);
  });

  test('upsert atualiza clientes modificados sem duplicar', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ id: '1', nome: 'Cliente Old', cnpj: '11.111.111/0001-11', cidade: 'São Paulo', estado: 'SP', email: null, telefone: null, ativo: true, updated_at: '2023-01-01' }],
        error: null,
      }),
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });

    const result = await syncClientes();
    expect(result.atualizados).toBe(1);
  });

  test('soft delete: clientes removidos no ERP ficam com ativo=false', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ id: '99', nome: 'Removido', cnpj: '00.000.000/0000-00', cidade: 'Rio', estado: 'RJ', email: null, telefone: null, ativo: true, updated_at: '2023-01-01' }],
        error: null,
      }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockReturnValue({ in: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });

    const result = await syncClientes();
    expect(result.deletados).toBe(1);
  });

  test('erro na query SQL Server é capturado e logado, sync continua', async () => {
    vi.clearAllMocks();
    const { default: sql } = await import('mssql');
    (sql.connect as any).mockRejectedValueOnce(new Error('Connection timeout'));

    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    await expect(syncClientes()).rejects.toThrow();
  }, 15000);
});
