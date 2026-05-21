import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  IconDashboard,
  IconShoppingCart,
  IconUsers,
  IconPackage,
  IconBuildingFactory2,
  IconBox,
  IconStack,
  IconTool,
  IconCertificate,
  IconTruck,
  IconSettings,
  IconCash,
  IconCreditCard,
  IconChartLine,
  IconReportAnalytics,
  IconCalculator,
  IconFileInvoice,
  IconIdBadge,
  IconHome2,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconX,
} from '@tabler/icons-react';
import type { AreaColor } from '../../types';
import { NAV_GROUPS } from '../../lib/constants';
import { useUIStore } from '../../store/uiStore';

/* -------------------------------------------------------------------------- */
/*  Icon lookup — constant icon name strings → Tabler components              */
/* -------------------------------------------------------------------------- */

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; stroke?: number }>> = {
  IconDashboard,
  IconShoppingCart,
  IconUsers,
  IconPackage,
  IconBuildingFactory2,
  IconBox,
  IconStack,
  IconTool,
  IconCertificate,
  IconTruck,
  IconSettings,
  IconCash,
  IconCreditCard,
  IconChartLine,
  IconReportAnalytics,
  IconCalculator,
  IconFileInvoice,
  IconIdBadge,
  IconHome2,
};

/* -------------------------------------------------------------------------- */
/*  Area → colour mapping                                                     */
/* -------------------------------------------------------------------------- */

const AREA_COLOR: Record<string, AreaColor> = {
  geral: 'blue',
  comercial: 'blue',
  industrial: 'green',
  financeiro: 'amber',
  fiscal: 'red',
};

const AREA_BORDER: Record<AreaColor, string> = {
  blue: 'border-l-blue',
  green: 'border-l-green',
  amber: 'border-l-amber',
  red: 'border-l-red',
};

const AREA_TEXT: Record<AreaColor, string> = {
  blue: 'text-blue',
  green: 'text-green',
  amber: 'text-amber',
  red: 'text-red',
};

const AREA_BG_HOVER: Record<AreaColor, string> = {
  blue: 'hover:bg-blue/8',
  green: 'hover:bg-green/8',
  amber: 'hover:bg-amber/8',
  red: 'hover:bg-red/8',
};

const AREA_BG_ACTIVE: Record<AreaColor, string> = {
  blue: 'bg-blue/10',
  green: 'bg-green/10',
  amber: 'bg-amber/10',
  red: 'bg-red/10',
};

/* -------------------------------------------------------------------------- */
/*  Route paths for each nav item id                                          */
/* -------------------------------------------------------------------------- */

function idToPath(id: string): string {
  return `/${id}`;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, mobileMenuOpen, toggleSidebar, setMobileMenuOpen } = useUIStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  const currentPath = location.pathname;

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /* Close mobile menu on outside click */
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  /* ---------------------------------------------------------------------- */
  /*  Nav items renderer                                                     */
  /* ---------------------------------------------------------------------- */

  function renderNav() {
    return NAV_GROUPS.map((group) => {
      const isGeral = group.area === 'geral';

      return (
        <div key={group.area} className={isGeral ? '' : 'mt-4'}>
          {/* Group label (hidden when collapsed, hidden for "geral") */}
          {!isGeral && (
            <div
              className={`px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted ${
                sidebarCollapsed ? 'lg:px-0 lg:text-center lg:truncate' : ''
              }`}
            >
              {sidebarCollapsed ? '' : group.label}
            </div>
          )}

          {/* Items */}
          {group.items.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const path = idToPath(item.id);
            const isActive = currentPath === path || currentPath.startsWith(path + '/');
            const color = AREA_COLOR[item.area] ?? 'blue';

            return (
              <button
                key={item.id}
                onClick={() => navigate(path)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`
                  group flex items-center w-full rounded-lg text-sm font-medium
                  transition-colors duration-150 cursor-pointer
                  border-l-2
                  ${sidebarCollapsed ? 'px-0 justify-center lg:py-2.5 lg:mx-auto lg:w-10 lg:h-10 lg:rounded-lg' : 'gap-3 px-3 py-2'}
                  ${isActive
                    ? `${AREA_BORDER[color]} ${AREA_BG_ACTIVE[color]} ${AREA_TEXT[color]}`
                    : `border-l-transparent text-text-secondary ${AREA_BG_HOVER[color]} hover:text-text-primary`
                  }
                `}
              >
                {Icon && (
                  <span className={isActive ? AREA_TEXT[color] : 'text-text-muted group-hover:text-text-primary'}>
                    <Icon size={20} stroke={1.5} />
                  </span>
                )}
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      );
    });
  }

  /* ---------------------------------------------------------------------- */
  /*  Sidebar chrome                                                         */
  /* ---------------------------------------------------------------------- */

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center h-14 shrink-0 border-b border-border ${
          sidebarCollapsed ? 'lg:justify-center lg:px-0' : 'px-4'
        }`}
      >
        <span className="text-xl font-bold tracking-tight text-text-primary">
          ERP
          <span className="text-blue">View</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {renderNav()}
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="hidden lg:block shrink-0 border-t border-border p-2">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full gap-2 rounded-lg px-3 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <IconLayoutSidebarLeftExpand size={18} stroke={1.5} />
          ) : (
            <>
              <IconLayoutSidebarLeftCollapse size={18} stroke={1.5} />
              <span>Recolher</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      {/* ---- Desktop sidebar ---- */}
      <aside
        className={`
          hidden lg:flex flex-col shrink-0 h-full
          bg-bg-secondary border-r border-border
          transition-all duration-200
          ${sidebarCollapsed ? 'w-16' : 'w-60'}
        `}
      >
        {sidebarContent}
      </aside>

      {/* ---- Mobile overlay ---- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
      )}

      {/* ---- Mobile drawer ---- */}
      <div
        ref={drawerRef}
        className={`
          fixed inset-y-0 left-0 z-50 w-60
          bg-bg-secondary border-r border-border
          transform transition-transform duration-200 ease-in-out
          lg:hidden
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-3 right-3 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <IconX size={18} stroke={1.5} />
        </button>
        {sidebarContent}
      </div>
    </>
  );
}
