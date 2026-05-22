import { useAuthStore } from '../store/authStore';

const MODULOS_POR_PERFIL: Record<string, string[]> = {
  admin: [
    'dashboard', 'vendas', 'clientes', 'compras', 'fornecedores',
    'estoque', 'produtos', 'producao', 'qualidade', 'expedicao',
    'manutencao', 'receber', 'pagar', 'fluxo-caixa', 'dre', 'custos',
    'fiscal', 'rh', 'patrimonio',
  ],
  gerente: [
    'dashboard', 'vendas', 'clientes', 'compras', 'fornecedores',
    'estoque', 'produtos', 'producao', 'qualidade', 'expedicao',
    'manutencao', 'receber', 'pagar', 'fluxo-caixa', 'dre', 'custos',
    'fiscal', 'rh', 'patrimonio',
  ],
  operador_vendas: ['dashboard', 'vendas', 'clientes', 'estoque', 'produtos'],
  operador_financeiro: ['dashboard', 'receber', 'pagar', 'fluxo-caixa', 'dre', 'custos'],
  operador_producao: ['dashboard', 'producao', 'qualidade', 'expedicao', 'manutencao'],
  visualizador: ['dashboard'],
};

export function usePermissao() {
  const perfil = useAuthStore((s) => s.perfil);
  const role = perfil?.role || 'visualizador';
  const modulosPermitidos = MODULOS_POR_PERFIL[role] || MODULOS_POR_PERFIL.visualizador;

  function temPermissao(modulo: string): boolean {
    if (role === 'admin') return true;
    return modulosPermitidos.includes(modulo);
  }

  function isAdmin(): boolean {
    return role === 'admin';
  }

  function isGerente(): boolean {
    return role === 'gerente';
  }

  return { temPermissao, isAdmin, isGerente, role, modulosPermitidos };
}
