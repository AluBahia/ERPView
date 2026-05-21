import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { useProducao } from '../../hooks/useProducao';
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

describe('useProducao', () => {
  beforeEach(() => vi.clearAllMocks());

  test('retorna ordens de producao com sucesso', async () => {
    const mockData = [{ id: 1, produto: 'Produto A', quantidade: 100, status: 'Em producao' }];
    mockSupabaseClient.from.mockImplementation(() => mockBuilder(mockData));

    const { result } = renderHook(() => useProducao(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].produto).toBe('Produto A');
  });

  test('aplica filtro de status', async () => {
    const builder = mockBuilder([]);
    mockSupabaseClient.from.mockImplementation(() => builder);

    renderHook(() => useProducao({ status: 'Atrasada' }), { wrapper: createWrapper() });
    await waitFor(() => expect(builder.then).toHaveBeenCalled());
    expect(builder.eq).toHaveBeenCalledWith('status', 'Atrasada');
  });

  test('propaga erro quando Supabase falha', async () => {
    mockSupabaseClient.from.mockImplementation(() => mockBuilder([], { message: 'falha' }));

    const { result } = renderHook(() => useProducao(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Erro ao carregar producao');
  });
});
