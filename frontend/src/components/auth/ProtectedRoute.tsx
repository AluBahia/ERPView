import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePermissao } from '../../hooks/usePermissao';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: string;
}

export function ProtectedRoute({ children, requiredModule }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { temPermissao } = usePermissao();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredModule && !temPermissao(requiredModule)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
}
