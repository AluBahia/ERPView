export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

export function statusToBadgeVariant(status: string): 'blue' | 'green' | 'amber' | 'red' | 'gray' {
  const map: Record<string, 'blue' | 'green' | 'amber' | 'red' | 'gray'> = {
    'Aberto': 'blue', 'Em produção': 'amber', 'Expedido': 'green',
    'Faturado': 'green', 'Cancelado': 'red', 'Em trânsito': 'blue',
    'Pendente': 'amber', 'Atrasado': 'red', 'Atrasada': 'red',
    'Concluída': 'green', 'Planejada': 'gray', 'OK': 'green',
    'Atenção': 'amber', 'Crítico': 'red', 'Zerado': 'red',
    'Homologado': 'green', 'Condicional': 'amber', 'Vencendo': 'amber',
    'Vencida': 'red', 'Bloqueado': 'red', 'Em uso': 'green',
    'Depreciado': 'amber', 'Baixado': 'gray', 'A vencer': 'blue',
    'Vencido': 'red', 'Recebido': 'green', 'Pago': 'green',
    'Aprovado': 'green', 'Não homologado': 'red', 'Pronto': 'green',
    'Em separação': 'blue', 'Entregue': 'green', 'Erro': 'red',
    'Em andamento': 'blue', 'Aberta': 'blue',
  };
  return map[status] || 'gray';
}

export const AREA_COLORS: Record<string, string> = {
  comercial: 'var(--color-blue)',
  industrial: 'var(--color-green)',
  financeiro: 'var(--color-amber)',
  fiscal: 'var(--color-red)',
  geral: 'var(--color-blue)',
};
