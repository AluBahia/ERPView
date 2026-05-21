import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type OrdemServicoRow = Database['public']['Tables']['ordens_servico']['Row'];

export interface FiltrosManutencao {
  dataInicio?: string;
  dataFim?: string;
  tipo?: string;
  status?: string;
  equipamento?: string;
}

export function useManutencao(filtros: FiltrosManutencao = {}) {
  return useQuery({
    queryKey: ['manutencao', filtros],
    queryFn: async () => {
      let query = supabase
        .from('ordens_servico')
        .select('*')
        .order('abertura', { ascending: false });

      if (filtros.status) query = query.eq('status', filtros.status);
      if (filtros.tipo) query = query.eq('tipo', filtros.tipo);
      if (filtros.equipamento) query = query.ilike('equipamento', `%${filtros.equipamento}%`);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar manutencao: ${error.message}`);
      return data as OrdemServicoRow[];
    },
    staleTime: QUERY_STALE_TIME,
  });
}
