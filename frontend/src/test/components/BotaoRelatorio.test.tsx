import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BotaoRelatorio } from '../../components/ui/BotaoRelatorio';

const mockGerarRelatorio = vi.hoisted(() => vi.fn());
const mockLoading = vi.hoisted(() => vi.fn());
vi.mock('../../hooks/useRelatorio', () => ({
  useRelatorio: () => ({ gerarRelatorio: mockGerarRelatorio(), loading: mockLoading() }),
}));

describe('BotaoRelatorio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGerarRelatorio.mockReturnValue(vi.fn());
  });

  test('BotaoRelatorio exibe spinner durante chamada ao useRelatorio', () => {
    mockLoading.mockReturnValue(true);
    render(<BotaoRelatorio nome="vendas-periodo" params={{ dataInicio: '2024-01-01' }} />);
    expect(screen.getByText('Gerar PDF')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  test('BotaoRelatorio chama window.open com URL do PDF ao sucesso', () => {
    mockLoading.mockReturnValue(false);
    const gerarFn = vi.fn();
    mockGerarRelatorio.mockReturnValue(gerarFn);

    render(<BotaoRelatorio nome="vendas-periodo" params={{ dataInicio: '2024-01-01' }} />);
    fireEvent.click(screen.getByText('Gerar PDF'));
    expect(gerarFn).toHaveBeenCalledWith('vendas-periodo', { dataInicio: '2024-01-01' });
  });
});
