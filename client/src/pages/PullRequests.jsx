import { useAnalytics } from '../hooks/useAnalytics';
import MetricCard from '../components/cards/MetricCard';
import PRCycleChart from '../components/charts/PRCycleChart';
import { GitPullRequest, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatNumber, formatHours, formatRelative, getPRStateColor } from '../utils/helpers';

export default function PullRequests() {
  const { data, loading } = useAnalytics('prs');

  return (
    <div className="fade-in" id="prs-page">
      <div className="metrics-grid stagger" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <MetricCard id="pr-total" icon={<GitPullRequest size={20} />} label="Total PRs" value={formatNumber(data?.total || 0)} delta={6} color="blue" loading={loading} />
        <MetricCard id="pr-open" icon={<GitPullRequest size={20} />} label="Open PRs" value={data?.open || 0} color="purple" loading={loading} />
        <MetricCard id="pr-merged" icon={<CheckCircle2 size={20} />} label="Merged PRs" value={formatNumber(data?.merged || 0)} delta={12} color="green" loading={loading} />
        <MetricCard id="pr-cycle" icon={<Clock size={20} />} label="Avg Cycle Time" value={formatHours(data?.avgCycleTimeHours)} delta={-15} color="orange" loading={loading} />
      </div>

      <div className="charts-grid-3">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Weekly Merge Rate</div>
            <div className="card-subtitle">Pull requests merged per week</div>
          </div>
          <PRCycleChart data={data} height={260} />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">PR Status</div>
            </div>
            {data?.stalePRs > 0 && (
              <span className="badge badge-orange" style={{ gap: 5, display: 'flex', alignItems: 'center' }}>
                <AlertTriangle size={11} /> {data.stalePRs} stale
              </span>
            )}
          </div>

          {/* Status bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
            {[
              { label: 'Merged', value: data?.merged || 0, total: data?.total || 1, color: '#bc8cff' },
              { label: 'Open', value: data?.open || 0, total: data?.total || 1, color: '#58a6ff' },
              { label: 'Stale (>7d)', value: data?.stalePRs || 0, total: data?.open || 1, color: '#f0883e' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{formatNumber(item.value)}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min((item.value / item.total) * 100, 100)}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent PRs table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Pull Requests</div>
          <span className="badge badge-blue">{data?.recentPRs?.length || 0} shown</span>
        </div>
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <table className="data-table" id="prs-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Cycle Time</th>
                <th>Opened</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentPRs || []).map(pr => (
                <tr key={pr.number}>
                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 12 }}>#{pr.number}</td>
                  <td style={{ maxWidth: 280 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pr.title}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <img
                        src={`https://github.com/${pr.author}.png?size=24`}
                        className="avatar avatar-sm"
                        alt={pr.author}
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${pr.author}&size=24&background=1f6feb&color=fff`; }}
                      />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{pr.author}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${getPRStateColor(pr.state)}`}>{pr.state}</span></td>
                  <td style={{ fontSize: 12 }}>{formatHours(pr.cycleHours)}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatRelative(pr.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
