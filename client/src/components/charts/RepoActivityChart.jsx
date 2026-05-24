import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RepoActivityChart({ repos = [], isDark = true, height = 220 }) {
  if (!repos.length) return null;

  const colors = [
    '#58a6ff', '#3fb950', '#bc8cff', '#f0883e', '#e3b341',
    '#f85149', '#39d353', '#a371f7',
  ];

  // Activity score: stars + forks * 2 + (1/openIssues or 10)
  const scores = repos.slice(0, 6).map(r => ({
    name: r.name,
    score: r.stars + r.forks * 2 + (r.openIssues ? 100 / r.openIssues : 10),
  }));

  const chartData = {
    labels: scores.map(s => s.name),
    datasets: [{
      data: scores.map(s => Math.round(s.score)),
      backgroundColor: colors.slice(0, scores.length).map(c => `${c}bb`),
      borderColor: isDark ? '#1c2128' : '#fff',
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
      },
    },
  };

  return (
    <div style={{ height }}>
      <Pie data={chartData} options={options} id="repo-activity-chart" />
    </div>
  );
}
