import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type DRERow = Database['public']['Tables']['dre']['Row'];

export interface FiltrosDRE {
  periodo?: string;
  ano?: string;
}

export function useDRE(filtros: FiltrosDRE = {}) {
  return useQuery({
    queryKey: ['dre', filtros],
    queryFn: async () => {
      let query = supabase
        .from('dre')
        .select('*')
        .order('periodo', { ascending: false });

      if (filtros.periodo) query = query.eq('periodo', filtros.periodo);
      if (filtros.ano) query = query.ilike('periodo', `${filtros.ano}-%`);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar DRE: ${error.message}`);
      return data as DRERow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
