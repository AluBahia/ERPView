import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { useAuthStore } from './store/authStore';

// Lazy load all pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Vendas = lazy(() => import('./pages/Vendas'));
const Clientes = lazy(() => import('./pages/Clientes'));
const Compras = lazy(() => import('./pages/Compras'));
const Fornecedores = lazy(() => import('./pages/Fornecedores'));
const Estoque = lazy(() => import('./pages/Estoque'));
const Produtos = lazy(() => import('./pages/Produtos'));
const Producao = lazy(() => import('./pages/Producao'));
const Qualidade = lazy(() => import('./pages/Qualidade'));
const Expedicao = lazy(() => import('./pages/Expedicao'));
const Manutencao = lazy(() => import('./pages/Manutencao'));
const Receber = lazy(() => import('./pages/Receber'));
const Pagar = lazy(() => import('./pages/Pagar'));
const FluxoCaixa = lazy(() => import('./pages/FluxoCaixa'));
const DRE = lazy(() => import('./pages/DRE'));
const Custos = lazy(() => import('./pages/Custos'));
const Fiscal = lazy(() => import('./pages/Fiscal'));
const RH = lazy(() => import('./pages/RH'));
const Patrimonio = lazy(() => import('./pages/Patrimonio'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-bg-tertiary" />
        <div className="text-text-muted text-sm">Carregando...</div>
      </div>
    </div>
  );
}

function Suspensed({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Suspensed><Login /></Suspensed>,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspensed><Dashboard /></Suspensed> },
      { path: 'vendas', element: <Suspensed><Vendas /></Suspensed> },
      { path: 'clientes', element: <Suspensed><Clientes /></Suspensed> },
      { path: 'compras', element: <Suspensed><Compras /></Suspensed> },
      { path: 'fornecedores', element: <Suspensed><Fornecedores /></Suspensed> },
      { path: 'estoque', element: <Suspensed><Estoque /></Suspensed> },
      { path: 'produtos', element: <Suspensed><Produtos /></Suspensed> },
      { path: 'producao', element: <Suspensed><Producao /></Suspensed> },
      { path: 'qualidade', element: <Suspensed><Qualidade /></Suspensed> },
      { path: 'expedicao', element: <Suspensed><Expedicao /></Suspensed> },
      { path: 'manutencao', element: <Suspensed><Manutencao /></Suspensed> },
      { path: 'financeiro/receber', element: <Suspensed><Receber /></Suspensed> },
      { path: 'financeiro/pagar', element: <Suspensed><Pagar /></Suspensed> },
      { path: 'financeiro/fluxo-caixa', element: <Suspensed><FluxoCaixa /></Suspensed> },
      { path: 'financeiro/dre', element: <Suspensed><DRE /></Suspensed> },
      { path: 'financeiro/custos', element: <Suspensed><Custos /></Suspensed> },
      { path: 'fiscal', element: <Suspensed><Fiscal /></Suspensed> },
      { path: 'rh', element: <Suspensed><RH /></Suspensed> },
      { path: 'patrimonio', element: <Suspensed><Patrimonio /></Suspensed> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
