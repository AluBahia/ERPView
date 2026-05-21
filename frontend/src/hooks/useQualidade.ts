import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type NCRRow = Database['public']['Tables']['ncr']['Row'];

export interface FiltrosQualidade {
  dataInicio?: string;
  dataFim?: string;
  tipo?: string;
  status?: string;
}

export function useQualidade(filtros: FiltrosQualidade = {}) {
  return useQuery({
    queryKey: ['qualidade', filtros],
    queryFn: async () => {
      let query = supabase
        .from('ncr')
        .select('*')
        .order('prazo', { ascending: true });

      if (filtros.status) query = query.eq('status', filtros.status);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar qualidade: ${error.message}`);
      return data as NCRRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
