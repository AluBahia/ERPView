import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';

export interface FiltrosCompras {
  dataInicio?: string;
  dataFim?: string;
  fornecedor?: string;
  status?: string;
}

export interface PedidoCompra {
  id: number;
  numero: string;
  fornecedor: string;
  data_pedido: string | null;
  valor_total: number | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useCompras(filtros: FiltrosCompras = {}) {
  return useQuery({
    queryKey: ['compras', filtros],
    queryFn: async () => {
      let query = (supabase as any)
        .from('pedidos_compra')
        .select('*')
        .order('data_pedido', { ascending: false });

      if (filtros.dataInicio) query = query.gte('data_pedido', filtros.dataInicio);
      if (filtros.dataFim) query = query.lte('data_pedido', filtros.dataFim);
      if (filtros.status) query = query.eq('status', filtros.status);
      if (filtros.fornecedor) query = query.ilike('fornecedor', `%${filtros.fornecedor}%`);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar compras: ${error.message}`);
      return (data || []) as PedidoCompra[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
