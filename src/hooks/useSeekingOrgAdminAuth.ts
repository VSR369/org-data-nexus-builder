
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SeekingOrganization {
  organizationId: string;
  organizationName: string;
  role: 'seeking_organization';
  permissions: string[];
}

export const useSeekingOrgAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState<SeekingOrganization | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate organization authentication - in real app this would be API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        const organizationData: SeekingOrganization = {
          organizationId: email,
          organizationName: 'Solution Seeking Organization',
          role: 'seeking_organization',
          permissions: ['manage_membership', 'select_engagement_models', 'view_dashboard']
        };
        
        setCurrentOrganization(organizationData);
        setIsAuthenticated(true);
        
        // Store organization session
        localStorage.setItem('seeking_org_admin_session', JSON.stringify({
          ...organizationData,
          loginTime: new Date().toISOString()
        }));
        
        toast.success('Successfully signed in to your organization account!');
        navigate('/seeking-org-admin-dashboard');
        return true;
      } else {
        toast.error('Please enter both email and password');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentOrganization(null);
    setIsAuthenticated(false);
    localStorage.removeItem('seeking_org_admin_session');
    toast.success('Successfully logged out');
    navigate('/signin');
  };

  const checkAuthStatus = () => {
    const session = localStorage.getItem('seeking_org_admin_session');
    if (session) {
      try {
        const organizationData = JSON.parse(session);
        setCurrentOrganization(organizationData);
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        localStorage.removeItem('seeking_org_admin_session');
      }
    }
    return false;
  };

  return {
    isLoading,
    isAuthenticated,
    currentAdmin: currentOrganization, // Keep this name for backward compatibility
    currentOrganization,
    login,
    logout,
    checkAuthStatus
  };
};
