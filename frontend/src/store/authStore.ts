import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    // Check for existing session on app load
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({
        user: {
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          role: session.user.user_metadata?.role || 'user',
          initials: (session.user.user_metadata?.name || session.user.email || '').substring(0, 2).toUpperCase(),
        },
        token: session.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({
          user: {
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'user',
            initials: (session.user.user_metadata?.name || session.user.email || '').substring(0, 2).toUpperCase(),
          },
          token: session.access_token,
          isAuthenticated: true,
        });
      } else {
        set({ user: null, token: null, isAuthenticated: false });
      }
    });
  },

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: 'Falha na autenticação' };
    } catch (err) {
      return { success: false, error: 'Erro inesperado' };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
