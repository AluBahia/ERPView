import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { useFluxoCaixa } from '../../hooks/useFluxoCaixa';
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
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  then: vi.fn().mockImplementation((onFulfilled: any) =>
    Promise.resolve({ data: returnData, error: returnError }).then(onFulfilled)
  ),
});

describe('useFluxoCaixa', () => {
  beforeEach(() => vi.clearAllMocks());

  test('retorna movimentacoes com sucesso', async () => {
    const mockData = [{ id: 1, data: '2026-05-01', tipo: 'Entrada', categoria: 'Vendas', valor: 10000 }];
    mockSupabaseClient.from.mockImplementation(() => mockBuilder(mockData));

    const { result } = renderHook(() => useFluxoCaixa(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].categoria).toBe('Vendas');
  });

  test('aplica filtro de tipo', async () => {
    const builder = mockBuilder([]);
    mockSupabaseClient.from.mockImplementation(() => builder);

    renderHook(() => useFluxoCaixa({ tipo: 'Saída' }), { wrapper: createWrapper() });
    await waitFor(() => expect(builder.then).toHaveBeenCalled());
    expect(builder.eq).toHaveBeenCalledWith('tipo', 'Saída');
  });

  test('propaga erro quando Supabase falha', async () => {
    mockSupabaseClient.from.mockImplementation(() => mockBuilder([], { message: 'erro' }));

    const { result } = renderHook(() => useFluxoCaixa(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Erro ao carregar fluxo de caixa');
  });
});
