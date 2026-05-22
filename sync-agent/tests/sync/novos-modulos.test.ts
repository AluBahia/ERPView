/**
 * Testes para os módulos de sync adicionados na expansão da Sprint 5:
 * producao, expedicao, manutencao, rh, patrimonio
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/db/sqlserver.js', () => ({
  query: vi.fn(),
}));
vi.mock('../../src/db/supabase.js', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null }),
        in: vi.fn().mockResolvedValue({ error: null }),
      })),
    })),
  },
}));
vi.mock('../../src/logger.js', () => ({
  logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { query } from '../../src/db/sqlserver.js';
import { syncProducao } from '../../src/sync/producao.js';
import { syncExpedicao } from '../../src/sync/expedicao.js';
import { syncManutencao } from '../../src/sync/manutencao.js';
import { syncRH } from '../../src/sync/rh.js';
import { syncPatrimonio } from '../../src/sync/patrimonio.js';

beforeEach(() => vi.clearAllMocks());

describe('syncProducao', () => {
  it('retorna contadores quando não há dados', async () => {
    vi.mocked(query).mockResolvedValue([]);
    const result = await syncProducao();
    expect(result).toEqual({ inseridos: 0, atualizados: 0, deletados: 0 });
  });

  it('processa ordens de produção com campos obrigatórios', async () => {
    vi.mocked(query).mockResolvedValue([{
      id: '1', numero: 'OP-001', produto_id: '10',
      quantidade: 100, status: 'Em Andamento',
      data_inicio: new Date(), data_atualizacao: new Date(),
    }]);
    const result = await syncProducao();
    expect(result).toHaveProperty('inseridos');
  });
});

describe('syncExpedicao', () => {
  it('retorna contadores quando não há dados', async () => {
    vi.mocked(query).mockResolvedValue([]);
    const result = await syncExpedicao();
    expect(result).toEqual({ inseridos: 0, atualizados: 0, deletados: 0 });
  });

  it('processa pedidos de expedição com campos obrigatórios', async () => {
    vi.mocked(query).mockResolvedValue([{
      id: '1', numero: 'EXP-001', cliente_id: '5',
      status: 'Aguardando', data_pedido: new Date(), data_atualizacao: new Date(),
    }]);
    const result = await syncExpedicao();
    expect(result).toHaveProperty('inseridos');
  });
});

describe('syncManutencao', () => {
  it('retorna contadores quando não há dados', async () => {
    vi.mocked(query).mockResolvedValue([]);
    const result = await syncManutencao();
    expect(result).toEqual({ inseridos: 0, atualizados: 0, deletados: 0 });
  });

  it('processa ordens de serviço com campos obrigatórios', async () => {
    vi.mocked(query).mockResolvedValue([{
      id: '1', numero: 'OS-001', tipo: 'Preventiva',
      status: 'Aberta', data_abertura: new Date(), data_atualizacao: new Date(),
    }]);
    const result = await syncManutencao();
    expect(result).toHaveProperty('inseridos');
  });
});

describe('syncRH', () => {
  it('retorna contadores quando não há dados', async () => {
    vi.mocked(query).mockResolvedValue([]);
    const result = await syncRH();
    expect(result).toEqual({ inseridos: 0, atualizados: 0, deletados: 0 });
  });

  it('processa colaboradores com campos obrigatórios', async () => {
    vi.mocked(query).mockResolvedValue([{
      id: '1', matricula: 'C001', nome: 'João Silva',
      cargo: 'Analista', data_admissao: new Date('2020-01-01'),
      status: 'Ativo', data_atualizacao: new Date(),
    }]);
    const result = await syncRH();
    expect(result).toHaveProperty('inseridos');
  });
});

describe('syncPatrimonio', () => {
  it('retorna contadores quando não há dados', async () => {
    vi.mocked(query).mockResolvedValue([]);
    const result = await syncPatrimonio();
    expect(result).toEqual({ inseridos: 0, atualizados: 0, deletados: 0 });
  });

  it('processa bens patrimoniais com campos obrigatórios', async () => {
    vi.mocked(query).mockResolvedValue([{
      id: '1', codigo: 'BP-001', descricao: 'Servidor Dell',
      categoria: 'TI', valor_aquisicao: 15000,
      data_aquisicao: new Date('2022-06-01'),
      status: 'Ativo', data_atualizacao: new Date(),
    }]);
    const result = await syncPatrimonio();
    expect(result).toHaveProperty('inseridos');
  });
});
