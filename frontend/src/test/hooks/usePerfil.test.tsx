import { renderHook, waitFor } from '@testing-library/react';
import { usePerfil } from '../../hooks/usePerfil';
import { useAuthStore } from '../../store/authStore';
import { mockSupabaseClient } from '../mocks/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('usePerfil Hook', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
    vi.clearAllMocks();
  });

  // TESTE 6: Retorna perfil quando usuário autenticado
  test('usePerfil retorna dados do perfil para usuário logado', async () => {
    const mockUser = { id: 'user_123', email: 'teste@erpview.com.br' };
    useAuthStore.setState({ user: mockUser as any });

    const mockPerfil = {
      id: 1,
      user_id: 'user_123',
      nome: 'Usuário Teste',
      role: 'admin',
    };

    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockPerfil, error: null }),
    };
    mockSupabaseClient.from.mockImplementation(() => mockBuilder);

    const { result } = renderHook(() => usePerfil(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.carregando).toBe(false));

    expect(result.current.perfil).toEqual(mockPerfil);
    expect(result.current.erro).toBeNull();
  });

  // TESTE 7: Retorna null quando não autenticado
  test('usePerfil retorna null quando sem sessão ativa', async () => {
    const { result } = renderHook(() => usePerfil(), { wrapper: createWrapper() });

    expect(result.current.perfil).toBeNull();
    expect(result.current.carregando).toBe(false);
    expect(result.current.erro).toBeNull();
  });

  // TESTE 8: Caching funciona (não refaz query na mesma sessão)
  test('usePerfil não faz segunda chamada ao Supabase se já carregou', async () => {
    const mockUser = { id: 'user_123', email: 'teste@erpview.com.br' };
    useAuthStore.setState({ user: mockUser as any });

    const mockPerfil = {
      id: 1,
      user_id: 'user_123',
      nome: 'Usuário Teste',
      role: 'admin',
    };

    const selectMock = vi.fn().mockReturnThis();
    const eqMock = vi.fn().mockReturnThis();
    const singleMock = vi.fn().mockResolvedValue({ data: mockPerfil, error: null });

    const mockBuilder = {
      select: selectMock,
      eq: eqMock,
      single: singleMock,
    };
    mockSupabaseClient.from.mockImplementation(() => mockBuilder);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result, rerender } = renderHook(() => usePerfil(), { wrapper });

    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.perfil).toEqual(mockPerfil);

    rerender();

    expect(result.current.perfil).toEqual(mockPerfil);
    expect(singleMock).toHaveBeenCalledTimes(1);
  });
});
