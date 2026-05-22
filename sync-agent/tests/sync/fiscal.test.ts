import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('mssql', () => ({
  default: {
    connect: vi.fn().mockResolvedValue({
      connected: true,
      request: vi.fn().mockReturnValue({
        query: vi.fn().mockResolvedValue({
          recordset: [
            { id: '1', numero: '0001', serie: '1', entidade_id: 'c1', valor_total: 5000, data_emissao: '2024-01-15', status: 'Autorizada', tipo: 'saida', data_atualizacao: new Date('2024-01-01') },
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

import { syncNotasFiscais } from '../../src/sync/notas-fiscais.js';

describe('syncNotasFiscais', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('insere notas fiscais novas no Supabase', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    const result = await syncNotasFiscais();
    expect(result.inseridos).toBe(1);
  });

  test('atualiza notas fiscais com status alterado', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ id: '1', numero: '0001', serie: '1', entidade_id: 'c1', valor_total: 5000, data_emissao: '2024-01-15', status: 'Pendente', tipo: 'saida', updated_at: '2023-01-01' }],
        error: null,
      }),
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    });
    const result = await syncNotasFiscais();
    expect(result.atualizados).toBe(1);
  });
});
