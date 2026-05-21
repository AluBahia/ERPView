import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { useReceber } from '../../hooks/useReceber';
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

describe('useReceber', () => {
  beforeEach(() => vi.clearAllMocks());

  test('retorna titulos a receber com sucesso', async () => {
    const mockData = [{ id: 1, numero: 'TR001', valor: 1500, status: 'A vencer' }];
    mockSupabaseClient.from.mockImplementation(() => mockBuilder(mockData));

    const { result } = renderHook(() => useReceber(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].numero).toBe('TR001');
  });

  test('aplica filtros de vencimento e status', async () => {
    const builder = mockBuilder([]);
    mockSupabaseClient.from.mockImplementation(() => builder);

    renderHook(() => useReceber({ vencimentoInicio: '2026-01-01', vencimentoFim: '2026-12-31', status: 'Vencido' }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(builder.then).toHaveBeenCalled());
    expect(builder.gte).toHaveBeenCalledWith('vencimento', '2026-01-01');
    expect(builder.lte).toHaveBeenCalledWith('vencimento', '2026-12-31');
    expect(builder.eq).toHaveBeenCalledWith('status', 'Vencido');
  });

  test('propaga erro quando Supabase falha', async () => {
    mockSupabaseClient.from.mockImplementation(() => mockBuilder([], { message: 'erro' }));

    const { result } = renderHook(() => useReceber(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Erro ao carregar titulos a receber');
  });
});
