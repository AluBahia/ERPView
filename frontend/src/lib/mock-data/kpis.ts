import type { KPI, PedidoVenda, Cliente, ItemEstoque, OrdemProducao, TituloReceber, TituloPagar, Fornecedor, Produto, OrdemServico, BemPatrimonial, NCR, PedidoExpedicao, NFiscal } from '../../types';

// Dashboard KPIs
export const dashboardKPIs: KPI[] = [
  { label: 'Faturamento Diário', value: 'R$ 125.400', trend: '+8.2%', up: true, icon: '💰', color: 'green' },
  { label: 'Faturamento Mensal', value: 'R$ 2.850.000', trend: '+5.1%', up: true, icon: '📈', color: 'blue' },
  { label: 'Ticket Médio', value: 'R$ 3.200', trend: '-1.3%', up: false, icon: '🧾', color: 'blue' },
  { label: 'Pedidos em Aberto', value: '47', trend: '+3', up: false, icon: '🛒', color: 'amber' },
  { label: 'Clientes Ativos', value: '312', trend: '+12', up: true, icon: '👥', color: 'blue' },
  { label: 'Alertas de Estoque', value: '8 itens', trend: '+2', up: false, icon: '⚠️', color: 'red' },
  { label: 'A Receber (30d)', value: 'R$ 450.000', trend: '-3.5%', up: true, icon: '💰', color: 'green' },
  { label: 'A Pagar (30d)', value: 'R$ 380.000', trend: '+1.8%', up: false, icon: '💳', color: 'amber' },
];

// Module-specific KPIs
export const vendasKPIs: KPI[] = [
  { label: 'Faturamento', value: 'R$ 1.240.000', trend: '+6.4%', up: true, icon: '💰', color: 'green' },
  { label: 'Ticket Médio', value: 'R$ 3.200', trend: '-1.3%', up: false, icon: '🧾', color: 'blue' },
  { label: 'Conversão Orç.', value: '34.2%', trend: '+2.1%', up: true, icon: '📊', color: 'blue' },
  { label: 'Pedidos Cancelados', value: '12', trend: '+3', up: false, icon: '✕', color: 'red' },
];

export const clientesKPIs: KPI[] = [
  { label: 'Clientes Ativos', value: '312', trend: '+12', up: true, icon: '👥', color: 'blue' },
  { label: 'Novos Clientes', value: '18', trend: '+5', up: true, icon: '✨', color: 'green' },
  { label: 'Inadimplentes', value: '23', trend: '+2', up: false, icon: '⚠️', color: 'red' },
  { label: 'Ticket Médio', value: 'R$ 9.130', trend: '+3.2%', up: true, icon: '🧾', color: 'amber' },
];

export const comprasKPIs: KPI[] = [
  { label: 'Volume Compras', value: 'R$ 890.000', trend: '+4.1%', up: true, icon: '📦', color: 'blue' },
  { label: 'Pend. Aprovação', value: '7', trend: '+2', up: false, icon: '⏳', color: 'amber' },
  { label: 'Em Atraso', value: '3', trend: '-1', up: true, icon: '⚠️', color: 'red' },
  { label: 'Saving Cotações', value: 'R$ 34.200', trend: '+12%', up: true, icon: '💡', color: 'green' },
];

export const fornecedoresKPIs: KPI[] = [
  { label: 'Fornecedores Ativos', value: '87', trend: '+3', up: true, icon: '🏭', color: 'blue' },
  { label: 'Críticos (única fonte)', value: '12', trend: '+1', up: false, icon: '⚠️', color: 'amber' },
  { label: 'Entregas no Prazo', value: '91.3%', trend: '+2.1%', up: true, icon: '✅', color: 'green' },
  { label: 'Doc. Vencida', value: '4', trend: '-2', up: true, icon: '📄', color: 'red' },
];

