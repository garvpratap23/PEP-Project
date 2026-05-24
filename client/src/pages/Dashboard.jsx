import { GitCommitHorizontal, GitPullRequest, Users, Clock, Star, Zap, HeartPulse, Activity } from 'lucide-react';
import MetricCard from '../components/cards/MetricCard';
import CommitTrendChart from '../components/charts/CommitTrendChart';
import PRCycleChart from '../components/charts/PRCycleChart';
import ContributorChart from '../components/charts/ContributorChart';
import RepoActivityChart from '../components/charts/RepoActivityChart';
import { useAnalytics } from '../hooks/useAnalytics';
import { useOrg } from '../context/OrgContext';
import { useAuth } from '../context/AuthContext';
import { formatNumber, formatHours } from '../utils/helpers';

export default function Dashboard() {
  const { isDemoMode } = useAuth();
  const { orgDetails, selectedRepo, setSelectedRepo } = useOrg();
  const { data: commits, loading: cLoading } = useAnalytics('commits');
  const { data: prs, loading: pLoading } = useAnalytics('prs');
  const { data: velocity, loading: vLoading } = useAnalytics('velocity');
  const { data: health, loading: hLoading } = useAnalytics('health');

  const loading = cLoading || pLoading || vLoading || hLoading;

  return (
    <div className="fade-in" id="dashboard-page">
      {isDemoMode && (
        <div className="demo-banner">
          <Activity size={14} />
          <strong>Demo Mode</strong> — showing realistic sample data. Connect GitHub OAuth to see your real metrics.
        </div>
      )}

      {/* Repo selector */}
      {orgDetails?.repositories?.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Repository:</span>
          <select
            className="select"
            value={selectedRepo || ''}
            onChange={e => setSelectedRepo(e.target.value)}
            id="repo-selector"
          >
            {orgDetails.repositories.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Metric Cards */}
      <div className="metrics-grid stagger">
        <MetricCard
          id="metric-total-commits"
          icon={<GitCommitHorizontal size={20} />}
          label="Total Commits"
          value={formatNumber(commits?.total || 0)}
          delta={12}
          color="blue"
          loading={cLoading}
        />
        <MetricCard
          id="metric-open-prs"
          icon={<GitPullRequest size={20} />}
          label="Open PRs"
          value={prs?.open || 0}
          delta={-3}
          color="purple"
          loading={pLoading}
        />
        <MetricCard
          id="metric-merged-prs"
          icon={<Star size={20} />}
          label="Merged PRs"
          value={formatNumber(prs?.merged || 0)}
          delta={8}
          color="green"
          loading={pLoading}
        />
        <MetricCard
          id="metric-cycle-time"
          icon={<Clock size={20} />}
          label="Avg Cycle Time"
          value={formatHours(prs?.avgCycleTimeHours)}
          delta={-15}
          deltaLabel="faster than last period"
          color="orange"
          loading={pLoading}
        />
        <MetricCard
          id="metric-contributors"
          icon={<Users size={20} />}
          label="Contributors"
          value={velocity?.topContributors?.length || 0}
          color="blue"
          loading={vLoading}
        />
        <MetricCard
          id="metric-stale-prs"
          icon={<Zap size={20} />}
          label="Stale PRs"
          value={prs?.stalePRs || 0}
          delta={prs?.stalePRs > 3 ? 20 : -10}
          color={prs?.stalePRs > 5 ? 'orange' : 'green'}
          loading={pLoading}
        />
        <MetricCard
          id="metric-open-issues"
          icon={<HeartPulse size={20} />}
          label="Open Issues"
          value={health?.openIssues || 0}
          color="purple"
          loading={hLoading}
        />
        <MetricCard
          id="metric-health-score"
          icon={<Activity size={20} />}
          label="Health Score"
          value={`${health?.healthScore || 0}%`}
          delta={5}
          color={health?.healthScore >= 80 ? 'green' : health?.healthScore >= 60 ? 'orange' : 'orange'}
          loading={hLoading}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Commit Trend</div>
              <div className="card-subtitle">Weekly commit activity over the last 12 weeks</div>
            </div>
          </div>
          <CommitTrendChart data={commits} />
        </div>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">PR Merge Rate</div>
              <div className="card-subtitle">Pull requests merged per week</div>
            </div>
          </div>
          <PRCycleChart data={prs} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Top Contributors</div>
              <div className="card-subtitle">Commit distribution by contributor</div>
            </div>
          </div>
          <ContributorChart data={velocity} />
        </div>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Repository Activity</div>
              <div className="card-subtitle">Activity share across repositories</div>
            </div>
          </div>
          <RepoActivityChart repos={orgDetails?.repositories || []} />
        </div>
      </div>
    </div>
  );
}
