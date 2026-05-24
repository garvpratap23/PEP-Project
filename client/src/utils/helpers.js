import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try { return format(parseISO(dateStr), 'MMM d, yyyy'); } catch { return dateStr; }
};

export const formatRelative = (dateStr) => {
  if (!dateStr) return '—';
  try { return formatDistanceToNow(parseISO(dateStr), { addSuffix: true }); } catch { return dateStr; }
};

export const formatHours = (hours) => {
  if (!hours && hours !== 0) return '—';
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
};

export const formatNumber = (n) => {
  if (n === undefined || n === null) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
};

export const getPRStateColor = (state) => ({
  open: 'badge-blue',
  merged: 'badge-purple',
  closed: 'badge-red',
}[state] || 'badge-blue');

export const getHealthColor = (score) => {
  if (score >= 80) return '#3fb950';
  if (score >= 60) return '#e3b341';
  return '#f85149';
};

export const getLanguageColor = (lang) => ({
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  'React': '#61dafb',
  'React Native': '#61dafb',
  'Node.js': '#68a063',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  CSS: '#563d7c',
  HTML: '#e34c26',
}[lang] || '#8b949e');

// Chart.js default options
export const defaultChartOptions = (isDark = true) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: isDark ? '#8b949e' : '#57606a', font: { family: 'Inter', size: 12 } },
    },
    tooltip: {
      backgroundColor: isDark ? '#1c2128' : '#ffffff',
      borderColor: isDark ? '#30363d' : '#d0d7de',
      borderWidth: 1,
      titleColor: isDark ? '#e6edf3' : '#1f2328',
      bodyColor: isDark ? '#8b949e' : '#57606a',
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { color: isDark ? 'rgba(48,54,61,0.5)' : 'rgba(208,215,222,0.5)' },
      ticks: { color: isDark ? '#8b949e' : '#57606a', font: { family: 'Inter', size: 11 } },
    },
    y: {
      grid: { color: isDark ? 'rgba(48,54,61,0.5)' : 'rgba(208,215,222,0.5)' },
      ticks: { color: isDark ? '#8b949e' : '#57606a', font: { family: 'Inter', size: 11 } },
    },
  },
});
