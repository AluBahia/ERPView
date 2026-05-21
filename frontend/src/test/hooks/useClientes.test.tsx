import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { useClientes } from '../../hooks/useClientes';
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

describe('useClientes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('retorna lista de clientes com sucesso', async () => {
    const mockData = [
      { id: 1, nome: 'Cliente A', codigo: 'C001', classe_abc: 'A', segmento: 'Industria' },
    ];
    mockSupabaseClient.from.mockImplementation(() => mockBuilder(mockData));

    const { result } = renderHook(() => useClientes(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].nome).toBe('Cliente A');
  });

  test('aplica filtro de classe ABC', async () => {
    const mockData = [{ id: 2, nome: 'Cliente B', classe_abc: 'A' }];
    const builder = mockBuilder(mockData);
    mockSupabaseClient.from.mockImplementation(() => builder);

    const { result } = renderHook(() => useClientes({ classeAbc: 'A' }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(builder.eq).toHaveBeenCalledWith('classe_abc', 'A');
  });

  test('propaga erro quando Supabase falha', async () => {
    mockSupabaseClient.from.mockImplementation(() => mockBuilder([], { message: 'timeout' }));

    const { result } = renderHook(() => useClientes(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Erro ao carregar clientes');
  });
});
