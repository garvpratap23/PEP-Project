import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MetricCard({
  id,
  icon,
  label,
  value,
  delta,
  deltaLabel = 'vs last period',
  color = 'blue',
  loading = false,
}) {
  const gradients = {
    blue: 'var(--gradient-blue)',
    green: 'var(--gradient-green)',
    purple: 'var(--gradient-purple)',
    orange: 'var(--gradient-orange)',
  };

  const iconBg = {
    blue: 'rgba(88,166,255,0.12)',
    green: 'rgba(63,185,80,0.12)',
    purple: 'rgba(188,140,255,0.12)',
    orange: 'rgba(240,136,62,0.12)',
  };

  const deltaSign = delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral';

  if (loading) {
    return (
      <div className="metric-card" style={{ '--accent-gradient': gradients[color] }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ height: 14, width: '60%', background: 'var(--bg-tertiary)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: 32, width: '40%', background: 'var(--bg-tertiary)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: 12, width: '50%', background: 'var(--bg-tertiary)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="metric-card fade-in"
      id={id}
      style={{ '--accent-gradient': gradients[color] }}
    >
      <div className="metric-card-header">
        <div className="metric-icon" style={{ background: iconBg[color], color: `var(--accent-${color})` }}>
          {icon}
        </div>
        {delta !== undefined && (
          <span className={`metric-delta ${deltaSign}`}>
            {deltaSign === 'positive' ? <TrendingUp size={11} /> : deltaSign === 'negative' ? <TrendingDown size={11} /> : <Minus size={11} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div>
        <div className="metric-value">{value}</div>
        <div className="metric-label">{label}</div>
      </div>
      {deltaLabel && delta !== undefined && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{deltaLabel}</div>
      )}
    </div>
  );
}
