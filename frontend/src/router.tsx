import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

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
const AcessoNegado = lazy(() => import('./pages/AcessoNegado'));

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

function RouteWithModule({ children, module }: { children: React.ReactNode; module: string }) {
  return (
    <ProtectedRoute requiredModule={module}>
      {children}
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Suspensed><Login /></Suspensed>,
  },
  {
    path: '/acesso-negado',
    element: (
      <ProtectedRoute>
        <Suspensed><AcessoNegado /></Suspensed>
      </ProtectedRoute>
    ),
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
      { path: 'vendas', element: <RouteWithModule module="vendas"><Suspensed><Vendas /></Suspensed></RouteWithModule> },
      { path: 'clientes', element: <RouteWithModule module="clientes"><Suspensed><Clientes /></Suspensed></RouteWithModule> },
      { path: 'compras', element: <RouteWithModule module="compras"><Suspensed><Compras /></Suspensed></RouteWithModule> },
      { path: 'fornecedores', element: <RouteWithModule module="fornecedores"><Suspensed><Fornecedores /></Suspensed></RouteWithModule> },
      { path: 'estoque', element: <RouteWithModule module="estoque"><Suspensed><Estoque /></Suspensed></RouteWithModule> },
      { path: 'produtos', element: <RouteWithModule module="produtos"><Suspensed><Produtos /></Suspensed></RouteWithModule> },
      { path: 'producao', element: <RouteWithModule module="producao"><Suspensed><Producao /></Suspensed></RouteWithModule> },
      { path: 'qualidade', element: <RouteWithModule module="qualidade"><Suspensed><Qualidade /></Suspensed></RouteWithModule> },
      { path: 'expedicao', element: <RouteWithModule module="expedicao"><Suspensed><Expedicao /></Suspensed></RouteWithModule> },
      { path: 'manutencao', element: <RouteWithModule module="manutencao"><Suspensed><Manutencao /></Suspensed></RouteWithModule> },
      { path: 'financeiro/receber', element: <RouteWithModule module="receber"><Suspensed><Receber /></Suspensed></RouteWithModule> },
      { path: 'financeiro/pagar', element: <RouteWithModule module="pagar"><Suspensed><Pagar /></Suspensed></RouteWithModule> },
      { path: 'financeiro/fluxo-caixa', element: <RouteWithModule module="fluxo-caixa"><Suspensed><FluxoCaixa /></Suspensed></RouteWithModule> },
      { path: 'financeiro/dre', element: <RouteWithModule module="dre"><Suspensed><DRE /></Suspensed></RouteWithModule> },
      { path: 'financeiro/custos', element: <RouteWithModule module="custos"><Suspensed><Custos /></Suspensed></RouteWithModule> },
      { path: 'fiscal', element: <RouteWithModule module="fiscal"><Suspensed><Fiscal /></Suspensed></RouteWithModule> },
      { path: 'rh', element: <RouteWithModule module="rh"><Suspensed><RH /></Suspensed></RouteWithModule> },
      { path: 'patrimonio', element: <RouteWithModule module="patrimonio"><Suspensed><Patrimonio /></Suspensed></RouteWithModule> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
