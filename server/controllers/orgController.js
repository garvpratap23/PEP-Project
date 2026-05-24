const GitHubService = require('../services/githubService');
const Organization = require('../models/Organization');

// GET /api/orgs — list user's orgs
exports.getOrgs = async (req, res) => {
  try {
    const gh = new GitHubService(req.user.accessToken);
    const orgs = await gh.getUserOrgs();
    res.json(orgs);
  } catch (err) {
    console.error('getOrgs error:', err.message);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};

// GET /api/orgs/:org — get org details + repos
exports.getOrgDetails = async (req, res) => {
  const { org } = req.params;
  try {
    // Check cache
    const cached = await Organization.findOne({ login: org });
    const cacheAge = cached?.lastSynced
      ? (Date.now() - new Date(cached.lastSynced).getTime()) / 1000 / 60
      : Infinity;

    if (cached && cacheAge < 30 && !req.query.refresh) {
      return res.json(cached);
    }

    const gh = new GitHubService(req.user.accessToken);
    const [orgData, repos] = await Promise.all([
      gh.getOrg(org),
      gh.getOrgRepos(org),
    ]);

    const mappedRepos = repos.map(r => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      openIssues: r.open_issues_count,
      isPrivate: r.private,
      updatedAt: r.updated_at,
    }));

    const updatedOrg = await Organization.findOneAndUpdate(
      { login: org },
      {
        login: orgData.login,
        name: orgData.name,
        description: orgData.description,
        avatarUrl: orgData.avatar_url,
        publicRepos: orgData.public_repos,
        repositories: mappedRepos,
        lastSynced: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json(updatedOrg);
  } catch (err) {
    console.error('getOrgDetails error:', err.message);
    res.status(500).json({ error: 'Failed to fetch organization details' });
  }
};