export const estoqueKPIs: KPI[] = [
  { label: 'Valor em Estoque', value: 'R$ 4.230.000', trend: '-2.1%', up: false, icon: '📋', color: 'blue' },
  { label: 'Giro', value: '4.2x', trend: '+0.3', up: true, icon: '🔄', color: 'green' },
  { label: 'Abaixo do Mínimo', value: '23', trend: '+5', up: false, icon: '⚠️', color: 'amber' },
  { label: 'Zerados', value: '8', trend: '+2', up: false, icon: '❌', color: 'red' },
  { label: 'Cobertura', value: '34 dias', trend: '-3', up: false, icon: '📅', color: 'amber' },
];

export const produtosKPIs: KPI[] = [
  { label: 'Produtos Ativos', value: '847', trend: '+23', up: true, icon: '🧩', color: 'blue' },
  { label: 'Fichas Incompletas', value: '34', trend: '-5', up: true, icon: '📝', color: 'amber' },
  { label: 'Margem Média', value: '28.4%', trend: '+1.2%', up: true, icon: '📊', color: 'green' },
  { label: 'Sem Movimentação', value: '61', trend: '+8', up: false, icon: '💤', color: 'red' },
];

export const producaoKPIs: KPI[] = [
  { label: 'OEE Geral', value: '78.3%', trend: '+2.1%', up: true, icon: '📊', color: 'green' },
  { label: 'Ordens em Produção', value: '14', trend: '+2', up: false, icon: '⚙️', color: 'blue' },
  { label: 'Ordens Atrasadas', value: '3', trend: '-1', up: true, icon: '⚠️', color: 'amber' },
  { label: 'Taxa Retrabalho', value: '2.1%', trend: '-0.3%', up: true, icon: '🔄', color: 'green' },
  { label: 'Capacidade Utilizada', value: '84%', trend: '+4%', up: true, icon: '📈', color: 'blue' },
];

export const qualidadeKPIs: KPI[] = [
  { label: 'Aprovação Receb.', value: '94.7%', trend: '+1.2%', up: true, icon: '✅', color: 'green' },
  { label: 'DPMO', value: '320', trend: '-45', up: true, icon: '📊', color: 'blue' },
  { label: 'NCRs Abertas', value: '11', trend: '+3', up: false, icon: '📝', color: 'amber' },
  { label: 'NCRs Vencidas', value: '2', trend: '-1', up: true, icon: '⚠️', color: 'red' },
  { label: 'Reclamações', value: '4', trend: '-2', up: true, icon: '📞', color: 'amber' },
  { label: 'FPY', value: '96.2%', trend: '+0.8%', up: true, icon: '🎯', color: 'green' },
];

export const expedicaoKPIs: KPI[] = [
  { label: 'OTD', value: '87.4%', trend: '+1.8%', up: true, icon: '🚛', color: 'green' },
  { label: 'Embarcados Hoje', value: '23', trend: '+5', up: true, icon: '📦', color: 'blue' },
  { label: 'Em Atraso', value: '4', trend: '-2', up: true, icon: '⚠️', color: 'amber' },
  { label: 'Custo Médio Frete', value: 'R$ 342', trend: '+3%', up: false, icon: '💰', color: 'amber' },
  { label: 'NFs Emitidas Hoje', value: '31', trend: '+8', up: true, icon: '🧾', color: 'blue' },
];

export const manutencaoKPIs: KPI[] = [
  { label: 'MTBF', value: '340 h', trend: '+12h', up: true, icon: '⏱️', color: 'green' },
  { label: 'MTTR', value: '4.2 h', trend: '-0.3h', up: true, icon: '🔧', color: 'green' },
  { label: 'Disponibilidade', value: '92.1%', trend: '+1.4%', up: true, icon: '📈', color: 'blue' },
  { label: 'OSs Abertas', value: '18', trend: '+3', up: false, icon: '📋', color: 'amber' },
  { label: 'OSs Vencidas', value: '2', trend: '-1', up: true, icon: '⚠️', color: 'red' },
  { label: 'Preventiva Cumprida', value: '86%', trend: '+4%', up: true, icon: '✅', color: 'green' },
];

