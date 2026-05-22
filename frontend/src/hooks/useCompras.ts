import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types/supabase';

export interface FiltrosCompras {
  dataInicio?: string;
  dataFim?: string;
  fornecedor?: string;
  status?: string;
}

export type PedidoCompra = Database['public']['Tables']['pedidos_compra']['Row'];

export function useCompras(filtros: FiltrosCompras = {}) {
  return useQuery({
    queryKey: ['compras', filtros],
    queryFn: async () => {
      let query = supabase
        .from('pedidos_compra')
        .select('*')
        .order('data_emissao', { ascending: false });

      if (filtros.dataInicio) query = query.gte('data_emissao', filtros.dataInicio);
      if (filtros.dataFim) query = query.lte('data_emissao', filtros.dataFim);
      if (filtros.status) query = query.eq('status', filtros.status);
      if (filtros.fornecedor) query = query.ilike('observacao', `%${filtros.fornecedor}%`);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar compras: ${error.message}`);
      return (data || []) as PedidoCompra[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
