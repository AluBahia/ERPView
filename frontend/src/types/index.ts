export interface KPI {
  label: string;
  value: string;
  trend?: string;
  up?: boolean;
  icon: string;
  color: 'blue' | 'green' | 'amber' | 'red';
}

export interface PedidoVenda {
  id: string;
  cliente: string;
  vendedor: string;
  data: string;
  valor: string;
  status: 'Aberto' | 'Em produção' | 'Expedido' | 'Faturado' | 'Cancelado';
}

export interface Cliente {
  id: string;
  nome: string;
  segmento: string;
  volumeCompras: string;
  frequencia: string;
  prazoMedio: string;
  classeABC: 'A' | 'B' | 'C';
  statusCredito: 'OK' | 'Atenção' | 'Bloqueado';
}

export interface ItemEstoque {
  id: string;
  codigo: string;
  descricao: string;
  deposito: string;
  saldo: string;
  minimo: string;
  status: 'OK' | 'Atenção' | 'Crítico' | 'Zerado';
  cobertura: string;
}

export interface OrdemProducao {
  id: string;
  produto: string;
  quantidade: string;
  inicioPrev: string;
  fimPrev: string;
  status: 'Planejada' | 'Em produção' | 'Atrasada' | 'Concluída';
  desvio: string;
}

export interface TituloReceber {
  id: string;
  cliente: string;
  numero: string;
  emissao: string;
  vencimento: string;
  valor: string;
  status: 'A vencer' | 'Vencido' | 'Recebido';
  diasAtraso?: string;
}

export interface TituloPagar {
  id: string;
  fornecedor: string;
  numero: string;
  emissao: string;
  vencimento: string;
  valor: string;
  status: 'Pendente' | 'Aprovado' | 'Pago' | 'Vencido';
  categoria: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  categoria: string;
  avaliacao: number;
  homologacao: 'Homologado' | 'Condicional' | 'Não homologado';
  documentacao: 'OK' | 'Vencendo' | 'Vencida';
}

export interface Produto {
  id: string;
  codigo: string;
  descricao: string;
  familia: string;
  custo: string;
  precoVenda: string;
  margem: string;
  giro: 'Alto' | 'Médio' | 'Baixo';
}

export interface OrdemServico {
  id: string;
  equipamento: string;
  tipo: 'Corretiva' | 'Preventiva' | 'Preditiva';
  prioridade: 'Alta' | 'Média' | 'Baixa';
  abertura: string;
  prevConclusao: string;
  status: 'Aberta' | 'Em andamento' | 'Vencida' | 'Concluída';
}

export interface BemPatrimonial {
  id: string;
  codigo: string;
  descricao: string;
  categoria: string;
  valorOriginal: string;
  depreciacaoAcumulada: string;
  valorLiquido: string;
  localizacao: string;
  status: 'Em uso' | 'Depreciado' | 'Baixado';
}

export interface NCR {
  id: string;
  numero: string;
  produto: string;
  descricao: string;
  responsavel: string;
  prazo: string;
  status: 'Aberta' | 'Em análise' | 'Ação corretiva' | 'Verificação' | 'Fechada';
  vencida: boolean;
}

export interface PedidoExpedicao {
  id: string;
  numero: string;
  cliente: string;
  cidade: string;
  peso: string;
  transportadora: string;
  prevEntrega: string;
  status: 'Em separação' | 'Pronto' | 'Em trânsito' | 'Entregue' | 'Atrasado';
}

export interface NFiscal {
  id: string;
  numero: string;
  contraparte: string;
  data: string;
  valor: string;
  tipo: 'Entrada' | 'Saída';
  status: 'OK' | 'Pendente' | 'Erro';
}

export type AreaColor = 'blue' | 'green' | 'amber' | 'red';

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  area: string;
}

export interface NavGroup {
  area: string;
  label?: string;
  items: NavItem[];
}

export interface FilterState {
  dateRange: string;
  filial: string;
  vendedor: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
  initials: string;
}