export const receberKPIs: KPI[] = [
  { label: 'A Receber 30d', value: 'R$ 450.000', icon: '💰', color: 'green' },
  { label: 'A Receber 60d', value: 'R$ 680.000', icon: '💰', color: 'blue' },
  { label: 'A Receber 90d', value: 'R$ 820.000', icon: '💰', color: 'blue' },
  { label: 'Recebimentos Hoje', value: 'R$ 42.300', trend: '+15%', up: true, icon: '📥', color: 'green' },
  { label: 'Inadimplência', value: 'R$ 127.000 (8.4%)', trend: '+0.3%', up: false, icon: '⚠️', color: 'red' },
  { label: 'PMR', value: '38 dias', trend: '-2d', up: true, icon: '📅', color: 'amber' },
];

export const pagarKPIs: KPI[] = [
  { label: 'A Pagar 30d', value: 'R$ 380.000', icon: '💳', color: 'amber' },
  { label: 'A Pagar 60d', value: 'R$ 540.000', icon: '💳', color: 'blue' },
  { label: 'A Pagar 90d', value: 'R$ 670.000', icon: '💳', color: 'blue' },
  { label: 'Pagamentos Hoje', value: 'R$ 28.500', icon: '📤', color: 'green' },
  { label: 'Em Atraso', value: 'R$ 15.200', trend: '-3%', up: true, icon: '⚠️', color: 'red' },
  { label: 'PMP', value: '32 dias', trend: '+1d', up: false, icon: '📅', color: 'amber' },
];

export const fluxoCaixaKPIs: KPI[] = [
  { label: 'Saldo Atual', value: 'R$ 1.240.000', icon: '🏦', color: 'green' },
  { label: 'Saldo Prev. 30d', value: 'R$ 980.000', icon: '📊', color: 'blue' },
  { label: 'Saldo Prev. 90d', value: 'R$ 1.450.000', icon: '📈', color: 'blue' },
  { label: 'Pico Negativo', value: 'R$ -45.000 (dia 18)', icon: '⚠️', color: 'red' },
  { label: 'Liquidez Corrente', value: '1.34', icon: '⚖️', color: 'green' },
];

export const dreKPIs: KPI[] = [
  { label: 'Receita Bruta', value: 'R$ 2.850.000', trend: '+5.1%', up: true, icon: '💰', color: 'green' },
  { label: 'Receita Líquida', value: 'R$ 2.420.000', trend: '+4.8%', up: true, icon: '📊', color: 'blue' },
  { label: 'Margem Bruta', value: '38.2%', trend: '+1.3%', up: true, icon: '📈', color: 'green' },
  { label: 'EBITDA', value: 'R$ 410.000', trend: '+7.2%', up: true, icon: '💎', color: 'green' },
  { label: 'Margem Líquida', value: '12.8%', trend: '+0.5%', up: true, icon: '📊', color: 'blue' },
];

export const custosKPIs: KPI[] = [
  { label: 'Custo Médio Produto', value: 'R$ 47,30', trend: '+2.1%', up: false, icon: '🧮', color: 'amber' },
  { label: 'Desvio Real vs Padrão', value: '3.4%', trend: '+0.2%', up: false, icon: '⚠️', color: 'red' },
  { label: 'Margem Contribuição', value: '31.6%', trend: '+0.8%', up: true, icon: '📊', color: 'green' },
  { label: 'Custo/Hora Produção', value: 'R$ 142', trend: '-1.5%', up: true, icon: '⏱️', color: 'green' },
];

export const fiscalKPIs: KPI[] = [
  { label: 'Impostos Mês', value: 'R$ 387.000', trend: '+3%', up: false, icon: '🧾', color: 'amber' },
  { label: 'NFs Emitidas', value: '342', trend: '+28', up: true, icon: '📄', color: 'blue' },
  { label: 'NFs com Erro', value: '3', trend: '-2', up: true, icon: '❌', color: 'green' },
  { label: 'Créditos ICMS/PIS', value: 'R$ 124.000', trend: '+8%', up: true, icon: '💰', color: 'green' },
  { label: 'Obrigações 7 dias', value: '2', icon: '📅', color: 'red' },
];

