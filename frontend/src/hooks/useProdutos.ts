import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type ProdutoRow = Database['public']['Tables']['produtos']['Row'];

export interface FiltrosProdutos {
  categoria?: string;
  ativo?: boolean;
  giro?: string;
}

export function useProdutos(filtros: FiltrosProdutos = {}) {
  return useQuery({
    queryKey: ['produtos', filtros],
    queryFn: async () => {
      let query = supabase
        .from('produtos')
        .select('*')
        .order('descricao', { ascending: true });

      if (filtros.giro) query = query.eq('giro', filtros.giro);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar produtos: ${error.message}`);
      return data as ProdutoRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
