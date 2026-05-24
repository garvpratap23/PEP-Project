import { useAnalytics } from '../hooks/useAnalytics';
import MetricCard from '../components/cards/MetricCard';
import VelocityChart from '../components/charts/VelocityChart';
import ContributorChart from '../components/charts/ContributorChart';
import { Zap, GitCommitHorizontal, Users, TrendingUp } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

export default function Velocity() {
  const { data, loading } = useAnalytics('velocity');

  const totalCommits = data?.topContributors?.reduce((s, c) => s + c.totalCommits, 0) || 0;
  const avgPerContributor = data?.topContributors?.length
    ? Math.round(totalCommits / data.topContributors.length)
    : 0;
  const peakWeek = data?.weeklyVelocity?.length
    ? Math.max(...data.weeklyVelocity.map(w => w.commits))
    : 0;

  return (
    <div className="fade-in" id="velocity-page">
      <div className="metrics-grid stagger" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <MetricCard id="vel-total" icon={<GitCommitHorizontal size={20} />} label="Total Commits" value={formatNumber(totalCommits)} delta={14} color="green" loading={loading} />
        <MetricCard id="vel-contributors" icon={<Users size={20} />} label="Active Contributors" value={data?.topContributors?.length || 0} color="blue" loading={loading} />
        <MetricCard id="vel-avg" icon={<Zap size={20} />} label="Avg per Contributor" value={formatNumber(avgPerContributor)} color="purple" loading={loading} />
        <MetricCard id="vel-peak" icon={<TrendingUp size={20} />} label="Peak Week" value={peakWeek} delta={18} color="orange" loading={loading} />
      </div>

      <div className="charts-grid" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Weekly Velocity</div>
            <div className="card-subtitle">Team commit velocity over the last 8 weeks</div>
          </div>
          <VelocityChart data={data} height={260} />
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Contributor Share</div>
            <div className="card-subtitle">Commit distribution among top contributors</div>
          </div>
          <ContributorChart data={data} height={260} />
        </div>
      </div>

      {/* Contributor productivity table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Contributor Productivity</div>
          <span className="badge badge-green">{data?.topContributors?.length || 0} contributors</span>
        </div>
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <table className="data-table" id="velocity-contributors-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Contributor</th>
                <th>Total Commits</th>
                <th>Weeks Active</th>
                <th>Avg/Active Week</th>
                <th>Productivity</th>
              </tr>
            </thead>
            <tbody>
              {(data?.topContributors || []).map((c, i) => {
                const avgPerWeek = c.weeksActive > 0 ? Math.round(c.totalCommits / c.weeksActive) : 0;
                const pct = totalCommits > 0 ? (c.totalCommits / totalCommits) * 100 : 0;
                return (
                  <tr key={c.login}>
                    <td>
                      <div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}>{i + 1}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img
                          src={c.avatarUrl || `https://github.com/${c.login}.png?size=32`}
                          className="avatar"
                          alt={c.login}
                          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${c.login}&size=32&background=1f6feb&color=fff`; }}
                        />
                        <span style={{ fontWeight: 600 }}>{c.login}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{formatNumber(c.totalCommits)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.weeksActive} wks</td>
                    <td style={{ fontWeight: 600 }}>{avgPerWeek}/wk</td>
                    <td style={{ width: 160 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)', minWidth: 36 }}>{pct.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
