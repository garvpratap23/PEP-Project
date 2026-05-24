const axios = require('axios');

class GitHubService {
  constructor(accessToken) {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    this.client.interceptors.response.use(
      res => res,
      async err => {
        if (err.response?.status === 403 && err.response.headers['x-ratelimit-remaining'] === '0') {
          const resetTime = err.response.headers['x-ratelimit-reset'] * 1000;
          const waitMs = Math.max(resetTime - Date.now(), 1000);
          console.warn(`GitHub rate limit hit. Waiting ${Math.round(waitMs / 1000)}s...`);
          await new Promise(r => setTimeout(r, Math.min(waitMs, 10000)));
        }
        return Promise.reject(err);
      }
    );
  }

  async getUser() {
    const { data } = await this.client.get('/user');
    return data;
  }

  async getUserOrgs() {
    const { data } = await this.client.get('/user/orgs?per_page=100');
    return data;
  }

  async getOrg(org) {
    const { data } = await this.client.get(`/orgs/${org}`);
    return data;
  }

  async getOrgRepos(org, page = 1) {
    const { data } = await this.client.get(
      `/orgs/${org}/repos?per_page=100&page=${page}&sort=updated`
    );
    return data;
  }

  async getUserRepos(username) {
    const { data } = await this.client.get(
      `/users/${username}/repos?per_page=100&sort=updated`
    );
    return data;
  }

  async getCommitActivity(owner, repo) {
    try {
      const { data } = await this.client.get(`/repos/${owner}/${repo}/stats/commit_activity`);
      return data || [];
    } catch {
      return [];
    }
  }

  async getContributorStats(owner, repo) {
    try {
      const { data } = await this.client.get(`/repos/${owner}/${repo}/stats/contributors`);
      return data || [];
    } catch {
      return [];
    }
  }

  async getPullRequests(owner, repo, state = 'all', per_page = 100) {
    try {
      const { data } = await this.client.get(
        `/repos/${owner}/${repo}/pulls?state=${state}&per_page=${per_page}&sort=updated`
      );
      return data;
    } catch {
      return [];
    }
  }

  async getPRReviews(owner, repo, prNumber) {
    try {
      const { data } = await this.client.get(
        `/repos/${owner}/${repo}/pulls/${prNumber}/reviews`
      );
      return data;
    } catch {
      return [];
    }
  }

  async getIssues(owner, repo, state = 'all') {
    try {
      const { data } = await this.client.get(
        `/repos/${owner}/${repo}/issues?state=${state}&per_page=100`
      );
      return data.filter(i => !i.pull_request);
    } catch {
      return [];
    }
  }

  async getCodeFrequency(owner, repo) {
    try {
      const { data } = await this.client.get(`/repos/${owner}/${repo}/stats/code_frequency`);
      return data || [];
    } catch {
      return [];
    }
  }
}

module.exports = GitHubService;
