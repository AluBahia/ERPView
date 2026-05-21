import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type OrdemProducaoRow = Database['public']['Tables']['ordens_producao']['Row'];

export interface FiltrosProducao {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  linha?: string;
}

export function useProducao(filtros: FiltrosProducao = {}) {
  return useQuery({
    queryKey: ['producao', filtros],
    queryFn: async () => {
      let query = supabase
        .from('ordens_producao')
        .select('*')
        .order('inicio_prev', { ascending: false });

      if (filtros.status) query = query.eq('status', filtros.status);
      if (filtros.dataInicio) query = query.gte('inicio_prev', filtros.dataInicio);
      if (filtros.dataFim) query = query.lte('inicio_prev', filtros.dataFim);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar producao: ${error.message}`);
      return data as OrdemProducaoRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
