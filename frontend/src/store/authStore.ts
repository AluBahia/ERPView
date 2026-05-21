import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../types';

type PerfilUsuario = Database['public']['Tables']['perfis_usuario']['Row'];

interface AuthStore {
  user: User | null;
  perfil: PerfilUsuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  carregarPerfil: (userId: string) => Promise<PerfilUsuario | null>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  perfil: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  carregarPerfil: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('perfis_usuario')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        set({ perfil: null });
        return null;
      }

      set({ perfil: data });
      return data;
    } catch (err) {
      set({ perfil: null });
      return null;
    }
  },

  initialize: async () => {
    try {
      // Check for existing session on app load
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({
          user: session.user,
          token: session.access_token,
          isAuthenticated: true,
        });
        await get().carregarPerfil(session.user.id);
      }
    } catch (err) {
      console.error('Error during auth initialization:', err);
    } finally {
      set({ isLoading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        set({
          user: session.user,
          token: session.access_token,
          isAuthenticated: true,
        });
        await get().carregarPerfil(session.user.id);
      } else {
        set({
          user: null,
          perfil: null,
          token: null,
          isAuthenticated: false,
        });
      }
      set({ isLoading: false });
    });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }

      if (data.user) {
        set({
          user: data.user,
          token: data.session?.access_token || null,
          isAuthenticated: true,
        });
        await get().carregarPerfil(data.user.id);
        set({ isLoading: false });
        return { success: true };
      }

      set({ isLoading: false });
      return { success: false, error: 'Falha na autenticação' };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: 'Erro inesperado' };
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error during signOut:', err);
    } finally {
      set({
        user: null,
        perfil: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
