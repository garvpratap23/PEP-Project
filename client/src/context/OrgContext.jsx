import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orgApi } from '../services/api';
import { useAuth } from './AuthContext';
import { DEMO_ORG } from '../utils/mockData';

const OrgContext = createContext(null);

export const OrgProvider = ({ children }) => {
  const { user, isDemoMode } = useAuth();
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgDetails, setOrgDetails] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch org list on login
  useEffect(() => {
    if (!user) { setOrgs([]); setOrgDetails(null); return; }
    if (isDemoMode) {
      setOrgs([DEMO_ORG]);
      setSelectedOrg(DEMO_ORG.login);
      setOrgDetails(DEMO_ORG);
      setSelectedRepo(DEMO_ORG.repositories[0]?.name || null);
      return;
    }
    orgApi.getOrgs()
      .then(data => {
        setOrgs(data);
        if (data.length > 0) setSelectedOrg(data[0].login);
      })
      .catch(console.error);
  }, [user, isDemoMode]);

  // Fetch org details when selected org changes
  const fetchOrgDetails = useCallback(async (refresh = false) => {
    if (!selectedOrg || isDemoMode) return;
    setLoading(true);
    try {
      const data = await orgApi.getOrgDetails(selectedOrg, refresh);
      setOrgDetails(data);
      if (data.repositories?.length > 0 && !selectedRepo) {
        setSelectedRepo(data.repositories[0].name);
      }
    } catch (err) {
      console.error('Failed to load org details:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedOrg, isDemoMode, selectedRepo]);

  useEffect(() => { fetchOrgDetails(); }, [fetchOrgDetails]);

  return (
    <OrgContext.Provider value={{
      orgs, selectedOrg, setSelectedOrg,
      orgDetails, selectedRepo, setSelectedRepo,
      loading, refreshOrg: () => fetchOrgDetails(true),
    }}>
      {children}
    </OrgContext.Provider>
  );
};

export const useOrg = () => {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error('useOrg must be inside OrgProvider');
  return ctx;
};
