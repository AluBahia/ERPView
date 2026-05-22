import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  IconMenu2,
  IconLogout,
  IconBuildingFactory2,
} from '@tabler/icons-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useFilterStore } from '../../store/filterStore';
import { NAV_GROUPS } from '../../lib/constants';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const DATE_RANGES = [
  'Hoje',
  'Últimos 7 dias',
  'Últimos 15 dias',
  'Últimos 30 dias',
  'Últimos 90 dias',
  'Este mês',
  'Este trimestre',
  'Este ano',
  'Personalizado',
];

const FILIAIS = ['Todas', 'Filial 01 – Matriz', 'Filial 02 – São Paulo', 'Filial 03 – Belo Horizonte'];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function getLabelForPath(pathname: string): string {
  const id = pathname.split('/').filter(Boolean)[0] ?? 'dashboard';
  for (const group of NAV_GROUPS) {
    const found = group.items.find((item) => item.id === id);
    if (found) return found.label;
  }
  return 'Dashboard';
}

/* -------------------------------------------------------------------------- */
/*  Shared select styling                                                     */
/* -------------------------------------------------------------------------- */

const selectClasses =
  'bg-bg-tertiary border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50 cursor-pointer appearance-none pr-8 bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[position:right_8px_center] bg-no-repeat';

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Header() {
  const location = useLocation();
  const { mobileMenuOpen, setMobileMenuOpen, factoryFloorActive, toggleFactoryFloor } = useUIStore();
  const { user, perfil, logout } = useAuthStore();
  const { dateRange, filial, setDateRange, setFilial } = useFilterStore();

  const pageLabel = useMemo(() => getLabelForPath(location.pathname), [location.pathname]);

  return (
    <header className="flex items-center gap-3 h-14 shrink-0 px-4 bg-bg-secondary border-b border-border">
      {/* ---- Left ---- */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <IconMenu2 size={20} stroke={1.5} />
        </button>

        {/* Breadcrumb / page name */}
        <span className="text-sm font-medium text-text-secondary truncate">
          {pageLabel}
        </span>
      </div>

      {/* ---- Center — filters ---- */}
      <div className="hidden md:flex items-center gap-3 mx-auto">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className={selectClasses}
        >
          {DATE_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={filial}
          onChange={(e) => setFilial(e.target.value)}
          className={selectClasses}
        >
          {FILIAIS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Spacer for mobile */}
      <div className="md:hidden flex-1" />

      {/* ---- Right ---- */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Factory Floor toggle */}
        <button
          onClick={toggleFactoryFloor}
          title="Fábrica (Chão de Produção)"
          className={`
            hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer
            ${factoryFloorActive
              ? 'bg-green/12 text-green border border-green/30'
              : 'bg-bg-tertiary text-text-muted border border-border-subtle hover:text-text-secondary'}
          `}
        >
          <IconBuildingFactory2 size={16} stroke={1.5} />
          Fábrica
        </button>

        {/* User avatar + name */}
        {user && (
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue/15 text-blue text-xs font-semibold">
              {perfil?.nome?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
            </span>
            <span className="hidden sm:block text-sm text-text-secondary max-w-[120px] truncate">
              {perfil?.nome || user.email?.split('@')[0] || 'Usuário'}
            </span>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          title="Sair"
          className="p-1.5 rounded-lg text-text-muted hover:text-red hover:bg-red/10 transition-colors cursor-pointer"
        >
          <IconLogout size={18} stroke={1.5} />
        </button>
      </div>
    </header>
  );
}
