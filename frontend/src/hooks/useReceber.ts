import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME_FINANCEIRO } from '../lib/constants';
import type { Database } from '../types';

export type TituloReceberRow = Database['public']['Tables']['titulos_receber']['Row'];

export interface FiltrosReceber {
  vencimentoInicio?: string;
  vencimentoFim?: string;
  status?: string;
  clienteId?: number;
}

export function useReceber(filtros: FiltrosReceber = {}) {
  return useQuery({
    queryKey: ['receber', filtros],
    queryFn: async () => {
      let query = supabase
        .from('titulos_receber')
        .select('*, clientes(nome)')
        .order('vencimento', { ascending: true });

      if (filtros.status) query = query.eq('status', filtros.status);
      if (filtros.vencimentoInicio) query = query.gte('vencimento', filtros.vencimentoInicio);
      if (filtros.vencimentoFim) query = query.lte('vencimento', filtros.vencimentoFim);
      if (filtros.clienteId) query = query.eq('cliente_id', filtros.clienteId);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar titulos a receber: ${error.message}`);
      return data as TituloReceberRow[];
    },
    staleTime: QUERY_STALE_TIME_FINANCEIRO,
  });
}