export const rhKPIs: KPI[] = [
  { label: 'Headcount', value: '247', trend: '+5', up: true, icon: '👥', color: 'blue' },
  { label: 'Turnover', value: '2.8%', trend: '+0.2%', up: false, icon: '🔄', color: 'amber' },
  { label: 'Absenteísmo', value: '4.1%', trend: '-0.3%', up: true, icon: '📅', color: 'green' },
  { label: 'Custo Folha', value: 'R$ 1.120.000', trend: '+2%', up: false, icon: '💰', color: 'amber' },
  { label: 'Horas Extras', value: '1.240 h', trend: '+8%', up: false, icon: '⏰', color: 'red' },
  { label: 'Acidentes', value: '0', icon: '✅', color: 'green' },
];

export const patrimonioKPIs: KPI[] = [
  { label: 'Valor Imobilizado', value: 'R$ 8.450.000', icon: '🏢', color: 'blue' },
  { label: 'Depreciação Acumulada', value: 'R$ 3.210.000', trend: '+R$ 78.000', up: false, icon: '📉', color: 'amber' },
  { label: 'Valor Líquido', value: 'R$ 5.240.000', icon: '💰', color: 'green' },
  { label: 'Bens Deprec. em Uso', value: '14', icon: '⚠️', color: 'amber' },
  { label: 'Adições no Período', value: 'R$ 340.000', trend: '+R$ 120.000', up: true, icon: '📥', color: 'blue' },
];

// KPI getter function
export function getMockKPIs(module: string): KPI[] {
  const map: Record<string, KPI[]> = {
    dashboard: dashboardKPIs,
    vendas: vendasKPIs,
    clientes: clientesKPIs,
    compras: comprasKPIs,
    fornecedores: fornecedoresKPIs,
    estoque: estoqueKPIs,
    produtos: produtosKPIs,
    producao: producaoKPIs,
    qualidade: qualidadeKPIs,
    expedicao: expedicaoKPIs,
    manutencao: manutencaoKPIs,
    receber: receberKPIs,
    pagar: pagarKPIs,
    'fluxo-caixa': fluxoCaixaKPIs,
    dre: dreKPIs,
    custos: custosKPIs,
    fiscal: fiscalKPIs,
    rh: rhKPIs,
    patrimonio: patrimonioKPIs,
  };
  return map[module] || [];
}

// Table mock data
export const mockPedidosVenda: PedidoVenda[] = [
  { id: '1', cliente: 'Metalúrgica Silva', vendedor: 'Carlos', data: '07/05/2026', valor: 'R$ 18.400', status: 'Aberto' },
  { id: '2', cliente: 'Ind. Papelão Sul', vendedor: 'Ana', data: '06/05/2026', valor: 'R$ 42.100', status: 'Em produção' },
  { id: '3', cliente: 'TechParts Ltda', vendedor: 'Roberto', data: '06/05/2026', valor: 'R$ 8.750', status: 'Expedido' },
  { id: '4', cliente: 'AutoPeças Braga', vendedor: 'Carlos', data: '05/05/2026', valor: 'R$ 31.200', status: 'Faturado' },
  { id: '5', cliente: 'Embalagens Nova', vendedor: 'Ana', data: '05/05/2026', valor: 'R$ 15.600', status: 'Cancelado' },
  { id: '6', cliente: 'Ferro Liga S.A.', vendedor: 'Roberto', data: '04/05/2026', valor: 'R$ 67.300', status: 'Expedido' },
];

