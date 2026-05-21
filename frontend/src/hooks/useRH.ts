import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type RHColaboradorRow = Database['public']['Tables']['rh_colaboradores']['Row'];

export interface FiltrosRH {
  departamento?: string;
  cargo?: string;
  ativo?: boolean;
}

export function useRH(filtros: FiltrosRH = {}) {
  return useQuery({
    queryKey: ['rh', filtros],
    queryFn: async () => {
      let query = supabase
        .from('rh_colaboradores')
        .select('*')
        .order('nome', { ascending: true });

      if (filtros.departamento) query = query.eq('departamento', filtros.departamento);
      if (filtros.cargo) query = query.eq('cargo', filtros.cargo);
      if (filtros.ativo !== undefined) {
        const statusEsperado = filtros.ativo ? 'Ativo' : 'Desligado';
        query = query.eq('status', statusEsperado);
      }

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar colaboradores: ${error.message}`);
      return data as RHColaboradorRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
