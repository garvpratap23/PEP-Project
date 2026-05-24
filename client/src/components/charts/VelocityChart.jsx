import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function VelocityChart({ data, isDark = true, height = 240 }) {
  if (!data?.weeklyVelocity) return null;

  const chartData = {
    labels: data.weeklyVelocity.map(w => w.week),
    datasets: [{
      label: 'Commits/Week',
      data: data.weeklyVelocity.map(w => w.commits),
      borderColor: '#3fb950',
      backgroundColor: 'rgba(63,185,80,0.08)',
      borderWidth: 2.5,
      pointBackgroundColor: '#3fb950',
      pointRadius: 4,
      pointHoverRadius: 7,
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
        bodyColor: '#3fb950',
        padding: 10,
        cornerRadius: 8,
        callbacks: { label: item => ` ${item.raw} commits` },
      },
    },
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(48,54,61,0.3)' : 'rgba(208,215,222,0.5)' },
        ticks: { color: isDark ? '#8b949e' : '#57606a', font: { size: 11 } },
      },
      y: {
        grid: { color: isDark ? 'rgba(48,54,61,0.3)' : 'rgba(208,215,222,0.5)' },
        ticks: { color: isDark ? '#8b949e' : '#57606a', font: { size: 11 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} id="velocity-chart" />
    </div>
  );
}
