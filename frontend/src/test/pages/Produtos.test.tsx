import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('../../hooks/useKPIs', () => ({ useKPIs: () => ({ data: [], isLoading: false, error: null, refetch: vi.fn() }) }));
vi.mock('../../hooks/useProdutos', () => ({ useProdutos: () => ({ data: [], isLoading: false, error: null, refetch: vi.fn() }) }));
vi.mock('../../hooks/useExport', () => ({ useExport: () => ({ exporting: false, exportReport: vi.fn() }) }));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Produtos', () => {
  test('renderiza sem crash', async () => {
    const { default: Produtos } = await import('../../pages/Produtos');
    const { container } = render(<Produtos />, { wrapper: createWrapper() });
    expect(container.firstChild).toBeTruthy();
  });
});


describe('Produtos', () => {
  test('renderiza conteudo', async () => {
    const { default: Page } = await import('../../pages/Produtos');
    const { container } = render(<Page />, { wrapper: createWrapper() });
    expect(container.textContent?.length).toBeGreaterThan(0);
  });
});
