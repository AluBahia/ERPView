import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type PedidoVendaRow = Database['public']['Tables']['pedidos_venda']['Row'];

export interface FiltrosVendas {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  clienteId?: number;
}

export function useVendas(filtros: FiltrosVendas = {}) {
  return useQuery({
    queryKey: ['vendas', filtros],
    queryFn: async () => {
      let query = supabase
        .from('pedidos_venda')
        .select('*, clientes(nome, cidade)')
        .order('data_pedido', { ascending: false });

      if (filtros.dataInicio) query = query.gte('data_pedido', filtros.dataInicio);
      if (filtros.dataFim) query = query.lte('data_pedido', filtros.dataFim);
      if (filtros.status) query = query.eq('status', filtros.status);
      if (filtros.clienteId) query = query.eq('cliente_id', filtros.clienteId);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar vendas: ${error.message}`);
      return data as PedidoVendaRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
