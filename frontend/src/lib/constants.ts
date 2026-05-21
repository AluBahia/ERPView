import type { NavGroup } from '../types';

export const NAV_GROUPS: NavGroup[] = [
  { area: 'geral', items: [{ id: 'dashboard', icon: 'IconDashboard', label: 'Dashboard', area: 'geral' }] },
  { area: 'comercial', label: 'Comercial', items: [
    { id: 'vendas', icon: 'IconShoppingCart', label: 'Vendas', area: 'comercial' },
    { id: 'clientes', icon: 'IconUsers', label: 'Clientes', area: 'comercial' },
    { id: 'compras', icon: 'IconPackage', label: 'Compras', area: 'comercial' },
    { id: 'fornecedores', icon: 'IconBuildingFactory2', label: 'Fornecedores', area: 'comercial' },
  ]},
  { area: 'industrial', label: 'Industrial', items: [
    { id: 'estoque', icon: 'IconBox', label: 'Estoque', area: 'industrial' },
    { id: 'produtos', icon: 'IconStack', label: 'Produtos & BOM', area: 'industrial' },
    { id: 'producao', icon: 'IconTool', label: 'Produção (PCP)', area: 'industrial' },
    { id: 'qualidade', icon: 'IconCertificate', label: 'Qualidade (SGQ)', area: 'industrial' },
    { id: 'expedicao', icon: 'IconTruck', label: 'Expedição', area: 'industrial' },
    { id: 'manutencao', icon: 'IconSettings', label: 'Manutenção', area: 'industrial' },
  ]},
  { area: 'financeiro', label: 'Financeiro', items: [
    { id: 'receber', icon: 'IconCash', label: 'Contas a Receber', area: 'financeiro' },
    { id: 'pagar', icon: 'IconCreditCard', label: 'Contas a Pagar', area: 'financeiro' },
    { id: 'fluxo-caixa', icon: 'IconChartLine', label: 'Fluxo de Caixa', area: 'financeiro' },
    { id: 'dre', icon: 'IconReportAnalytics', label: 'DRE & Resultado', area: 'financeiro' },
    { id: 'custos', icon: 'IconCalculator', label: 'Custos & Margens', area: 'financeiro' },
  ]},
  { area: 'fiscal', label: 'Fiscal & RH', items: [
    { id: 'fiscal', icon: 'IconFileInvoice', label: 'Fiscal & Tributário', area: 'fiscal' },
    { id: 'rh', icon: 'IconIdBadge', label: 'RH & Folha', area: 'fiscal' },
    { id: 'patrimonio', icon: 'IconHome2', label: 'Ativo Fixo', area: 'fiscal' },
  ]},
];

export const QUERY_STALE_TIME = 1000 * 60 * 5; // 5 minutes
