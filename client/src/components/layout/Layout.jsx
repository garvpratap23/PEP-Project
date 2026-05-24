import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useDarkMode } from '../../hooks/useDarkMode';

const PAGE_TITLES = {
  '/dashboard': { title: 'Overview Dashboard', subtitle: 'Organization-wide engineering metrics' },
  '/commits': { title: 'Commit Analytics', subtitle: 'Commit trends and activity patterns' },
  '/pull-requests': { title: 'Pull Requests', subtitle: 'PR lifecycle and cycle time analysis' },
  '/code-review': { title: 'Code Review', subtitle: 'Review statistics and collaboration metrics' },
  '/velocity': { title: 'Team Velocity', subtitle: 'Development throughput and delivery speed' },
  '/contributors': { title: 'Contributors', subtitle: 'Individual contributor insights and rankings' },
  '/repo-health': { title: 'Repository Health', subtitle: 'Repository maintenance and health monitoring' },
};

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDark, toggleTheme] = useDarkMode();
  const location = useLocation();

  const { title, subtitle } = PAGE_TITLES[location.pathname] || { title: 'Dashboard' };

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar
          isDark={isDark}
          onToggleTheme={toggleTheme}
          sidebarCollapsed={sidebarCollapsed}
          pageTitle={title}
          pageSubtitle={subtitle}
        />
        <div className="page-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
