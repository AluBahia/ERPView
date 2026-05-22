import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { Pagination } from '../../components/ui/Pagination';

describe('Pagination', () => {
  test('renderiza controles de paginação', () => {
    render(<Pagination page={1} pageSize={10} totalItems={35} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />);
    expect(screen.getByText('Mostrando 1-10 de 35')).toBeInTheDocument();
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
  });

  test('clicar em próxima página chama callback', () => {
    const onChange = vi.fn();
    render(<Pagination page={1} pageSize={10} totalItems={35} onPageChange={onChange} onPageSizeChange={vi.fn()} />);
    fireEvent.click(screen.getByText('Próximo'));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
