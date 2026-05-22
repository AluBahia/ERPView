import { describe, test, expect, vi } from 'vitest';
import { usePermissao } from '../../hooks/usePermissao';

const mockUseAuthStore = vi.hoisted(() => vi.fn());
vi.mock('../../store/authStore', () => ({
  useAuthStore: (selector: any) => selector(mockUseAuthStore()),
}));

describe('usePermissao', () => {
  test('temPermissao("vendas") retorna true para operador_vendas', () => {
    mockUseAuthStore.mockReturnValue({ perfil: { role: 'operador_vendas' } });
    const { temPermissao } = usePermissao();
    expect(temPermissao('vendas')).toBe(true);
  });

  test('temPermissao("financeiro") retorna false para operador_vendas', () => {
    mockUseAuthStore.mockReturnValue({ perfil: { role: 'operador_vendas' } });
    const { temPermissao } = usePermissao();
    expect(temPermissao('receber')).toBe(false);
  });

  test('isAdmin() retorna true e temPermissao() é sempre true para admin', () => {
    mockUseAuthStore.mockReturnValue({ perfil: { role: 'admin' } });
    const { temPermissao, isAdmin } = usePermissao();
    expect(isAdmin()).toBe(true);
    expect(temPermissao('qualquer_modulo')).toBe(true);
  });
});
