import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GitBranch, BarChart3, Users, Zap, Shield, CheckCircle } from 'lucide-react';

const features = [
  { icon: <BarChart3 size={16} />, text: 'Real-time commit trend analytics' },
  { icon: <GitBranch size={16} />, text: 'PR cycle time & review statistics' },
  { icon: <Users size={16} />, text: 'Contributor insights & leaderboards' },
  { icon: <Zap size={16} />, text: 'Team velocity & delivery metrics' },
  { icon: <Shield size={16} />, text: 'Repository health monitoring' },
  { icon: <CheckCircle size={16} />, text: 'GitHub OAuth secure authentication' },
];

export default function Login() {
  const { enterDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleDemo = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="login-page" id="login-page">
      <div className="login-bg-grid" />
      <div className="login-bg-glow login-bg-glow-1" />
      <div className="login-bg-glow login-bg-glow-2" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">📊</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>GitAnalytics</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>by PEP Engineering</div>
          </div>
        </div>

        <h1 className="login-title">Engineering Intelligence</h1>
        <p className="login-subtitle">
          Connect your GitHub organization and unlock powerful insights
          into your team's productivity, collaboration, and code health.
        </p>

        {/* GitHub OAuth Button */}
        <a
          href="/auth/github"
          className="login-github-btn"
          id="github-login-btn"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continue with GitHub
        </a>

        <div className="login-divider">or explore with demo data</div>

        {/* Demo Button */}
        <button
          className="login-demo-btn"
          onClick={handleDemo}
          id="demo-mode-btn"
        >
          🎭 Try Demo Mode — No Login Required
        </button>

        {/* Features */}
        <div className="login-features">
          {features.map((f, i) => (
            <div key={i} className="login-feature">
              <span className="login-feature-icon">{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
