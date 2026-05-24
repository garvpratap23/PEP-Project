import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import { DEMO_USER } from '../utils/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      const data = await authApi.getMe();
      setUser(data);
      setIsDemoMode(false);
    } catch {
      // Not authenticated — check if demo mode was previously set
      const demo = localStorage.getItem('demoMode') === 'true';
      if (demo) {
        setUser(DEMO_USER);
        setIsDemoMode(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();

    const handleExpiry = () => {
      setUser(null);
      setIsDemoMode(false);
      localStorage.removeItem('demoMode');
    };
    window.addEventListener('auth:expired', handleExpiry);
    return () => window.removeEventListener('auth:expired', handleExpiry);
  }, [fetchMe]);

  const enterDemoMode = () => {
    localStorage.setItem('demoMode', 'true');
    setUser(DEMO_USER);
    setIsDemoMode(true);
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    localStorage.removeItem('demoMode');
    setUser(null);
    setIsDemoMode(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemoMode, enterDemoMode, logout, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
