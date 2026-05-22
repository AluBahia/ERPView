import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRelatorio } from '../../hooks/useRelatorio';

const mockToken = vi.hoisted(() => vi.fn());
vi.mock('../../store/authStore', () => ({
  useAuthStore: (selector: any) => selector({ token: mockToken() }),
}));

const mockToast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock('sonner', () => ({ toast: mockToast }));

describe('useRelatorio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  test('hook solicita PDF com token correto', async () => {
    mockToken.mockReturnValue('valid-token');
    (window.fetch as any).mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['pdf'])),
    });

    const { result } = renderHook(() => useRelatorio());
    result.current.gerarRelatorio('vendas-periodo', { dataInicio: '2024-01-01' });

    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/relatorios/vendas-periodo'),
        expect.objectContaining({
          headers: { Authorization: 'Bearer valid-token' },
        })
      );
    });
  });

  test('hook redireciona para /login ao receber 401 do cr-service', async () => {
    mockToken.mockReturnValue('valid-token');
    (window.fetch as any).mockResolvedValue({ ok: false, status: 401, json: () => Promise.resolve({}) });

    const { result } = renderHook(() => useRelatorio());
    result.current.gerarRelatorio('vendas-periodo', { dataInicio: '2024-01-01' });

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(expect.stringContaining('Sessão expirada'));
    });
  });

  test('hook exibe toast de erro ao falhar a geração do PDF', async () => {
    mockToken.mockReturnValue('valid-token');
    (window.fetch as any).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRelatorio());
    result.current.gerarRelatorio('vendas-periodo', { dataInicio: '2024-01-01' });

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao gerar'));
    });
  });
});
