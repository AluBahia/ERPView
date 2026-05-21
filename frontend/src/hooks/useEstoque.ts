import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { QUERY_STALE_TIME } from '../lib/constants';
import type { Database } from '../types';

export type ItemEstoqueRow = Database['public']['Tables']['itens_estoque']['Row'];

export interface FiltrosEstoque {
  produto?: string;
  almoxarifado?: string;
  abaixoMinimo?: boolean;
  status?: string;
}

export function useEstoque(filtros: FiltrosEstoque = {}) {
  return useQuery({
    queryKey: ['estoque', filtros],
    queryFn: async () => {
      let query = supabase
        .from('itens_estoque')
        .select('*')
        .order('descricao', { ascending: true });

      if (filtros.almoxarifado) query = query.eq('deposito', filtros.almoxarifado);
      if (filtros.status) query = query.eq('status', filtros.status);

      const { data, error } = await query;
      if (error) throw new Error(`Erro ao carregar estoque: ${error.message}`);

      let result = data as ItemEstoqueRow[];
      if (filtros.abaixoMinimo) {
        result = result.filter((item) => (item.saldo || 0) < (item.minimo || 0));
      }
      if (filtros.produto) {
        const termo = filtros.produto.toLowerCase();
        result = result.filter(
          (item) =>
            item.descricao?.toLowerCase().includes(termo) ||
            item.codigo?.toLowerCase().includes(termo)
        );
      }
      return result;
    },
    staleTime: QUERY_STALE_TIME,
  });
}
