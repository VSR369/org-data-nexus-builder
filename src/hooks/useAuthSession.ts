import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentSolutionSeekingOrg, 
  isAuthenticated, 
  logoutSolutionSeekingOrg,
  getAuthServiceHealth 
} from '@/utils/authUtils';
import { AuthSession } from '@/types/authTypes';

interface UseAuthSessionOptions {
  redirectOnLogout?: string;
  checkInterval?: number; // in milliseconds
}

export const useAuthSession = (options: UseAuthSessionOptions = {}) => {
  const { redirectOnLogout = '/seeking-org-admin-login', checkInterval = 60000 } = options;
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication status
  const checkAuth = () => {
    console.log('🔍 AUTH - Checking authentication status...');
    const currentSession = getCurrentSolutionSeekingOrg();
    const isAuth = isAuthenticated();
    
    setSession(currentSession);
    setAuthenticated(isAuth);
    setLoading(false);
    
    console.log('📊 AUTH - Status check complete:', {
      hasSession: currentSession !== null,
      isAuthenticated: isAuth
    });
    
    return { session: currentSession, authenticated: isAuth };
  };

  // Logout function
  const logout = () => {
    console.log('🔓 AUTH - Logging out...');
    logoutSolutionSeekingOrg();
    setSession(null);
    setAuthenticated(false);
    navigate(redirectOnLogout);
  };

  // Force session refresh
  const refreshSession = () => {
    return checkAuth();
  };

  // Get authentication service health
  const getHealthStatus = () => {
    return getAuthServiceHealth();
  };

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, []);

  // Periodic session validation (optional)
  useEffect(() => {
    if (!checkInterval) return;

    const interval = setInterval(() => {
      const { authenticated: isAuth } = checkAuth();
      
      // If session became invalid, redirect to login
      if (!isAuth && session) {
        console.log('⚠️ AUTH - Session became invalid, redirecting to login...');
        logout();
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval, session]);

  return {
    session,
    loading,
    authenticated,
    logout,
    checkAuth,
    refreshSession,
    getHealthStatus
  };
};