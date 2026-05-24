import axios from 'axios';

const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(err.response?.data || err);
  }
);

export const authApi = {
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const orgApi = {
  getOrgs: () => api.get('/api/orgs'),
  getOrgDetails: (org, refresh = false) =>
    api.get(`/api/orgs/${org}${refresh ? '?refresh=1' : ''}`),
};

export const analyticsApi = {
  getCommits: (org, repo) => api.get(`/api/analytics/commits?org=${org}&repo=${repo}`),
  getPRs: (org, repo) => api.get(`/api/analytics/prs?org=${org}&repo=${repo}`),
  getReviews: (org, repo) => api.get(`/api/analytics/reviews?org=${org}&repo=${repo}`),
  getVelocity: (org, repo) => api.get(`/api/analytics/velocity?org=${org}&repo=${repo}`),
  getHealth: (org, repo) => api.get(`/api/analytics/health?org=${org}&repo=${repo}`),
};

export default api;
