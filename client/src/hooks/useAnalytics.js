import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useOrg } from '../context/OrgContext';
import {
  DEMO_COMMITS, DEMO_PRS, DEMO_REVIEWS, DEMO_VELOCITY, DEMO_HEALTH,
} from '../utils/mockData';

const DEMO_MAP = {
  commits: DEMO_COMMITS,
  prs: DEMO_PRS,
  reviews: DEMO_REVIEWS,
  velocity: DEMO_VELOCITY,
  health: DEMO_HEALTH,
};

export const useAnalytics = (type) => {
  const { isDemoMode } = useAuth();
  const { selectedOrg, selectedRepo } = useOrg();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (isDemoMode) {
      await new Promise(r => setTimeout(r, 400)); // simulate load
      setData(DEMO_MAP[type]);
      setLoading(false);
      return;
    }
    if (!selectedOrg || !selectedRepo) return;
    setLoading(true);
    setError(null);
    try {
      const fn = analyticsApi[`get${type.charAt(0).toUpperCase() + type.slice(1)}`];
      const result = await fn(selectedOrg, selectedRepo);
      setData(result);
    } catch (err) {
      setError(err.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [type, isDemoMode, selectedOrg, selectedRepo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
