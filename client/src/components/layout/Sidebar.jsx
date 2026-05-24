import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, GitCommitHorizontal, GitPullRequest, Star,
  Zap, Users, HeartPulse, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrg } from '../../context/OrgContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/commits', icon: GitCommitHorizontal, label: 'Commits' },
  { to: '/pull-requests', icon: GitPullRequest, label: 'Pull Requests' },
  { to: '/code-review', icon: Star, label: 'Code Review' },
  { to: '/velocity', icon: Zap, label: 'Team Velocity' },
  { to: '/contributors', icon: Users, label: 'Contributors' },
  { to: '/repo-health', icon: HeartPulse, label: 'Repo Health' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout, isDemoMode } = useAuth();
  const { selectedOrg, orgDetails } = useOrg();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📊</div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            GitAnalytics
            <span>Engineering Dashboard</span>
          </div>
        )}
        <button
          className="btn-icon"
          onClick={onToggle}
          style={{ marginLeft: 'auto', flexShrink: 0 }}
          id="sidebar-toggle-btn"
          data-tooltip={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Org indicator */}
      {!collapsed && selectedOrg && (
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {orgDetails?.avatarUrl && (
              <img src={orgDetails.avatarUrl} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />
            )}
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
              {orgDetails?.name || selectedOrg}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">{!collapsed && 'Analytics'}</div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            data-tooltip={collapsed ? label : undefined}
          >
            <Icon size={18} className="nav-icon" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <img
          src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&background=1f6feb&color=fff`}
          alt={user?.name}
          className="sidebar-avatar"
        />
        {!collapsed && (
          <>
            <div className="sidebar-user-info">
              <div className="sidebar-username">{user?.name || user?.username}</div>
              <div className="sidebar-user-role">
                {isDemoMode ? '🟡 Demo Mode' : `@${user?.username}`}
              </div>
            </div>
            <button
              className="btn-icon"
              onClick={handleLogout}
              id="logout-btn"
              data-tooltip="Sign out"
            >
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
