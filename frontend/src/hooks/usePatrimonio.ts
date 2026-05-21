import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type BemPatrimonialRow = Database['public']['Tables']['bens_patrimoniais']['Row'];

export interface FiltrosPatrimonio {
  categoria?: string;
  localizacao?: string;
  status?: string;
}

export function usePatrimonio(filtros: FiltrosPatrimonio = {}) {
  return useQuery({
    queryKey: ['patrimonio', filtros],
    queryFn: async () => {
      let query = supabase
        .from('bens_patrimoniais')
        .select('*')
        .order('descricao', { ascending: true });

      if (filtros.categoria) query = query.eq('categoria', filtros.categoria);
      if (filtros.localizacao) query = query.eq('localizacao', filtros.localizacao);
      if (filtros.status) query = query.eq('status', filtros.status);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar patrimonio: ${error.message}`);
      return data as BemPatrimonialRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
