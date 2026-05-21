import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { useProdutos } from '../../hooks/useProdutos';
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
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  then: vi.fn().mockImplementation((onFulfilled: any) =>
    Promise.resolve({ data: returnData, error: returnError }).then(onFulfilled)
  ),
});

describe('useProdutos', () => {
  beforeEach(() => vi.clearAllMocks());

  test('retorna lista de produtos com sucesso', async () => {
    const mockData = [{ id: 1, codigo: 'P001', descricao: 'Produto A', giro: 'Alto' }];
    mockSupabaseClient.from.mockImplementation(() => mockBuilder(mockData));

    const { result } = renderHook(() => useProdutos(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].descricao).toBe('Produto A');
  });

  test('propaga erro quando Supabase falha', async () => {
    mockSupabaseClient.from.mockImplementation(() => mockBuilder([], { message: 'erro' }));

    const { result } = renderHook(() => useProdutos(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Erro ao carregar produtos');
  });
});
