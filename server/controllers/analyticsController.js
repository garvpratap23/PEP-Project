const GitHubService = require('../services/githubService');

// Helper: compute PR cycle time in hours
const calcCycleTime = (pr) => {
  if (!pr.merged_at) return null;
  return (new Date(pr.merged_at) - new Date(pr.created_at)) / (1000 * 60 * 60);
};

// Helper: group commits into weekly buckets (last N weeks)
const groupCommitsByWeek = (commits, numWeeks = 12) => {
  const now = Date.now();
  const weeks = [];

  for (let i = numWeeks - 1; i >= 0; i--) {
    const weekStart = new Date(now - i * 7 * 24 * 60 * 60 * 1000);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    weeks.push({
      label: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      start: weekStart,
      end: weekEnd,
      commits: 0,
    });
  }

  commits.forEach(c => {
    const date = new Date(c.commit?.author?.date || c.commit?.committer?.date);
    if (!date) return;
    for (const week of weeks) {
      if (date >= week.start && date < week.end) {
        week.commits++;
        break;
      }
    }
  });

  return weeks.map(w => ({ week: w.label, commits: w.commits }));
};

// Helper: day of week breakdown from commits
const groupByDayOfWeek = (commits) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts = [0, 0, 0, 0, 0, 0, 0];
  commits.forEach(c => {
    const date = new Date(c.commit?.author?.date || c.commit?.committer?.date);
    if (!date) return;
    counts[date.getDay()]++;
  });
  return days.map((day, i) => ({ day, commits: counts[i] }));
};

// Helper: generate 52-week heatmap data
const buildHeatmapData = (commits) => {
  const cells = [];
  const now = new Date();
  now.setHours(0,0,0,0);
  
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  
  const startOfHeatmap = new Date(currentWeekStart);
  startOfHeatmap.setDate(startOfHeatmap.getDate() - 51 * 7);

  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      cells.push({ week: w, day: d, count: 0 });
    }
  }

  commits.forEach(c => {
    const d = new Date(c.commit?.author?.date || c.commit?.committer?.date);
    if (!d || d < startOfHeatmap) return;
    d.setHours(0,0,0,0);
    const diffDays = Math.floor((d - startOfHeatmap) / 86400000);
    const week = Math.floor(diffDays / 7);
    const day = d.getDay();
    if (week >= 0 && week < 52) {
      cells[week * 7 + day].count++;
    }
  });

  return cells;
};

// GET /api/analytics/commits?org=&repo=
exports.getCommits = async (req, res) => {
  const { org, repo } = req.query;
  if (!org || !repo) return res.status(400).json({ error: 'org and repo are required' });

  try {
    const gh = new GitHubService(req.user.accessToken);
    const commits = await gh.getRepoCommits(org, repo, 100);

    const weekly = groupCommitsByWeek(commits, 12);
    const daily = groupByDayOfWeek(commits);
    const heatmap = buildHeatmapData(commits);

    res.json({
      weekly,
      daily,
      heatmap,
      total: commits.length,
    });
  } catch (err) {
    console.error('getCommits error:', err.message);
    res.status(500).json({ error: 'Failed to fetch commit data' });
  }
};

