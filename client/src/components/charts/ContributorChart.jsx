import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ContributorChart({ data, isDark = true, height = 220 }) {
  if (!data?.topContributors?.length) return null;

  const top5 = data.topContributors.slice(0, 5);
  const colors = ['#58a6ff', '#3fb950', '#bc8cff', '#f0883e', '#e3b341'];

  const chartData = {
    labels: top5.map(c => c.login),
    datasets: [{
      data: top5.map(c => c.totalCommits),
      backgroundColor: colors.map(c => `${c}cc`),
      borderColor: colors,
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDark ? '#8b949e' : '#57606a',
          font: { size: 11 },
          padding: 12,
          boxWidth: 10,
          borderRadius: 2,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1c2128' : '#fff',
        borderColor: isDark ? '#30363d' : '#d0d7de',
        borderWidth: 1,
        titleColor: isDark ? '#e6edf3' : '#1f2328',
        bodyColor: isDark ? '#8b949e' : '#57606a',
        padding: 10,
        cornerRadius: 8,
        callbacks: { label: item => ` ${item.label}: ${item.raw} commits` },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={options} id="contributor-chart" />
    </div>
  );
}
