import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { useCompras } from '../../hooks/useCompras';
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
  ilike: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  then: vi.fn().mockImplementation((onFulfilled: any) =>
    Promise.resolve({ data: returnData, error: returnError }).then(onFulfilled)
  ),
});

describe('useCompras', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('retorna lista de compras com sucesso', async () => {
    const mockData = [{ id: 1, numero: 'PC001', fornecedor: 'Forn A', valor_total: 5000 }];
    mockSupabaseClient.from.mockImplementation(() => mockBuilder(mockData));

    const { result } = renderHook(() => useCompras(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });

  test('aplica filtros de data e fornecedor', async () => {
    const builder = mockBuilder([]);
    mockSupabaseClient.from.mockImplementation(() => builder);

    const { result } = renderHook(() => useCompras({ dataInicio: '2026-01-01', dataFim: '2026-01-31', fornecedor: 'Forn A' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(builder.gte).toHaveBeenCalledWith('data_pedido', '2026-01-01');
    expect(builder.lte).toHaveBeenCalledWith('data_pedido', '2026-01-31');
  });

  test('propaga erro quando tabela nao existe', async () => {
    mockSupabaseClient.from.mockImplementation(() => mockBuilder([], { message: 'relation does not exist' }));

    const { result } = renderHook(() => useCompras(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Erro ao carregar compras');
  });
});
