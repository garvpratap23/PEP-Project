import { useAnalytics } from '../hooks/useAnalytics';
import MetricCard from '../components/cards/MetricCard';
import { HeartPulse, AlertTriangle, CheckCircle2, GitPullRequest } from 'lucide-react';
import { getHealthColor } from '../utils/helpers';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { useOrg } from '../context/OrgContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function HealthRing({ score }) {
  const color = getHealthColor(score);
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="health-ring" style={{ width: 90, height: 90 }}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="var(--bg-tertiary)" strokeWidth="7" />
        <circle
          cx="45" cy="45" r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>
      <div className="health-ring-text" style={{ color, fontSize: 15 }}>{score}</div>
    </div>
  );
}

export default function RepoHealth() {
  const { data, loading } = useAnalytics('health');
  const { orgDetails } = useOrg();
  const repos = orgDetails?.repositories || [];

  const issueBarData = repos.length ? {
    labels: repos.slice(0, 6).map(r => r.name),
    datasets: [
      {
        label: 'Open Issues',
        data: repos.slice(0, 6).map(r => r.openIssues),
        backgroundColor: 'rgba(248,81,73,0.6)',
        borderColor: '#f85149',
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'Stars',
        data: repos.slice(0, 6).map(r => r.stars),
        backgroundColor: 'rgba(227,179,65,0.6)',
        borderColor: '#e3b341',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  } : null;

  return (
    <div className="fade-in" id="repo-health-page">
      {/* Top row: health score + metrics */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 240, flex: '0 0 auto' }}>
          <HealthRing score={data?.healthScore || 0} />
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Overall Health</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: getHealthColor(data?.healthScore || 0) }}>
              {data?.healthScore >= 80 ? 'Excellent' : data?.healthScore >= 60 ? 'Good' : 'Needs Attention'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Based on issues, PRs & activity
            </div>
          </div>
        </div>

        <div className="metrics-grid stagger" style={{ flex: 1, gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <MetricCard id="h-open-issues" icon={<AlertTriangle size={20} />} label="Open Issues" value={data?.openIssues || 0} color="orange" loading={loading} />
          <MetricCard id="h-closed-issues" icon={<CheckCircle2 size={20} />} label="Closed Issues" value={data?.closedIssues || 0} delta={10} color="green" loading={loading} />
          <MetricCard id="h-open-prs" icon={<GitPullRequest size={20} />} label="Open PRs" value={data?.openPRs || 0} color="blue" loading={loading} />
          <MetricCard id="h-stale-prs" icon={<HeartPulse size={20} />} label="Stale PRs (>7d)" value={data?.stalePRs || 0} color={data?.stalePRs > 5 ? 'orange' : 'green'} loading={loading} />
        </div>
      </div>

      {/* Issues bar chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">Repository Overview</div>
          <div className="card-subtitle">Open issues and stars per repository</div>
        </div>
        {issueBarData && (
          <div style={{ height: 260 }}>
            <Bar data={issueBarData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: {
                legend: { labels: { color: '#8b949e', font: { size: 11 }, boxWidth: 10 } },
                tooltip: { backgroundColor: '#1c2128', borderColor: '#30363d', borderWidth: 1, cornerRadius: 8 },
              },
              scales: {
                x: { grid: { display: false }, ticks: { color: '#8b949e', font: { size: 11 } } },
                y: { grid: { color: 'rgba(48,54,61,0.5)' }, ticks: { color: '#8b949e', font: { size: 11 } }, beginAtZero: true },
              },
            }} id="repo-health-bar-chart" />
          </div>
        )}
      </div>

      {/* Repo health cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }} className="stagger">
        {repos.slice(0, 6).map(repo => {
          const score = Math.max(0, Math.min(100, 100 - repo.openIssues * 3));
          return (
            <div key={repo.id} className="card" id={`repo-health-${repo.name}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{repo.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {repo.language && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: repo.language === 'TypeScript' ? '#3178c6' : repo.language === 'JavaScript' ? '#f1e05a' : '#8b949e',
                          display: 'inline-block',
                        }} />
                        {repo.language}
                      </span>
                    )}
                  </div>
                </div>
                <HealthRing score={score} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                {[
                  { label: 'Issues', value: repo.openIssues, color: repo.openIssues > 5 ? 'var(--accent-red)' : 'var(--accent-green)' },
                  { label: '⭐ Stars', value: repo.stars, color: 'var(--accent-yellow)' },
                  { label: 'Forks', value: repo.forks, color: 'var(--accent-blue)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius)', padding: '8px 4px' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
