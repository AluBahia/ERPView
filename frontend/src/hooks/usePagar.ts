import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type TituloPagarRow = Database['public']['Tables']['titulos_pagar']['Row'];

export interface FiltrosPagar {
  vencimentoInicio?: string;
  vencimentoFim?: string;
  status?: string;
  fornecedor?: string;
}

export function usePagar(filtros: FiltrosPagar = {}) {
  return useQuery({
    queryKey: ['pagar', filtros],
    queryFn: async () => {
      let query = supabase
        .from('titulos_pagar')
        .select('*')
        .order('vencimento', { ascending: true });

      if (filtros.status) query = query.eq('status', filtros.status);
      if (filtros.vencimentoInicio) query = query.gte('vencimento', filtros.vencimentoInicio);
      if (filtros.vencimentoFim) query = query.lte('vencimento', filtros.vencimentoFim);
      if (filtros.fornecedor) query = query.ilike('fornecedor', `%${filtros.fornecedor}%`);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar titulos a pagar: ${error.message}`);
      return data as TituloPagarRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
