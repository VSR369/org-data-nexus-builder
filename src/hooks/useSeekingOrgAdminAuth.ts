
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SeekingOrgAdmin {
  adminId: string;
  organizationName: string;
  role: 'seeking_org_admin';
  permissions: string[];
}

export const useSeekingOrgAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<SeekingOrgAdmin | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate admin authentication - in real app this would be API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        const adminData: SeekingOrgAdmin = {
          adminId: email,
          organizationName: 'Solution Seeking Organization',
          role: 'seeking_org_admin',
          permissions: ['manage_solutions', 'view_analytics', 'manage_seekers']
        };
        
        setCurrentAdmin(adminData);
        setIsAuthenticated(true);
        
        // Store admin session
        localStorage.setItem('seeking_org_admin_session', JSON.stringify({
          ...adminData,
          loginTime: new Date().toISOString()
        }));
        
        toast.success('Successfully signed in as Seeking Organization Administrator!');
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
    setCurrentAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('seeking_org_admin_session');
    toast.success('Successfully logged out');
    navigate('/signin');
  };

  const checkAuthStatus = () => {
    const session = localStorage.getItem('seeking_org_admin_session');
    if (session) {
      try {
        const adminData = JSON.parse(session);
        setCurrentAdmin(adminData);
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
    currentAdmin,
    login,
    logout,
    checkAuthStatus
  };
};
