import { IconFileTypePdf } from '@tabler/icons-react';
import { Button } from './Button';
import { useRelatorio } from '../../hooks/useRelatorio';

interface BotaoRelatorioProps {
  nome: string;
  params: Record<string, string>;
  label?: string;
}

export function BotaoRelatorio({ nome, params, label = 'Gerar PDF' }: BotaoRelatorioProps) {
  const { gerarRelatorio, loading } = useRelatorio();

  return (
    <Button onClick={() => gerarRelatorio(nome, params)} loading={loading} variant="ghost">
      {loading ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
      ) : (
        <IconFileTypePdf size={18} className="mr-2" />
      )}
      {label}
    </Button>
  );
}
