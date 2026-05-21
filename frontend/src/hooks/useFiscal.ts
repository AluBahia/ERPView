import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type NotaFiscalRow = Database['public']['Tables']['notas_fiscais']['Row'];

export interface FiltrosFiscal {
  dataInicio?: string;
  dataFim?: string;
  tipoNf?: string;
  cfop?: string;
}

export function useFiscal(filtros: FiltrosFiscal = {}) {
  return useQuery({
    queryKey: ['fiscal', filtros],
    queryFn: async () => {
      let query = supabase
        .from('notas_fiscais')
        .select('*')
        .order('data_emissao', { ascending: false });

      if (filtros.tipoNf) query = query.eq('tipo', filtros.tipoNf);
      if (filtros.dataInicio) query = query.gte('data_emissao', filtros.dataInicio);
      if (filtros.dataFim) query = query.lte('data_emissao', filtros.dataFim);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar notas fiscais: ${error.message}`);
      return data as NotaFiscalRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