// GET /api/analytics/prs?org=&repo=
exports.getPRs = async (req, res) => {
  const { org, repo } = req.query;
  if (!org || !repo) return res.status(400).json({ error: 'org and repo are required' });

  try {
    const gh = new GitHubService(req.user.accessToken);
    const prs = await gh.getPullRequests(org, repo, 'all', 100);

    const open = prs.filter(p => p.state === 'open');
    const merged = prs.filter(p => p.merged_at);
    const cycleTimes = merged.map(calcCycleTime).filter(Boolean);
    const avgCycle = cycleTimes.length
      ? (cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length).toFixed(1)
      : 0;

    const stale = open.filter(
      p => (Date.now() - new Date(p.created_at)) / (1000 * 60 * 60 * 24) > 7
    );

    const byWeek = {};
    merged.forEach(pr => {
      const week = new Date(pr.merged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      byWeek[week] = (byWeek[week] || 0) + 1;
    });

    res.json({
      total: prs.length,
      open: open.length,
      merged: merged.length,
      avgCycleTimeHours: parseFloat(avgCycle),
      stalePRs: stale.length,
      byWeek: Object.entries(byWeek).map(([week, count]) => ({ week, count })).slice(-8),
      recentPRs: prs.slice(0, 15).map(p => ({
        number: p.number,
        title: p.title,
        state: p.merged_at ? 'merged' : p.state,
        author: p.user?.login,
        createdAt: p.created_at,
        mergedAt: p.merged_at,
        cycleHours: calcCycleTime(p),
      })),
    });
  } catch (err) {
    console.error('getPRs error:', err.message);
    res.status(500).json({ error: 'Failed to fetch PR data' });
  }
};

// GET /api/analytics/reviews?org=&repo=
exports.getReviews = async (req, res) => {
  const { org, repo } = req.query;
  if (!org || !repo) return res.status(400).json({ error: 'org and repo are required' });

  try {
    const gh = new GitHubService(req.user.accessToken);
    const prs = await gh.getPullRequests(org, repo, 'closed', 20);

    const reviewerMap = {};
    for (const pr of prs.slice(0, 10)) {
      const reviews = await gh.getPRReviews(org, repo, pr.number);
      reviews.forEach(r => {
        const login = r.user?.login;
        if (!login) return;
        if (!reviewerMap[login]) reviewerMap[login] = { reviews: 0, approved: 0 };
        reviewerMap[login].reviews += 1;
        if (r.state === 'APPROVED') reviewerMap[login].approved += 1;
      });
    }

    const reviewers = Object.entries(reviewerMap)
      .map(([login, stats]) => ({
        login,
        reviews: stats.reviews,
        approved: stats.approved,
        approvalRate: stats.reviews > 0 ? Math.round((stats.approved / stats.reviews) * 100) : 0,
      }))
      .sort((a, b) => b.reviews - a.reviews);

    res.json({ reviewers, totalReviews: reviewers.reduce((s, r) => s + r.reviews, 0) });
  } catch (err) {
    console.error('getReviews error:', err.message);
    res.status(500).json({ error: 'Failed to fetch review data' });
  }
};

// GET /api/analytics/velocity?org=&repo=
exports.getVelocity = async (req, res) => {
  const { org, repo } = req.query;
  if (!org || !repo) return res.status(400).json({ error: 'org and repo are required' });

  try {
    const gh = new GitHubService(req.user.accessToken);
    const [contributors, commits] = await Promise.all([
      gh.getRepoContributors(org, repo),
      gh.getRepoCommits(org, repo, 100),
    ]);

    const topContributors = contributors
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 10)
      .map(c => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        totalCommits: c.contributions,
        weeksActive: Math.min(Math.ceil(c.contributions / 3), 12), // estimate
      }));

    const weeklyVelocity = groupCommitsByWeek(commits, 8);

    res.json({ topContributors, weeklyVelocity });
  } catch (err) {
    console.error('getVelocity error:', err.message);
    res.status(500).json({ error: 'Failed to fetch velocity data' });
  }
};

// GET /api/analytics/health?org=&repo=
exports.getHealth = async (req, res) => {
  const { org, repo } = req.query;
  if (!org || !repo) return res.status(400).json({ error: 'org and repo are required' });

  try {
    const gh = new GitHubService(req.user.accessToken);
    const [openIssues, closedIssues, openPRs] = await Promise.all([
      gh.getIssues(org, repo, 'open'),
      gh.getIssues(org, repo, 'closed'),
      gh.getPullRequests(org, repo, 'open', 50),
    ]);

    const stalePRs = openPRs.filter(
      p => (Date.now() - new Date(p.created_at)) / 86400000 > 7
    );

    const score = Math.max(0, 100 - openIssues.length * 2 - stalePRs.length * 5);

    res.json({
      openIssues: openIssues.length,
      closedIssues: closedIssues.length,
      openPRs: openPRs.length,
      stalePRs: stalePRs.length,
      healthScore: Math.min(score, 100),
    });
  } catch (err) {
    console.error('getHealth error:', err.message);
    res.status(500).json({ error: 'Failed to fetch health data' });
  }
};
