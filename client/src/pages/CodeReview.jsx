import { useAnalytics } from '../hooks/useAnalytics';
import MetricCard from '../components/cards/MetricCard';
import { Star, Users, CheckCircle2, Clock } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CodeReview() {
  const { data, loading } = useAnalytics('reviews');

  const reviewerBarData = data?.reviewers ? {
    labels: data.reviewers.map(r => r.login),
    datasets: [
      {
        label: 'Total Reviews',
        data: data.reviewers.map(r => r.reviews),
        backgroundColor: 'rgba(88,166,255,0.6)',
        borderColor: '#58a6ff',
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'Approvals',
        data: data.reviewers.map(r => r.approved),
        backgroundColor: 'rgba(63,185,80,0.6)',
        borderColor: '#3fb950',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  } : null;

  const avgApprovalRate = data?.reviewers?.length
    ? Math.round(data.reviewers.reduce((s, r) => s + r.approvalRate, 0) / data.reviewers.length)
    : 0;

  return (
    <div className="fade-in" id="code-review-page">
      <div className="metrics-grid stagger" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <MetricCard id="rv-total" icon={<Star size={20} />} label="Total Reviews" value={formatNumber(data?.totalReviews || 0)} delta={8} color="blue" loading={loading} />
        <MetricCard id="rv-reviewers" icon={<Users size={20} />} label="Active Reviewers" value={data?.reviewers?.length || 0} color="purple" loading={loading} />
        <MetricCard id="rv-approval" icon={<CheckCircle2 size={20} />} label="Avg Approval Rate" value={`${avgApprovalRate}%`} delta={3} color="green" loading={loading} />
        <MetricCard id="rv-top-reviews" icon={<Clock size={20} />} label="Top Reviewer Reviews" value={data?.reviewers?.[0]?.reviews || 0} color="orange" loading={loading} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">Reviews by Contributor</div>
          <div className="card-subtitle">Total reviews vs approvals per reviewer</div>
        </div>
        {reviewerBarData && (
          <div style={{ height: 260 }}>
            <Bar data={reviewerBarData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: {
                legend: { labels: { color: '#8b949e', font: { size: 11 }, boxWidth: 10 } },
                tooltip: { backgroundColor: '#1c2128', borderColor: '#30363d', borderWidth: 1, cornerRadius: 8 },
              },
              scales: {
                x: { grid: { display: false }, ticks: { color: '#8b949e', font: { size: 11 } } },
                y: { grid: { color: 'rgba(48,54,61,0.5)' }, ticks: { color: '#8b949e', font: { size: 11 } }, beginAtZero: true },
              },
            }} id="reviewer-bar-chart" />
          </div>
        )}
      </div>

      {/* Reviewers table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Reviewer Leaderboard</div>
        </div>
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <table className="data-table" id="reviewers-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Reviewer</th>
                <th>Total Reviews</th>
                <th>Approvals</th>
                <th>Approval Rate</th>
              </tr>
            </thead>
            <tbody>
              {(data?.reviewers || []).map((r, i) => (
                <tr key={r.login}>
                  <td>
                    <div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}>
                      {i + 1}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img
                        src={`https://github.com/${r.login}.png?size=32`}
                        className="avatar avatar-sm"
                        alt={r.login}
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${r.login}&size=32&background=1f6feb&color=fff`; }}
                      />
                      <span style={{ fontWeight: 600 }}>{r.login}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{r.reviews}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-green)' }}>{r.approved}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-bar" style={{ flex: 1, maxWidth: 100 }}>
                        <div className="progress-fill" style={{
                          width: `${r.approvalRate}%`,
                          background: r.approvalRate >= 80 ? '#3fb950' : r.approvalRate >= 60 ? '#e3b341' : '#f85149',
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, minWidth: 36 }}>{r.approvalRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
