import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { StatusFilter } from '../../components/filters/StatusFilter';

describe('StatusFilter', () => {
  test('renderiza opções e dispara onChange', () => {
    const onChange = vi.fn();
    render(<StatusFilter options={['Aberto', 'Fechado']} value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Aberto' } });
    expect(onChange).toHaveBeenCalledWith('Aberto');
  });
});