export const mockClientes: Cliente[] = [
  { id: '1', nome: 'Metalúrgica Silva', segmento: 'Indústria', volumeCompras: 'R$ 420.000', frequencia: 'Semanal', prazoMedio: '28d', classeABC: 'A', statusCredito: 'OK' },
  { id: '2', nome: 'Ind. Papelão Sul', segmento: 'Indústria', volumeCompras: 'R$ 380.000', frequencia: 'Quinzenal', prazoMedio: '35d', classeABC: 'A', statusCredito: 'Atenção' },
  { id: '3', nome: 'TechParts Ltda', segmento: 'Tecnologia', volumeCompras: 'R$ 210.000', frequencia: 'Mensal', prazoMedio: '30d', classeABC: 'B', statusCredito: 'OK' },
  { id: '4', nome: 'AutoPeças Braga', segmento: 'Automotivo', volumeCompras: 'R$ 180.000', frequencia: 'Semanal', prazoMedio: '21d', classeABC: 'B', statusCredito: 'OK' },
  { id: '5', nome: 'Embalagens Nova', segmento: 'Embalagem', volumeCompras: 'R$ 95.000', frequencia: 'Mensal', prazoMedio: '42d', classeABC: 'C', statusCredito: 'Bloqueado' },
];

export const mockEstoque: ItemEstoque[] = [
  { id: '1', codigo: 'MP-0012', descricao: 'Chapa Aço 3mm', deposito: 'Galpão A', saldo: '1.200 un', minimo: '800 un', status: 'OK', cobertura: '42d' },
  { id: '2', codigo: 'MP-0034', descricao: 'Barra Latão 12mm', deposito: 'Galpão A', saldo: '340 un', minimo: '500 un', status: 'Atenção', cobertura: '18d' },
  { id: '3', codigo: 'MP-0078', descricao: 'Tinta Industrial Azul', deposito: 'Almox.', saldo: '0 un', minimo: '20 un', status: 'Zerado', cobertura: '0d' },
  { id: '4', codigo: 'CP-0021', descricao: 'Parafuso M8x30', deposito: 'Almox.', saldo: '15.400 un', minimo: '10.000 un', status: 'OK', cobertura: '55d' },
  { id: '5', codigo: 'MP-0091', descricao: 'Resina Epóxi', deposito: 'Almox.', saldo: '8 un', minimo: '15 un', status: 'Crítico', cobertura: '5d' },
];

export const mockOrdensProducao: OrdemProducao[] = [
  { id: '1', produto: 'Flange DN100', quantidade: '500 un', inicioPrev: '05/05', fimPrev: '09/05', status: 'Em produção', desvio: '+3%' },
  { id: '2', produto: 'Válvula Gaveta 2"', quantidade: '120 un', inicioPrev: '04/05', fimPrev: '08/05', status: 'Atrasada', desvio: '+12%' },
  { id: '3', produto: 'Conjunto Vedação K3', quantidade: '2.000 un', inicioPrev: '03/05', fimPrev: '06/05', status: 'Concluída', desvio: '-1%' },
  { id: '4', produto: 'Tubo Aço 4"', quantidade: '80 un', inicioPrev: '07/05', fimPrev: '12/05', status: 'Planejada', desvio: '0%' },
];

export const mockTitulosReceber: TituloReceber[] = [
  { id: '1', cliente: 'Metal. Silva', numero: 'NF-8847', emissao: '01/04', vencimento: '01/05', valor: 'R$ 18.400', status: 'Vencido', diasAtraso: '6d' },
  { id: '2', cliente: 'Ind. Papelão Sul', numero: 'NF-8834', emissao: '15/03', vencimento: '15/04', valor: 'R$ 42.100', status: 'Vencido', diasAtraso: '22d' },
  { id: '3', cliente: 'TechParts', numero: 'NF-8856', emissao: '25/04', vencimento: '25/05', valor: 'R$ 8.750', status: 'A vencer' },
  { id: '4', cliente: 'AutoPeças Braga', numero: 'NF-8860', emissao: '02/05', vencimento: '01/06', valor: 'R$ 31.200', status: 'A vencer' },
];

export const mockTitulosPagar: TituloPagar[] = [
  { id: '1', fornecedor: 'Aço Forte Ltda', numero: 'NF-2844', emissao: '28/04', vencimento: '28/05', valor: 'R$ 28.400', status: 'Pendente', categoria: 'Materiais' },
  { id: '2', fornecedor: 'Química Beta', numero: 'NF-2840', emissao: '25/04', vencimento: '25/05', valor: 'R$ 15.200', status: 'Aprovado', categoria: 'Insumos' },
  { id: '3', fornecedor: 'Energia Elétrica', numero: 'NF-2838', emissao: '20/04', vencimento: '20/05', valor: 'R$ 42.000', status: 'Aprovado', categoria: 'Utilidades' },
];

