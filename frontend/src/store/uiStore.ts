import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  factoryFloorActive: boolean;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleFactoryFloor: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      factoryFloorActive: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleFactoryFloor: () => set((s) => ({ factoryFloorActive: !s.factoryFloorActive })),
    }),
    { name: 'erpview-ui', partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }) }
  )
);
