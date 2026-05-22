import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

const mockUseAuthStore = vi.hoisted(() => vi.fn());
vi.mock('../../store/authStore', () => ({
  useAuthStore: (selector: any) => selector(mockUseAuthStore()),
}));

const mockUsePermissao = vi.hoisted(() => vi.fn());
vi.mock('../../hooks/usePermissao', () => ({
  usePermissao: () => mockUsePermissao(),
}));

function TestWrapper({ children, moduleName }: { children: React.ReactNode; moduleName?: string }) {
  return (
    <MemoryRouter initialEntries={[moduleName ? `/${moduleName}` : '/']}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/acesso-negado" element={<div>Acesso Negado</div>} />
        <Route
          path="/*"
          element={
            <ProtectedRoute requiredModule={moduleName}>
              {children}
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('ProtectedRoute renderiza conteúdo para usuário com role correto', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: true });
    mockUsePermissao.mockReturnValue({ temPermissao: () => true });

    render(<TestWrapper moduleName="vendas"><div>Conteúdo Vendas</div></TestWrapper>);
    expect(screen.getByText('Conteúdo Vendas')).toBeInTheDocument();
  });

  test('ProtectedRoute redireciona para /acesso-negado sem permissão', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: true });
    mockUsePermissao.mockReturnValue({ temPermissao: () => false });

    render(<TestWrapper moduleName="financeiro"><div>Conteúdo Financeiro</div></TestWrapper>);
    expect(screen.getByText('Acesso Negado')).toBeInTheDocument();
  });

  test('ProtectedRoute redireciona para /login se não autenticado', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false });
    mockUsePermissao.mockReturnValue({ temPermissao: () => true });

    render(<TestWrapper moduleName="vendas"><div>Conteúdo Vendas</div></TestWrapper>);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
