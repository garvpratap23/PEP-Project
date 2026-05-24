const GitHubService = require('../services/githubService');

// Helper: compute PR cycle time in hours
const calcCycleTime = (pr) => {
  if (!pr.merged_at) return null;
  return (new Date(pr.merged_at) - new Date(pr.created_at)) / (1000 * 60 * 60);
};

// GET /api/analytics/commits?org=&repo=&period=
exports.getCommits = async (req, res) => {
  const { org, repo } = req.query;
  if (!org || !repo) return res.status(400).json({ error: 'org and repo are required' });

  try {
    const gh = new GitHubService(req.user.accessToken);
    const activity = await gh.getCommitActivity(org, repo);

    const weekly = (activity || []).slice(-12).map(week => ({
      week: new Date(week.week * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      commits: week.total,
      days: week.days,
    }));

    const daily = weekly.flatMap(w =>
      (w.days || []).map((count, i) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        commits: count,
      }))
    );

    res.json({ weekly, daily, total: weekly.reduce((s, w) => s + w.commits, 0) });
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
    const prs = await gh.getPullRequests(org, repo, 'all', 50);

    const open = prs.filter(p => p.state === 'open');
    const merged = prs.filter(p => p.merged_at);
    const cycleTimes = merged.map(calcCycleTime).filter(Boolean);
    const avgCycle = cycleTimes.length
      ? (cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length).toFixed(1)
      : 0;

    // Stale = open > 7 days
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
      recentPRs: prs.slice(0, 10).map(p => ({
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
    const [contributors, activity] = await Promise.all([
      gh.getContributorStats(org, repo),
      gh.getCommitActivity(org, repo),
    ]);

    const topContributors = (contributors || [])
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map(c => ({
        login: c.author?.login,
        avatarUrl: c.author?.avatar_url,
        totalCommits: c.total,
        weeksActive: (c.weeks || []).filter(w => w.c > 0).length,
      }));

    const weeklyVelocity = (activity || []).slice(-8).map(w => ({
      week: new Date(w.week * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      commits: w.total,
    }));

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

    const score = Math.max(
      0,
      100 - openIssues.length * 2 - openPRs.filter(
        p => (Date.now() - new Date(p.created_at)) / 86400000 > 7
      ).length * 5
    );

    res.json({
      openIssues: openIssues.length,
      closedIssues: closedIssues.length,
      openPRs: openPRs.length,
      stalePRs: openPRs.filter(
        p => (Date.now() - new Date(p.created_at)) / 86400000 > 7
      ).length,
      healthScore: Math.min(score, 100),
    });
  } catch (err) {
    console.error('getHealth error:', err.message);
    res.status(500).json({ error: 'Failed to fetch health data' });
  }
};
