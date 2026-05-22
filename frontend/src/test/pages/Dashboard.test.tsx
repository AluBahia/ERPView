import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('../../hooks/useKPIs', () => ({
  useKPIs: () => ({ data: [], isLoading: false, error: null, refetch: vi.fn() }),
}));
vi.mock('../../components/charts/BarChart', () => ({ BarChart: () => <div>BarChart</div> }));
vi.mock('../../components/charts/LineChart', () => ({ LineChart: () => <div>LineChart</div> }));
vi.mock('../../components/charts/GaugeChart', () => ({ GaugeChart: () => <div>GaugeChart</div> }));
vi.mock('../../components/charts/PieChart', () => ({ PieChart: () => <div>PieChart</div> }));
vi.mock('framer-motion', () => ({ motion: { div: ({ children }: any) => <div>{children}</div> } }));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Dashboard', () => {
  test('renderiza sem crash', async () => {
    const { default: Dashboard } = await import('../../pages/Dashboard');
    const { container } = render(<Dashboard />, { wrapper: createWrapper() });
    expect(container.firstChild).toBeTruthy();
  });

  test('renderiza conteúdo', async () => {
    const { default: Dashboard } = await import('../../pages/Dashboard');
    const { container } = render(<Dashboard />, { wrapper: createWrapper() });
    expect(container.textContent?.length).toBeGreaterThan(0);
  });
});
