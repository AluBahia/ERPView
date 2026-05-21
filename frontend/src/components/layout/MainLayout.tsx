import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '../../store/uiStore';

export function MainLayout() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header />

        {/* Scrollable content */}
        <main
          className={`flex-1 overflow-y-auto p-5 transition-all duration-200 ${
            sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