export const mockFornecedores: Fornecedor[] = [
  { id: '1', nome: 'Aço Forte Ltda', categoria: 'Matéria-prima', avaliacao: 4.5, homologacao: 'Homologado', documentacao: 'OK' },
  { id: '2', nome: 'Química Beta', categoria: 'Insumos', avaliacao: 3.8, homologacao: 'Condicional', documentacao: 'Vencendo' },
  { id: '3', nome: 'PackMaster', categoria: 'Embalagem', avaliacao: 4.1, homologacao: 'Homologado', documentacao: 'OK' },
  { id: '4', nome: 'Lubrificantes Pro', categoria: 'Manutenção', avaliacao: 3.2, homologacao: 'Condicional', documentacao: 'Vencida' },
  { id: '5', nome: 'Componentes Max', categoria: 'Componentes', avaliacao: 4.7, homologacao: 'Homologado', documentacao: 'OK' },
];

export const mockProdutos: Produto[] = [
  { id: '1', codigo: 'PRD-001', descricao: 'Flange DN100', familia: 'Flanges', custo: 'R$ 45,00', precoVenda: 'R$ 68,00', margem: '33.8%', giro: 'Alto' },
  { id: '2', codigo: 'PRD-002', descricao: 'Válvula Gaveta 2"', familia: 'Válvulas', custo: 'R$ 120,00', precoVenda: 'R$ 185,00', margem: '35.1%', giro: 'Médio' },
  { id: '3', codigo: 'PRD-003', descricao: 'Conjunto Vedação K3', familia: 'Vedações', custo: 'R$ 8,50', precoVenda: 'R$ 14,00', margem: '39.3%', giro: 'Alto' },
  { id: '4', codigo: 'PRD-004', descricao: 'Tubo Aço Carbono 4"', familia: 'Tubos', custo: 'R$ 92,00', precoVenda: 'R$ 112,00', margem: '17.9%', giro: 'Baixo' },
];

export const mockOS: OrdemServico[] = [
  { id: '1', equipamento: 'Prensa 200T', tipo: 'Corretiva', prioridade: 'Alta', abertura: '05/05', prevConclusao: '07/05', status: 'Em andamento' },
  { id: '2', equipamento: 'Compressor Atlas', tipo: 'Preventiva', prioridade: 'Média', abertura: '04/05', prevConclusao: '06/05', status: 'Vencida' },
  { id: '3', equipamento: 'Torno CNC', tipo: 'Preditiva', prioridade: 'Baixa', abertura: '03/05', prevConclusao: '10/05', status: 'Em andamento' },
];

export const mockBens: BemPatrimonial[] = [
  { id: '1', codigo: 'ATF-001', descricao: 'Prensa Hidráulica 200T', categoria: 'Máquinas', valorOriginal: 'R$ 380.000', depreciacaoAcumulada: 'R$ 190.000', valorLiquido: 'R$ 190.000', localizacao: 'Galpão A', status: 'Em uso' },
  { id: '2', codigo: 'ATF-002', descricao: 'Empilhadeira Yale', categoria: 'Veículos', valorOriginal: 'R$ 120.000', depreciacaoAcumulada: 'R$ 84.000', valorLiquido: 'R$ 36.000', localizacao: 'Galpão B', status: 'Em uso' },
  { id: '3', codigo: 'ATF-003', descricao: 'Torno CNC Romi', categoria: 'Máquinas', valorOriginal: 'R$ 450.000', depreciacaoAcumulada: 'R$ 180.000', valorLiquido: 'R$ 270.000', localizacao: 'Usinagem', status: 'Em uso' },
  { id: '4', codigo: 'ATF-004', descricao: 'Ar Condicionado Central', categoria: 'Instalações', valorOriginal: 'R$ 95.000', depreciacaoAcumulada: 'R$ 95.000', valorLiquido: 'R$ 0', localizacao: 'Admin', status: 'Depreciado' },
];

