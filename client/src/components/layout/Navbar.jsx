import { Sun, Moon, RefreshCw, ChevronDown } from 'lucide-react';
import { useOrg } from '../../context/OrgContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ isDark, onToggleTheme, sidebarCollapsed, pageTitle, pageSubtitle }) {
  const { orgs, selectedOrg, setSelectedOrg, orgDetails, refreshOrg, loading } = useOrg();
  const { isDemoMode } = useAuth();

  return (
    <header className={`navbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} id="main-navbar">
      <div className="navbar-left">
        <div>
          <div className="navbar-title">{pageTitle}</div>
          {pageSubtitle && <div className="navbar-subtitle">{pageSubtitle}</div>}
        </div>
      </div>

      <div className="navbar-right">
        {/* Demo badge */}
        {isDemoMode && (
          <span className="badge badge-orange" style={{ fontSize: 11 }}>
            🎭 Demo Mode
          </span>
        )}

        {/* Org selector */}
        {orgs.length > 0 && (
          <div className="org-badge" id="org-selector">
            {orgDetails?.avatarUrl && (
              <img src={orgDetails.avatarUrl} alt="" />
            )}
            <select
              className="select"
              style={{ border: 'none', background: 'transparent', padding: '0', color: 'var(--text-primary)', fontWeight: 600 }}
              value={selectedOrg || ''}
              onChange={e => setSelectedOrg(e.target.value)}
              id="org-select-dropdown"
            >
              {orgs.map(org => (
                <option key={org.login || org._id} value={org.login}>
                  {org.login}
                </option>
              ))}
            </select>
            <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
          </div>
        )}

        {/* Refresh */}
        <button
          className="btn-icon"
          onClick={refreshOrg}
          disabled={loading}
          id="refresh-btn"
          data-tooltip="Refresh data"
          style={{ opacity: loading ? 0.5 : 1 }}
        >
          <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
        </button>

        {/* Theme toggle */}
        <button
          className="btn-icon"
          onClick={onToggleTheme}
          id="theme-toggle-btn"
          data-tooltip={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
