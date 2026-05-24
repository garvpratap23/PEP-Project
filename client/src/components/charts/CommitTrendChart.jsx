import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function CommitTrendChart({ data, isDark = true, height = 240 }) {
  if (!data?.weekly) return null;

  const chartData = {
    labels: data.weekly.map(w => w.week),
    datasets: [{
      label: 'Commits',
      data: data.weekly.map(w => w.commits),
      borderColor: '#58a6ff',
      backgroundColor: 'rgba(88,166,255,0.08)',
      borderWidth: 2,
      pointBackgroundColor: '#58a6ff',
      pointRadius: 3,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1c2128' : '#fff',
        borderColor: isDark ? '#30363d' : '#d0d7de',
        borderWidth: 1,
        titleColor: isDark ? '#e6edf3' : '#1f2328',
        bodyColor: '#58a6ff',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          title: items => `Week of ${items[0].label}`,
          label: item => ` ${item.raw} commits`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(48,54,61,0.5)' : 'rgba(208,215,222,0.5)' },
        ticks: { color: isDark ? '#8b949e' : '#57606a', font: { size: 11 } },
      },
      y: {
        grid: { color: isDark ? 'rgba(48,54,61,0.5)' : 'rgba(208,215,222,0.5)' },
        ticks: { color: isDark ? '#8b949e' : '#57606a', font: { size: 11 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} id="commit-trend-chart" />
    </div>
  );
}
