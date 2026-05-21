import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Database } from '../types';

type PerfilUsuario = Database['public']['Tables']['perfis_usuario']['Row'];

export function usePerfil() {
  const user = useAuthStore((s) => s.user);

  const query = useQuery<PerfilUsuario | null>({
    queryKey: ['perfil', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('perfis_usuario')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!user,
    staleTime: Infinity,
  });

  return {
    perfil: query.data ?? null,
    carregando: query.isLoading,
    erro: query.error ? (query.error as Error).message : null,
  };
}
