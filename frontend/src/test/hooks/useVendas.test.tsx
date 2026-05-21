import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { useVendas } from '../../hooks/useVendas';
import { mockSupabaseClient } from '../mocks/supabase';

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockBuilder = (returnData: any[], returnError: any = null) => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  then: vi.fn().mockImplementation((onFulfilled: any) =>
    Promise.resolve({ data: returnData, error: returnError }).then(onFulfilled)
  ),
});

describe('useVendas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('retorna lista de vendas com sucesso', async () => {
    const mockData = [
      { id: 1, numero: 'PV001', cliente_id: 1, valor_total: 1500.5, status: 'Aberto', data_pedido: '2026-05-01' },
    ];
    mockSupabaseClient.from.mockImplementation(() => mockBuilder(mockData));

    const { result } = renderHook(() => useVendas(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].numero).toBe('PV001');
  });

  test('aplica filtros de data e status corretamente', async () => {
    const mockData = [{ id: 2, numero: 'PV002', status: 'Faturado', data_pedido: '2026-05-10' }];
    const builder = mockBuilder(mockData);
    mockSupabaseClient.from.mockImplementation(() => builder);

    const { result } = renderHook(
      () => useVendas({ dataInicio: '2026-05-01', dataFim: '2026-05-31', status: 'Faturado' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(builder.gte).toHaveBeenCalledWith('data_pedido', '2026-05-01');
    expect(builder.lte).toHaveBeenCalledWith('data_pedido', '2026-05-31');
    expect(builder.eq).toHaveBeenCalledWith('status', 'Faturado');
  });

  test('propaga erro quando Supabase retorna error', async () => {
    mockSupabaseClient.from.mockImplementation(() => mockBuilder([], { message: 'Erro de conexao' }));

    const { result } = renderHook(() => useVendas(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Erro ao carregar vendas');
  });
});
