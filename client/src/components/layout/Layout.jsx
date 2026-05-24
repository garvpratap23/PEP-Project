import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useOrg } from '../../context/OrgContext';
import { RefreshCw } from 'lucide-react';

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
  const { orgDetails, loading: orgLoading, refreshOrg } = useOrg();

  const { title, subtitle } = PAGE_TITLES[location.pathname] || { title: 'Dashboard' };

  const hasNoRepos = !orgLoading && orgDetails && (!orgDetails.repositories || orgDetails.repositories.length === 0);

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
          {hasNoRepos ? (
            <div className="card fade-in" style={{ maxWidth: 600, margin: '60px auto', padding: '40px 30px', textAlign: 'center', borderRadius: 16 }}>
              <div style={{ fontSize: 50, marginBottom: 20 }}>📁</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>No Repositories Found</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: '1.6', marginBottom: 24 }}>
                We couldn't find any repositories in the selected organization/account (<strong>{orgDetails?.login || 'N/A'}</strong>).
                To get started, please make sure you have at least one repository on GitHub under this account/organization, or select a different account from the dropdown.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button
                  onClick={refreshOrg}
                  className="btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  <RefreshCw size={14} className={orgLoading ? 'spin' : ''} style={{ animation: orgLoading ? 'spin 1s linear infinite' : 'none' }} />
                  Refresh Repositories
                </button>
                <a
                  href="https://github.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    background: '#1f6feb',
                    color: '#fff',
                    borderRadius: 8,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Create Repository on GitHub
                </a>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}
