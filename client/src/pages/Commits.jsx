import CommitTrendChart from '../components/charts/CommitTrendChart';
import ActivityHeatmap from '../components/charts/ActivityHeatmap';
import MetricCard from '../components/cards/MetricCard';
import { useAnalytics } from '../hooks/useAnalytics';
import { GitCommitHorizontal, TrendingUp, Calendar, Activity } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Commits() {
  const { data, loading } = useAnalytics('commits');

  const dayBarData = data?.daily ? {
    labels: data.daily.map(d => d.day),
    datasets: [{
      label: 'Avg Commits',
      data: data.daily.map(d => d.commits),
      backgroundColor: '#58a6ff99',
      borderColor: '#58a6ff',
      borderWidth: 1.5,
      borderRadius: 5,
    }],
  } : null;

  return (
    <div className="fade-in" id="commits-page">
      <div className="metrics-grid stagger" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <MetricCard id="c-total" icon={<GitCommitHorizontal size={20} />} label="Total Commits (12wk)" value={formatNumber(data?.total || 0)} color="blue" loading={loading} />
        <MetricCard id="c-avg-week" icon={<TrendingUp size={20} />} label="Avg per Week" value={data?.weekly ? Math.round(data.weekly.reduce((s, w) => s + w.commits, 0) / data.weekly.length) : '—'} color="green" loading={loading} />
        <MetricCard id="c-peak" icon={<Activity size={20} />} label="Peak Week" value={data?.weekly ? Math.max(...data.weekly.map(w => w.commits)) : '—'} color="purple" loading={loading} />
        <MetricCard id="c-active-days" icon={<Calendar size={20} />} label="Active Days" value={data?.daily ? data.daily.filter(d => d.commits > 0).length : '—'} color="orange" loading={loading} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Weekly Commit Trend</div>
            <div className="card-subtitle">Commit velocity over the last 12 weeks</div>
          </div>
        </div>
        <CommitTrendChart data={data} height={280} />
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Day-of-Week Breakdown</div>
            <div className="card-subtitle">Average commits by day</div>
          </div>
          {dayBarData && (
            <div style={{ height: 220 }}>
              <Bar data={dayBarData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1c2128', borderColor: '#30363d', borderWidth: 1, cornerRadius: 8 } },
                scales: {
                  x: { grid: { display: false }, ticks: { color: '#8b949e', font: { size: 11 } } },
                  y: { grid: { color: 'rgba(48,54,61,0.5)' }, ticks: { color: '#8b949e', font: { size: 11 } }, beginAtZero: true },
                },
              }} id="day-of-week-chart" />
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Activity Heatmap</div>
            <div className="card-subtitle">Contributions over the past year</div>
          </div>
          <ActivityHeatmap data={data?.heatmap} />
        </div>
      </div>
    </div>
  );
}
