import { useAnalytics } from '../hooks/useAnalytics';
import { GitCommitHorizontal, Star, Activity } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

export default function Contributors() {
  const { data, loading } = useAnalytics('velocity');
  const { data: reviews } = useAnalytics('reviews');
  const { data: prs } = useAnalytics('prs');

  const contributors = data?.topContributors || [];
  const totalCommits = contributors.reduce((s, c) => s + c.totalCommits, 0);

  const getReviewCount = (login) => {
    return reviews?.reviewers?.find(r => r.login === login)?.reviews || 0;
  };

  return (
    <div className="fade-in" id="contributors-page">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }} className="stagger">
        {loading
          ? Array(6).fill(0).map((_, i) => (
              <div key={i} className="card" style={{ height: 160, animation: 'pulse 1.5s infinite' }} />
            ))
          : contributors.map((c, i) => {
              const pct = totalCommits > 0 ? ((c.totalCommits / totalCommits) * 100).toFixed(1) : 0;
              const reviewCount = getReviewCount(c.login);

              return (
                <div key={c.login} className="card" id={`contributor-card-${c.login}`}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={c.avatarUrl || `https://github.com/${c.login}.png?size=64`}
                        className="avatar avatar-xl"
                        alt={c.login}
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${c.login}&size=64&background=1f6feb&color=fff`; }}
                      />
                      <div
                        className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}
                        style={{ position: 'absolute', bottom: -4, right: -4 }}
                      >
                        {i + 1}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{c.login}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {c.weeksActive} weeks active
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, textAlign: 'center' }}>
                    {[
                      { icon: <GitCommitHorizontal size={14} />, value: formatNumber(c.totalCommits), label: 'Commits', color: 'var(--accent-blue)' },
                      { icon: <Star size={14} />, value: reviewCount, label: 'Reviews', color: 'var(--accent-purple)' },
                      { icon: <Activity size={14} />, value: `${pct}%`, label: 'Share', color: 'var(--accent-green)' },
                    ].map(stat => (
                      <div key={stat.label} style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius)',
                        padding: '10px 6px',
                      }}>
                        <div style={{ color: stat.color, marginBottom: 2 }}>{stat.icon}</div>
                        <div style={{ fontSize: 16, fontWeight: 800 }}>{stat.value}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Commit share bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 5 }}>
                      <span>Commit share</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
