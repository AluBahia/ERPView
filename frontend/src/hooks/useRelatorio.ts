import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const CR_SERVICE_URL = import.meta.env.VITE_CR_SERVICE_URL || 'http://localhost:3001';

export function useRelatorio() {
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((s) => s.token);

  const gerarRelatorio = useCallback(
    async (nome: string, params: Record<string, string>) => {
      if (!token) {
        toast.error('Sessão expirada. Faça login novamente.');
        window.location.href = '/login';
        return;
      }

      setLoading(true);
      try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${CR_SERVICE_URL}/relatorios/${nome}?${queryString}`;

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          toast.error('Sessão expirada. Faça login novamente.');
          window.location.href = '/login';
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || 'Erro ao gerar relatório');
          return;
        }

        const blob = await response.blob();
        const pdfUrl = window.URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
        toast.success('Relatório gerado com sucesso');
      } catch (err) {
        toast.error('Erro ao gerar relatório. Tente novamente.');
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { gerarRelatorio, loading };
}
