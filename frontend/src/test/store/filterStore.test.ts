import { describe, test, expect } from 'vitest';
import { useFilterStore } from '../../store/filterStore';

describe('filterStore', () => {
  test('inicia com filtros default', () => {
    const state = useFilterStore.getState();
    expect(state.dateRange).toBeDefined();
    expect(state.filial).toBe('Todas');
  });

  test('setDateRange atualiza valor', () => {
    useFilterStore.getState().setDateRange('Últimos 7 dias');
    expect(useFilterStore.getState().dateRange).toBe('Últimos 7 dias');
  });
});
