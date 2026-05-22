import { vi } from 'vitest';

export const mockPageHook = (data: unknown[] = []) => ({
  data,
  isLoading: false,
  error: null,
  refetch: vi.fn(),
});

export const mockPageHookLoading = () => ({
  data: undefined,
  isLoading: true,
  error: null,
  refetch: vi.fn(),
});

export const mockKPIsHook = (data: unknown[] = []) => ({
  data,
  isLoading: false,
  error: null,
  refetch: vi.fn(),
});
