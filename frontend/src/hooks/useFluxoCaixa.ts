import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME_FINANCEIRO } from '../lib/constants';
import type { Database } from '../types';

export type FluxoCaixaRow = Database['public']['Tables']['fluxo_caixa']['Row'];

export interface FiltrosFluxoCaixa {
  mes?: string;
  ano?: string;
  tipo?: 'Entrada' | 'Saída';
  categoria?: string;
}

export function useFluxoCaixa(filtros: FiltrosFluxoCaixa = {}) {
  return useQuery({
    queryKey: ['fluxo-caixa', filtros],
    queryFn: async () => {
      let query = supabase
        .from('fluxo_caixa')
        .select('*')
        .order('data', { ascending: true });

      if (filtros.tipo) query = query.eq('tipo', filtros.tipo);
      if (filtros.categoria) query = query.eq('categoria', filtros.categoria);
      if (filtros.mes && filtros.ano) {
        const inicio = `${filtros.ano}-${filtros.mes}-01`;
        query = query.gte('data', inicio);
      }

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar fluxo de caixa: ${error.message}`);
      return data as FluxoCaixaRow[];
    },
    staleTime: QUERY_STALE_TIME_FINANCEIRO,
  });
}
