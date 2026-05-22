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
  rh: 'rh_colaboradores',
  patrimonio: 'bens_patrimoniais',
};

// Tabelas que ainda nao existem no schema (hooks retornam erro gracefully)
const MISSING_TABLES = new Set(['pedidos_compra']);

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value || 0);
}

export function useKPIs(module: string) {
  const { dateRange, filial } = useFilterStore();
  const tableName = MODULE_TABLE_MAP[module] || module;

  return useQuery<KPI[]>({
    queryKey: ['kpis', module, dateRange, filial],
    queryFn: async () => {
      if (MISSING_TABLES.has(tableName)) {
        throw new Error(`Tabela ${tableName} ainda nao foi criada no Supabase`);
      }

      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .limit(100);

      if (error) throw new Error(`Erro ao carregar KPIs de ${module}: ${error.message}`);

      return transformToKPIs(module, data || []);
    },
    staleTime: QUERY_STALE_TIME,
  });
}

function transformToKPIs(module: string, data: any[]): KPI[] {
  if (!data.length) return [];

  switch (module) {
    case 'dashboard': {
      const row = data[0] || {};
      return [
        { label: 'Vendas do Dia', value: formatCurrency(row.vendas_dia), trend: '+0%', up: true, icon: 'IconCash', color: 'green' },
        { label: 'Vendas do Mes', value: formatCurrency(row.vendas_mes), trend: '+0%', up: true, icon: 'IconChartLine', color: 'blue' },
        { label: 'Contas a Receber Vencidas', value: formatCurrency(row.contas_receber_vencidas), trend: '-0%', up: false, icon: 'IconReceipt', color: 'red' },
        { label: 'Contas a Pagar a Vencer', value: formatCurrency(row.contas_pagar_vencer), trend: '+0%', up: true, icon: 'IconCreditCard', color: 'amber' },
        { label: 'NCRs Abertas', value: formatNumber(row.ncr_abertas), trend: '-0%', up: false, icon: 'IconAlertCircle', color: 'red' },
        { label: 'OS Pendentes', value: formatNumber(row.os_manutencao_pendentes), trend: '-0%', up: false, icon: 'IconSettings', color: 'amber' },
      ];
    }

    case 'vendas': {
      const total = data.reduce((s, r) => s + (r.valor_total || 0), 0);
      const abertos = data.filter((r) => r.status === 'Aberto').length;
      return [
        { label: 'Total de Pedidos', value: formatNumber(data.length), icon: 'IconShoppingCart', color: 'blue' },
        { label: 'Valor Total', value: formatCurrency(total), icon: 'IconCash', color: 'green' },
        { label: 'Pedidos Abertos', value: formatNumber(abertos), icon: 'IconPackage', color: 'amber' },
      ];
    }

    case 'clientes': {
      const classeA = data.filter((r) => r.classe_abc === 'A').length;
      return [
        { label: 'Total de Clientes', value: formatNumber(data.length), icon: 'IconUsers', color: 'blue' },
        { label: 'Classe A', value: formatNumber(classeA), icon: 'IconStar', color: 'green' },
      ];
    }

    case 'compras': {
      return [
        { label: 'Total de Pedidos', value: formatNumber(data.length), icon: 'IconPackage', color: 'blue' },
      ];
    }

    case 'fornecedores': {
      const homologados = data.filter((r) => r.homologacao === 'Homologado').length;
      return [
        { label: 'Total de Fornecedores', value: formatNumber(data.length), icon: 'IconBuildingFactory2', color: 'blue' },
        { label: 'Homologados', value: formatNumber(homologados), icon: 'IconCertificate', color: 'green' },
      ];
    }

    case 'estoque': {
      const critico = data.filter((r) => r.status === 'Crítico').length;
      const zerado = data.filter((r) => r.status === 'Zerado').length;
      return [
        { label: 'Itens em Estoque', value: formatNumber(data.length), icon: 'IconBox', color: 'blue' },
        { label: 'Críticos', value: formatNumber(critico), icon: 'IconAlertTriangle', color: 'red' },
        { label: 'Zerados', value: formatNumber(zerado), icon: 'IconCircleOff', color: 'amber' },
      ];
    }

    case 'produtos': {
      const altoGiro = data.filter((r) => r.giro === 'Alto').length;
      return [
        { label: 'Total de Produtos', value: formatNumber(data.length), icon: 'IconStack', color: 'blue' },
        { label: 'Alto Giro', value: formatNumber(altoGiro), icon: 'IconTrendingUp', color: 'green' },
      ];
    }

    case 'producao': {
      const emProducao = data.filter((r) => r.status === 'Em produção').length;
      const atrasadas = data.filter((r) => r.status === 'Atrasada').length;
      return [
        { label: 'Ordens de Producao', value: formatNumber(data.length), icon: 'IconTool', color: 'blue' },
        { label: 'Em Producao', value: formatNumber(emProducao), icon: 'IconHammer', color: 'green' },
        { label: 'Atrasadas', value: formatNumber(atrasadas), icon: 'IconClock', color: 'red' },
      ];
    }

    case 'qualidade': {
      const abertas = data.filter((r) => r.status === 'Aberta').length;
      const vencidas = data.filter((r) => r.vencida).length;
      return [
        { label: 'Total de NCRs', value: formatNumber(data.length), icon: 'IconFileAlert', color: 'blue' },
        { label: 'Abertas', value: formatNumber(abertas), icon: 'IconAlertCircle', color: 'amber' },
        { label: 'Vencidas', value: formatNumber(vencidas), icon: 'IconCircleX', color: 'red' },
      ];
    }

    case 'expedicao': {
      const atrasados = data.filter((r) => r.status === 'Atrasado').length;
      return [
        { label: 'Pedidos', value: formatNumber(data.length), icon: 'IconTruck', color: 'blue' },
        { label: 'Atrasados', value: formatNumber(atrasados), icon: 'IconClock', color: 'red' },
      ];
    }

    case 'manutencao': {
      const abertas = data.filter((r) => r.status === 'Aberta').length;
      const vencidas = data.filter((r) => r.status === 'Vencida').length;
      return [
        { label: 'Total de OS', value: formatNumber(data.length), icon: 'IconSettings', color: 'blue' },
        { label: 'Abertas', value: formatNumber(abertas), icon: 'IconWrench', color: 'amber' },
        { label: 'Vencidas', value: formatNumber(vencidas), icon: 'IconClock', color: 'red' },
      ];
    }

    case 'receber': {
      const total = data.reduce((s, r) => s + (r.valor || 0), 0);
      const vencidos = data.filter((r) => r.status === 'Vencido').length;
      return [
        { label: 'Titulos a Receber', value: formatNumber(data.length), icon: 'IconReceipt', color: 'blue' },
        { label: 'Valor Total', value: formatCurrency(total), icon: 'IconCash', color: 'green' },
        { label: 'Vencidos', value: formatNumber(vencidos), icon: 'IconAlertCircle', color: 'red' },
      ];
    }

    case 'pagar': {
      const total = data.reduce((s, r) => s + (r.valor || 0), 0);
      const vencidos = data.filter((r) => r.status === 'Vencido').length;
      return [
        { label: 'Titulos a Pagar', value: formatNumber(data.length), icon: 'IconCreditCard', color: 'blue' },
        { label: 'Valor Total', value: formatCurrency(total), icon: 'IconCash', color: 'green' },
        { label: 'Vencidos', value: formatNumber(vencidos), icon: 'IconAlertCircle', color: 'red' },
      ];
    }

    case 'fluxo-caixa': {
      const entradas = data.filter((r) => r.tipo === 'Entrada').reduce((s, r) => s + (r.valor || 0), 0);
      const saidas = data.filter((r) => r.tipo === 'Saída').reduce((s, r) => s + (r.valor || 0), 0);
      return [
        { label: 'Movimentacoes', value: formatNumber(data.length), icon: 'IconChartLine', color: 'blue' },
        { label: 'Entradas', value: formatCurrency(entradas), icon: 'IconArrowUp', color: 'green' },
        { label: 'Saidas', value: formatCurrency(saidas), icon: 'IconArrowDown', color: 'red' },
      ];
    }

    case 'dre': {
      const row = data[0] || {};
      return [
        { label: 'Receita Bruta', value: formatCurrency(row.receita_bruta), icon: 'IconChartBar', color: 'blue' },
        { label: 'Lucro Bruto', value: formatCurrency(row.lucro_bruto), icon: 'IconTrendingUp', color: 'green' },
        { label: 'Resultado Liquido', value: formatCurrency(row.resultado_liquido), icon: 'IconScale', color: 'amber' },
      ];
    }

    case 'custos': {
      const total = data.reduce((s, r) => s + (r.custo_total || 0), 0);
      return [
        { label: 'Registros de Custo', value: formatNumber(data.length), icon: 'IconCalculator', color: 'blue' },
        { label: 'Custo Total', value: formatCurrency(total), icon: 'IconCoin', color: 'green' },
      ];
    }

    case 'fiscal': {
      const total = data.reduce((s, r) => s + (r.valor || 0), 0);
      return [
        { label: 'Notas Fiscais', value: formatNumber(data.length), icon: 'IconFileInvoice', color: 'blue' },
        { label: 'Valor Total', value: formatCurrency(total), icon: 'IconCash', color: 'green' },
      ];
    }

    case 'rh': {
      const ativos = data.filter((r) => r.status === 'Ativo').length;
      const totalSalarios = data.reduce((s, r) => s + (r.salario || 0), 0);
      return [
        { label: 'Colaboradores', value: formatNumber(data.length), icon: 'IconIdBadge', color: 'blue' },
        { label: 'Ativos', value: formatNumber(ativos), icon: 'IconUserCheck', color: 'green' },
        { label: 'Folha Salarial', value: formatCurrency(totalSalarios), icon: 'IconCoins', color: 'amber' },
      ];
    }

    case 'patrimonio': {
      const totalOriginal = data.reduce((s, r) => s + (r.valor_original || 0), 0);
      const totalLiquido = data.reduce((s, r) => s + (r.valor_liquido || 0), 0);
      return [
        { label: 'Bens Patrimoniais', value: formatNumber(data.length), icon: 'IconHome2', color: 'blue' },
        { label: 'Valor Original', value: formatCurrency(totalOriginal), icon: 'IconCoin', color: 'green' },
        { label: 'Valor Liquido', value: formatCurrency(totalLiquido), icon: 'IconScale', color: 'amber' },
      ];
    }

    default:
      return [];
  }
}
