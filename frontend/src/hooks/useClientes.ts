import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type ClienteRow = Database['public']['Tables']['clientes']['Row'];

export interface FiltrosClientes {
  cidade?: string;
  estado?: string;
  ativo?: boolean;
  classeAbc?: string;
}

export function useClientes(filtros: FiltrosClientes = {}) {
  return useQuery({
    queryKey: ['clientes', filtros],
    queryFn: async () => {
      let query = supabase
        .from('clientes')
        .select('*')
        .order('nome', { ascending: true });

      if (filtros.classeAbc) query = query.eq('classe_abc', filtros.classeAbc);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar clientes: ${error.message}`);
      return data as ClienteRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
