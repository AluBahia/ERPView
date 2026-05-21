import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterState } from '../types';

interface FilterStore extends FilterState {
  setDateRange: (range: string) => void;
  setFilial: (filial: string) => void;
  setVendedor: (vendedor: string) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  dateRange: 'Últimos 30 dias',
  filial: 'Todas',
  vendedor: 'Todos',
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      ...initialState,
      setDateRange: (dateRange) => set({ dateRange }),
      setFilial: (filial) => set({ filial }),
      setVendedor: (vendedor) => set({ vendedor }),
      resetFilters: () => set(initialState),
    }),
    { name: 'erpview-filters' }
  )
);
