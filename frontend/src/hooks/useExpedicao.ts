import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type PedidoExpedicaoRow = Database['public']['Tables']['pedidos_expedicao']['Row'];

export interface FiltrosExpedicao {
  dataInicio?: string;
  dataFim?: string;
  transportadora?: string;
  status?: string;
}

export function useExpedicao(filtros: FiltrosExpedicao = {}) {
  return useQuery({
    queryKey: ['expedicao', filtros],
    queryFn: async () => {
      let query = supabase
        .from('pedidos_expedicao')
        .select('*')
        .order('prev_entrega', { ascending: true });

      if (filtros.status) query = query.eq('status', filtros.status);
      if (filtros.transportadora) query = query.eq('transportadora', filtros.transportadora);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar expedicao: ${error.message}`);
      return data as PedidoExpedicaoRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
