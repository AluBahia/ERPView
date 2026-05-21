import { useState } from 'react';
import { toast } from 'sonner';

export function useExport() {
  const [exporting, setExporting] = useState(false);

  const exportReport = async (_module: string) => {
    setExporting(true);
    try {
      toast.info('Gerando relatório...');
      // Mock delay
      await new Promise((r) => setTimeout(r, 2000));
      // In production: const { data } = await apiClient.get(`/api/relatorio/${module}`, { responseType: 'blob' });
      toast.success('Relatório gerado com sucesso!');
    } catch {
      toast.error('Erro ao gerar relatório.');
    } finally {
      setExporting(false);
    }
  };

  return { exporting, exportReport };
}
