// Comprehensive mock data for demo mode — mirrors real GitHub API shapes
export const DEMO_USER = {
  _id: 'demo-user',
  name: 'Garv Pratap',
  username: 'garvpratap23',
  email: 'garv@example.com',
  avatarUrl: 'https://avatars.githubusercontent.com/u/garvpratap23',
};

export const DEMO_ORG = {
  login: 'PEP-Project',
  name: 'PEP Engineering',
  description: 'Building the future of developer productivity analytics',
  avatarUrl: 'https://avatars.githubusercontent.com/u/garvpratap23',
  publicRepos: 12,
  repositories: [
    { id: 1, name: 'analytics-core', fullName: 'PEP-Project/analytics-core', language: 'TypeScript', stars: 87, forks: 12, openIssues: 4, updatedAt: '2026-05-20T10:00:00Z' },
    { id: 2, name: 'dashboard-ui', fullName: 'PEP-Project/dashboard-ui', language: 'React', stars: 54, forks: 8, openIssues: 2, updatedAt: '2026-05-22T14:00:00Z' },
    { id: 3, name: 'api-gateway', fullName: 'PEP-Project/api-gateway', language: 'Node.js', stars: 31, forks: 5, openIssues: 7, updatedAt: '2026-05-18T09:00:00Z' },
    { id: 4, name: 'data-pipeline', fullName: 'PEP-Project/data-pipeline', language: 'Python', stars: 22, forks: 3, openIssues: 1, updatedAt: '2026-05-15T16:00:00Z' },
    { id: 5, name: 'mobile-app', fullName: 'PEP-Project/mobile-app', language: 'React Native', stars: 18, forks: 2, openIssues: 5, updatedAt: '2026-05-10T11:00:00Z' },
  ],
};

const weeksLabels = ['Apr 14', 'Apr 21', 'Apr 28', 'May 5', 'May 12', 'May 19', 'May 26', 'Jun 2', 'Jun 9', 'Jun 16', 'Jun 23', 'Jun 30'];

export const DEMO_COMMITS = {
  total: 847,
  weekly: weeksLabels.map((week, i) => ({
    week,
    commits: [23, 45, 38, 62, 57, 71, 48, 83, 69, 55, 92, 76][i],
  })),
  daily: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => ({
    day,
    commits: { Sun: 4, Mon: 28, Tue: 42, Wed: 38, Thu: 45, Fri: 35, Sat: 12 }[day],
  })),
};

export const DEMO_PRS = {
  total: 312,
  open: 23,
  merged: 289,
  avgCycleTimeHours: 18.4,
  stalePRs: 6,
  byWeek: weeksLabels.slice(-8).map((week, i) => ({
    week,
    count: [8, 12, 7, 15, 11, 18, 9, 14][i],
  })),
  recentPRs: [
    { number: 247, title: 'feat: Add real-time dashboard updates', state: 'merged', author: 'garvpratap23', createdAt: '2026-05-20T09:00:00Z', mergedAt: '2026-05-21T14:00:00Z', cycleHours: 29 },
    { number: 246, title: 'fix: Resolve chart rendering on mobile', state: 'merged', author: 'alice-dev', createdAt: '2026-05-19T10:00:00Z', mergedAt: '2026-05-19T16:00:00Z', cycleHours: 6 },
    { number: 245, title: 'chore: Update dependencies to latest', state: 'open', author: 'bob-eng', createdAt: '2026-05-18T11:00:00Z', mergedAt: null, cycleHours: null },
    { number: 244, title: 'feat: Contributor leaderboard with rankings', state: 'merged', author: 'carol-code', createdAt: '2026-05-17T08:00:00Z', mergedAt: '2026-05-18T09:00:00Z', cycleHours: 25 },
    { number: 243, title: 'docs: Update API documentation', state: 'open', author: 'dave-tech', createdAt: '2026-05-10T14:00:00Z', mergedAt: null, cycleHours: null },
    { number: 242, title: 'perf: Optimize MongoDB aggregation queries', state: 'merged', author: 'garvpratap23', createdAt: '2026-05-16T12:00:00Z', mergedAt: '2026-05-17T08:00:00Z', cycleHours: 20 },
  ],
};

export const DEMO_REVIEWS = {
  totalReviews: 218,
  reviewers: [
    { login: 'garvpratap23', reviews: 74, approved: 58, approvalRate: 78 },
    { login: 'alice-dev', reviews: 62, approved: 51, approvalRate: 82 },
    { login: 'bob-eng', reviews: 41, approved: 35, approvalRate: 85 },
    { login: 'carol-code', reviews: 28, approved: 22, approvalRate: 79 },
    { login: 'dave-tech', reviews: 13, approved: 9, approvalRate: 69 },
  ],
};

export const DEMO_VELOCITY = {
  topContributors: [
    { login: 'garvpratap23', avatarUrl: 'https://avatars.githubusercontent.com/u/garvpratap23', totalCommits: 234, weeksActive: 22 },
    { login: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/48?img=1', totalCommits: 187, weeksActive: 20 },
    { login: 'bob-eng', avatarUrl: 'https://i.pravatar.cc/48?img=2', totalCommits: 142, weeksActive: 18 },
    { login: 'carol-code', avatarUrl: 'https://i.pravatar.cc/48?img=3', totalCommits: 98, weeksActive: 15 },
    { login: 'dave-tech', avatarUrl: 'https://i.pravatar.cc/48?img=4', totalCommits: 76, weeksActive: 12 },
    { login: 'eve-coder', avatarUrl: 'https://i.pravatar.cc/48?img=5', totalCommits: 54, weeksActive: 10 },
    { login: 'frank-dev', avatarUrl: 'https://i.pravatar.cc/48?img=6', totalCommits: 31, weeksActive: 7 },
    { login: 'grace-eng', avatarUrl: 'https://i.pravatar.cc/48?img=7', totalCommits: 25, weeksActive: 5 },
  ],
  weeklyVelocity: weeksLabels.slice(-8).map((week, i) => ({
    week,
    commits: [45, 62, 38, 71, 55, 83, 67, 91][i],
  })),
};

export const DEMO_HEALTH = {
  openIssues: 19,
  closedIssues: 134,
  openPRs: 23,
  stalePRs: 6,
  healthScore: 74,
};

// Generate heatmap data (52 weeks × 7 days)
export const generateHeatmapData = () => {
  const data = [];
  for (let week = 0; week < 52; week++) {
    for (let day = 0; day < 7; day++) {
      const rand = Math.random();
      data.push({
        week, day,
        count: rand < 0.35 ? 0 : rand < 0.55 ? 1 : rand < 0.72 ? 2 : rand < 0.87 ? 3 : 4,
      });
    }
  }
  return data;
};
