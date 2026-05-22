import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';

const mockUseAuthStore = vi.hoisted(() => vi.fn());
vi.mock('../../store/authStore', () => ({
  useAuthStore: (selector: any) => selector(mockUseAuthStore()),
}));

vi.mock('../../store/uiStore', () => ({
  useUIStore: () => ({
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    toggleSidebar: vi.fn(),
    setMobileMenuOpen: vi.fn(),
  }),
}));

describe('Sidebar RBAC', () => {
  test('Sidebar renderiza somente links de módulos autorizados do perfil', () => {
    mockUseAuthStore.mockReturnValue({
      user: { id: '1' },
      perfil: { role: 'operador_vendas' },
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    // operador_vendas tem: dashboard, vendas, clientes, estoque, produtos
    expect(screen.queryAllByText('Vendas').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Clientes').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Estoque').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Produtos & BOM').length).toBeGreaterThan(0);
    // Não deve ter financeiro
    expect(screen.queryByText('Contas a Receber')).not.toBeInTheDocument();
    expect(screen.queryByText('Contas a Pagar')).not.toBeInTheDocument();
  });
});
