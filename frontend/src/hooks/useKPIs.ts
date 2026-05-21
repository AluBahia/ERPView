import { useQuery } from '@tanstack/react-query';
import { QUERY_STALE_TIME } from '../lib/constants';
import { useFilterStore } from '../store/filterStore';
import { supabase } from '../lib/supabase';
import type { KPI } from '../types';

// Mapeamento de módulos para tabelas no Supabase
const MODULE_TABLE_MAP: Record<string, string> = {
  dashboard: 'dashboard_kpis',
  vendas: 'pedidos_venda',
  clientes: 'clientes',
  compras: 'pedidos_compra',
  fornecedores: 'fornecedores',
  estoque: 'itens_estoque',
  produtos: 'produtos',
  producao: 'ordens_producao',
  qualidade: 'ncr',
  expedicao: 'pedidos_expedicao',
  manutencao: 'ordens_servico',
  receber: 'titulos_receber',
  pagar: 'titulos_pagar',
  'fluxo-caixa': 'fluxo_caixa',
  dre: 'dre',
  custos: 'custos',
  fiscal: 'notas_fiscais',
  rh: 'rh',
  patrimonio: 'bens_patrimoniais',
};

export function useKPIs(module: string) {
  const { dateRange, filial } = useFilterStore();
  const tableName = MODULE_TABLE_MAP[module] || module;

  return useQuery<KPI[]>({
    queryKey: ['kpis', module, dateRange, filial],
    queryFn: async () => {
      // Consulta dados reais do Supabase
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);

      if (error) {
        console.error(`Erro ao carregar KPIs de ${module}:`, error.message);
        return [];
      }

      // Transformar dados da tabela em formato KPI
      // Cada módulo pode ter sua própria lógica de transformação
      return transformToKPIs(module, data || []);
    },
    staleTime: QUERY_STALE_TIME,
  });
}

// Função auxiliar para transformar dados em KPIs
function transformToKPIs(module: string, data: any[]): KPI[] {
  // Implementação básica - cada módulo pode ter sua própria lógica
  switch (module) {
    case 'dashboard':
      return [
        {
          label: 'Faturamento Hoje',
          value: 'R$ 0,00',
          trend: '+0%',
          up: true,
          icon: 'IconCash',
          color: 'green',
        },
      ];
    default:
      return [];
  }
}
