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
    try {
      const { data } = await this.client.get(`/orgs/${org}`);
      return data;
    } catch (err) {
      if (err.response?.status === 404) {
        const { data } = await this.client.get(`/users/${org}`);
        return data;
      }
      throw err;
    }
  }

  async getOrgRepos(org, page = 1) {
    try {
      const { data } = await this.client.get(
        `/orgs/${org}/repos?per_page=100&page=${page}&sort=updated`
      );
      return data;
    } catch (err) {
      if (err.response?.status === 404) {
        const { data } = await this.client.get(
          `/users/${org}/repos?per_page=100&page=${page}&sort=updated&type=owner`
        );
        return data;
      }
      throw err;
    }
  }

  async getUserRepos(username) {
    const { data } = await this.client.get(
      `/users/${username}/repos?per_page=100&sort=updated`
    );
    return data;
  }

  async getAuthenticatedUserRepos(page = 1) {
    const { data } = await this.client.get(
      `/user/repos?per_page=100&page=${page}&sort=updated`
    );
    return data;
  }

  // Direct commits endpoint — reliable, no caching delay
  async getRepoCommits(owner, repo, perPage = 100) {
    try {
      const { data } = await this.client.get(
        `/repos/${owner}/${repo}/commits?per_page=${perPage}`
      );
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  // Direct contributors endpoint — reliable
  async getRepoContributors(owner, repo) {
    try {
      const { data } = await this.client.get(
        `/repos/${owner}/${repo}/contributors?per_page=100&anon=false`
      );
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  async getPullRequests(owner, repo, state = 'all', per_page = 100) {
    try {
      const { data } = await this.client.get(
        `/repos/${owner}/${repo}/pulls?state=${state}&per_page=${per_page}&sort=updated`
      );
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  async getPRReviews(owner, repo, prNumber) {
    try {
      const { data } = await this.client.get(
        `/repos/${owner}/${repo}/pulls/${prNumber}/reviews`
      );
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  async getIssues(owner, repo, state = 'all') {
    try {
      const { data } = await this.client.get(
        `/repos/${owner}/${repo}/issues?state=${state}&per_page=100`
      );
      return Array.isArray(data) ? data.filter(i => !i.pull_request) : [];
    } catch {
      return [];
    }
  }
}

module.exports = GitHubService;