export const mockNCRs: NCR[] = [
  { id: '1', numero: 'NCR-0234', produto: 'Flange DN100', descricao: 'Dimensão fora de tolerância', responsavel: 'João', prazo: '10/05', status: 'Aberta', vencida: false },
  { id: '2', numero: 'NCR-0233', produto: 'Válvula Gaveta', descricao: 'Acabamento superficial irregular', responsavel: 'Maria', prazo: '08/05', status: 'Em análise', vencida: false },
  { id: '3', numero: 'NCR-0230', produto: 'Flange DN200', descricao: 'Montagem incorreta', responsavel: 'Pedro', prazo: '05/05', status: 'Ação corretiva', vencida: true },
  { id: '4', numero: 'NCR-0227', produto: 'Válvula Esfera', descricao: 'Material não conforme', responsavel: 'Ana', prazo: '06/05', status: 'Verificação', vencida: true },
  { id: '5', numero: 'NCR-0224', produto: 'Tubo Inox 2"', descricao: 'Superfície com riscos', responsavel: 'Carlos', prazo: '03/05', status: 'Fechada', vencida: false },
];

export const mockExpedicao: PedidoExpedicao[] = [
  { id: '1', numero: 'PV-0847', cliente: 'Metal. Silva', cidade: 'São Paulo/SP', peso: '1.200 kg', transportadora: 'Jadlog', prevEntrega: '09/05', status: 'Em separação' },
  { id: '2', numero: 'PV-0844', cliente: 'AutoPeças Braga', cidade: 'Campinas/SP', peso: '850 kg', transportadora: 'Próprio', prevEntrega: '08/05', status: 'Pronto' },
  { id: '3', numero: 'PV-0841', cliente: 'Ferro Liga', cidade: 'Betim/MG', peso: '3.400 kg', transportadora: 'Rodoviária SP', prevEntrega: '07/05', status: 'Atrasado' },
];

export const mockNFs: NFiscal[] = [
  { id: '1', numero: 'NF-8860', contraparte: 'AutoPeças Braga', data: '07/05', valor: 'R$ 31.200', tipo: 'Saída', status: 'OK' },
  { id: '2', numero: 'NF-2845', contraparte: 'Aço Forte Ltda', data: '06/05', valor: 'R$ 82.400', tipo: 'Entrada', status: 'OK' },
  { id: '3', numero: 'NF-8859', contraparte: 'TechParts', data: '06/05', valor: 'R$ 8.750', tipo: 'Saída', status: 'Pendente' },
  { id: '4', numero: 'NF-8858', contraparte: 'Ind. Papelão', data: '05/05', valor: 'R$ 42.100', tipo: 'Saída', status: 'Erro' },
];

// Chart data helpers
export const faturamentoMensal = [
  { month: 'Jun', valor: 1850000 }, { month: 'Jul', valor: 2100000 },
  { month: 'Aug', valor: 1950000 }, { month: 'Sep', valor: 2300000 },
  { month: 'Oct', valor: 2500000 }, { month: 'Nov', valor: 2650000 },
  { month: 'Dec', valor: 2800000 }, { month: 'Jan', valor: 2400000 },
  { month: 'Feb', valor: 2550000 }, { month: 'Mar', valor: 2700000 },
  { month: 'Apr', valor: 2850000 }, { month: 'May', valor: 125400 },
];

export const topVendedores = [
  { nome: 'Carlos', valor: 185000 }, { nome: 'Ana', valor: 162000 },
  { nome: 'Roberto', valor: 148000 }, { nome: 'Fernanda', valor: 127000 },
  { nome: 'Paulo', valor: 98000 },
];

export const canaisVenda = [
  { name: 'Direto', value: 55, fill: 'var(--color-blue)' },
  { name: 'Distribuidor', value: 30, fill: 'var(--color-green)' },
  { name: 'E-commerce', value: 15, fill: 'var(--color-amber)' },
];
