import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { useKPIs } from '../../hooks/useKPIs';
import { mockSupabaseClient } from '../mocks/supabase';

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockBuilder = (returnData: any[], returnError: any = null) => ({
  select: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  then: vi.fn().mockImplementation((onFulfilled: any) =>
    Promise.resolve({ data: returnData, error: returnError }).then(onFulfilled)
  ),
});

describe('useKPIs', () => {
  beforeEach(() => vi.clearAllMocks());

  test('retorna KPIs do dashboard com sucesso', async () => {
    const mockData = [
      {
        id: 1,
        vendas_dia: 5000,
        vendas_mes: 150000,
        contas_receber_vencidas: 20000,
        contas_pagar_vencer: 35000,
        ncr_abertas: 3,
        os_manutencao_pendentes: 5,
      },
    ];
    mockSupabaseClient.from.mockImplementation(() => mockBuilder(mockData));

    const { result } = renderHook(() => useKPIs('dashboard'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.length).toBeGreaterThan(0);
    expect(result.current.data?.[0].label).toBe('Vendas do Dia');
  });

  test('retorna KPIs de vendas a partir dos dados brutos', async () => {
    const mockData = [
      { id: 1, numero: 'PV001', valor_total: 5000, status: 'Aberto' },
      { id: 2, numero: 'PV002', valor_total: 8000, status: 'Faturado' },
    ];
    mockSupabaseClient.from.mockImplementation(() => mockBuilder(mockData));

    const { result } = renderHook(() => useKPIs('vendas'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.length).toBeGreaterThan(0);
    expect(result.current.data?.some((k) => k.label === 'Total de Pedidos')).toBe(true);
  });

  test('propaga erro quando tabela nao existe (compras)', async () => {
    mockSupabaseClient.from.mockImplementation(() => mockBuilder([], { message: 'relation does not exist' }));

    const { result } = renderHook(() => useKPIs('compras'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('pedidos_compra');
  });
});
