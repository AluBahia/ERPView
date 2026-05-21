import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../../store/authStore';
import { mockSupabaseClient } from '../mocks/supabase';

describe('Sprint 1: Testes de Estado Global - AuthStore', () => {
  beforeEach(() => {
    // Reset Zustand store state
    useAuthStore.setState({
      user: null,
      perfil: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  // TESTE 1: Estado inicial do authStore
  test('1. O authStore inicia com usuário nulo e não autenticado', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.perfil).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  // TESTE 2: Login bem-sucedido popula user e perfil no store
  test('2. O login bem-sucedido popula user e perfil no store', async () => {
    const mockUser = { id: 'user_123', email: 'teste@erpview.com.br' };
    const mockSession = { access_token: 'token_mock_123', user: mockUser };
    const mockPerfil = {
      id: 1,
      user_id: 'user_123',
      nome: 'Usuário Teste',
      role: 'admin',
      cargo: 'Diretor',
      modulos_permitidos: ['comercial', 'financeiro', 'producao'],
      created_at: null,
      updated_at: null,
    };

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockPerfil, error: null }),
    };
    mockSupabaseClient.from.mockImplementation(() => mockBuilder);

    const result = await useAuthStore.getState().login('teste@erpview.com.br', 'senha123');

    expect(result.success).toBe(true);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.perfil).toEqual(mockPerfil);
    expect(state.token).toBe('token_mock_123');
    expect(state.isAuthenticated).toBe(true);
  });

  // TESTE 3: Login com credenciais erradas mantém estado inicial
  test('3. O login com credenciais erradas mantém estado inicial', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Credenciais inválidas' },
    });

    const result = await useAuthStore.getState().login('errado@erpview.com.br', 'senha_errada');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Credenciais inválidas');
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.perfil).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  // TESTE 4: Logout limpa o store completamente
  test('4. O logout limpa o store completamente', async () => {
    useAuthStore.setState({
      user: { id: 'user_123', email: 'teste@erpview.com.br' } as any,
      perfil: { id: 1, nome: 'Usuário Teste' } as any,
      token: 'token_123',
      isAuthenticated: true,
      isLoading: false,
    });

    mockSupabaseClient.auth.signOut.mockResolvedValueOnce({ error: null });

    await useAuthStore.getState().logout();

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.perfil).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  // TESTE 5: onAuthStateChange atualiza store ao detectar sessão
  test('5. O listener de auth atualiza store quando sessão existe', async () => {
    let authListenerCallback: any = null;
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation((cb: any) => {
      authListenerCallback = cb;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    const mockUser = { id: 'user_listener', email: 'listener@erpview.com.br' };
    const mockSession = { access_token: 'token_listener', user: mockUser };
    const mockPerfil = {
      id: 2,
      user_id: 'user_listener',
      nome: 'Listener User',
      role: 'user',
      cargo: 'Analista',
      modulos_permitidos: ['comercial'],
      created_at: null,
      updated_at: null,
    };

    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockPerfil, error: null }),
    };
    mockSupabaseClient.from.mockImplementation(() => mockBuilder);

    await useAuthStore.getState().initialize();

    expect(authListenerCallback).not.toBeNull();

    // Trigger auth state change listener manually
    await authListenerCallback('SIGNED_IN', mockSession);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.perfil).toEqual(mockPerfil);
    expect(state.token).toBe('token_listener');
    expect(state.isAuthenticated).toBe(true);
  });
});
