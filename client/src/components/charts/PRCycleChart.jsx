import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PRCycleChart({ data, isDark = true, height = 240 }) {
  if (!data?.byWeek) return null;

  const chartData = {
    labels: data.byWeek.map(w => w.week),
    datasets: [{
      label: 'PRs Merged',
      data: data.byWeek.map(w => w.count),
      backgroundColor: 'rgba(188,140,255,0.7)',
      borderColor: '#bc8cff',
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
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
        bodyColor: '#bc8cff',
        padding: 10,
        cornerRadius: 8,
        callbacks: { label: item => ` ${item.raw} PRs merged` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
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
      <Bar data={chartData} options={options} id="pr-cycle-chart" />
    </div>
  );
}
