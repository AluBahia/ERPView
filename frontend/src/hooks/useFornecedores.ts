import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type FornecedorRow = Database['public']['Tables']['fornecedores']['Row'];

export interface FiltrosFornecedores {
  categoria?: string;
  homologacao?: string;
}

export function useFornecedores(filtros: FiltrosFornecedores = {}) {
  return useQuery({
    queryKey: ['fornecedores', filtros],
    queryFn: async () => {
      let query = supabase
        .from('fornecedores')
        .select('*')
        .order('nome', { ascending: true });

      if (filtros.categoria) query = query.eq('categoria', filtros.categoria);
      if (filtros.homologacao) query = query.eq('homologacao', filtros.homologacao);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar fornecedores: ${error.message}`);
      return data as FornecedorRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
