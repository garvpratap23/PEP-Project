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
  const [loading, setLoading] = useState(true);

  // Fetch org list on login
  useEffect(() => {
    if (!user) {
      setOrgs([]);
      setSelectedOrg(null);
      setOrgDetails(null);
      setSelectedRepo(null);
      setLoading(false);
      return;
    }
    if (isDemoMode) {
      setOrgs([DEMO_ORG]);
      setSelectedOrg(DEMO_ORG.login);
      setOrgDetails(DEMO_ORG);
      setSelectedRepo(DEMO_ORG.repositories[0]?.name || null);
      setLoading(false);
      return;
    }
    setLoading(true);
    orgApi.getOrgs()
      .then(data => {
        setOrgs(data);
        if (data.length > 0) {
          setSelectedOrg(data[0].login);
        } else {
          setSelectedOrg(null);
          setOrgDetails(null);
          setSelectedRepo(null);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load organizations:', err);
        setLoading(false);
      });
  }, [user, isDemoMode]);

  // Reset selected repo when organization changes
  useEffect(() => {
    setSelectedRepo(null);
  }, [selectedOrg]);

  // Fetch org details when selected org changes
  const fetchOrgDetails = useCallback(async (refresh = false) => {
    if (!selectedOrg || isDemoMode) return;
    setLoading(true);
    try {
      const data = await orgApi.getOrgDetails(selectedOrg, refresh);
      setOrgDetails(data);
      const repoNames = data.repositories?.map(r => r.name) || [];
      if (repoNames.length > 0) {
        if (!selectedRepo || !repoNames.includes(selectedRepo)) {
          setSelectedRepo(repoNames[0]);
        }
      } else {
        setSelectedRepo(null);
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
