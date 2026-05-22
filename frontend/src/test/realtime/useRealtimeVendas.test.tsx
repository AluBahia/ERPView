import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRealtimeVendas } from '../../hooks/useRealtimeVendas';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useRealtimeVendas', () => {
  test('hook monta sem erros', () => {
    const { unmount } = renderHook(() => useRealtimeVendas(), { wrapper: createWrapper() });
    expect(unmount).toBeDefined();
    unmount();
  });
});
