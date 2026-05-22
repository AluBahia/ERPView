import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME_FINANCEIRO } from '../lib/constants';
import type { Database } from '../types';

export type CustoRow = Database['public']['Tables']['custos']['Row'];

export interface FiltrosCustos {
  periodo?: string;
  linha?: string;
  produtoId?: number;
}

export function useCustos(filtros: FiltrosCustos = {}) {
  return useQuery({
    queryKey: ['custos', filtros],
    queryFn: async () => {
      let query = supabase
        .from('custos')
        .select('*, produtos(codigo, descricao)')
        .order('periodo', { ascending: false });

      if (filtros.periodo) query = query.eq('periodo', filtros.periodo);
      if (filtros.produtoId) query = query.eq('produto_id', filtros.produtoId);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar custos: ${error.message}`);
      return data as CustoRow[];
    },
    staleTime: QUERY_STALE_TIME_FINANCEIRO,
  });
}
