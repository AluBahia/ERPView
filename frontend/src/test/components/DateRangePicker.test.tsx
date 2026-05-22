import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { DateRangePicker } from '../../components/filters/DateRangePicker';

describe('DateRangePicker', () => {
  test('dispara onChange ao alterar data inicial', () => {
    const onChange = vi.fn();
    render(<DateRangePicker value={{ start: '', end: '' }} onChange={onChange} />);
    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[0], { target: { value: '2026-01-01' } });
    expect(onChange).toHaveBeenCalledWith({ start: '2026-01-01', end: '' });
  });
});
