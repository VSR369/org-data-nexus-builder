
import { useState, useEffect } from 'react';
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

  // Clear any cached session data on hook initialization
  useEffect(() => {
    console.log('📊 SESSION - Calling localStorage.getItem("seeking_org_admin_session")');
    const session = localStorage.getItem('seeking_org_admin_session');
    console.log('📊 SESSION - Raw session data from localStorage:', session);
    
    if (session) {
      try {
        const organizationData = JSON.parse(session);
        console.log('📊 SESSION - Parsed session data:', JSON.stringify(organizationData, null, 2));
        setCurrentOrganization(organizationData);
        setIsAuthenticated(true);
        console.log('✅ SESSION - Session restored successfully');
      } catch (error) {
        console.error('❌ SESSION - Error parsing session data:', error);
        // Clear corrupted session data
        localStorage.removeItem('seeking_org_admin_session');
        setCurrentOrganization(null);
        setIsAuthenticated(false);
      }
    } else {
      console.log('📊 SESSION - No session data found in localStorage');
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Clear any existing session first
      localStorage.removeItem('seeking_org_admin_session');
      setCurrentOrganization(null);
      setIsAuthenticated(false);
      
      // Import the unified user storage service to check for actual user
      const { unifiedUserStorageService } = await import('@/services/UnifiedUserStorageService');
      await unifiedUserStorageService.initialize();
      
      // Try to find the actual user data
      const allUsers = await unifiedUserStorageService.getAllUsers();
      const foundUser = allUsers.find(user => user.email === email);
      
      if (foundUser && email && password) {
        const organizationData: SeekingOrganization = {
          organizationId: email,
          organizationName: foundUser.organizationName || 'Organization Name Not Available',
          role: 'seeking_organization',
          permissions: ['manage_membership', 'select_engagement_models', 'view_dashboard']
        };
        
        setCurrentOrganization(organizationData);
        setIsAuthenticated(true);
        
        // Store organization session
        const sessionDataToStore = {
          ...organizationData,
          loginTime: new Date().toISOString()
        };
        console.log('📊 LOGIN - Saving session data to localStorage with key "seeking_org_admin_session"');
        console.log('📊 LOGIN - Session data being saved:', JSON.stringify(sessionDataToStore, null, 2));
        localStorage.setItem('seeking_org_admin_session', JSON.stringify(sessionDataToStore));
        
        // Verify the save
        const verification = localStorage.getItem('seeking_org_admin_session');
        console.log('📊 LOGIN - Session verification read:', verification);
        
        toast.success('Successfully signed in to your organization account!');
        navigate('/seeking-org-admin-dashboard');
        return true;
      } else if (!foundUser) {
        toast.error('User not found. Please check your email or register first.');
        return false;
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
    // Clear all organization session data
    setCurrentOrganization(null);
    setIsAuthenticated(false);
    localStorage.removeItem('seeking_org_admin_session');
    
    // Clear any cached form data
    const emailInput = document.getElementById('org-email') as HTMLInputElement;
    const passwordInput = document.getElementById('org-password') as HTMLInputElement;
    
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    
    toast.success('Successfully logged out');
    navigate('/signin');
  };

  const checkAuthStatus = () => {
    console.log('📊 AUTH CHECK - Calling localStorage.getItem("seeking_org_admin_session")');
    const session = localStorage.getItem('seeking_org_admin_session');
    console.log('📊 AUTH CHECK - Session data retrieved:', session);
    
    if (session) {
      try {
        const organizationData = JSON.parse(session);
        console.log('📊 AUTH CHECK - Parsed organization data:', JSON.stringify(organizationData, null, 2));
        setCurrentOrganization(organizationData);
        setIsAuthenticated(true);
        console.log('✅ AUTH CHECK - Authentication status set to true');
        return true;
      } catch (error) {
        console.error('❌ AUTH CHECK - Error parsing session data:', error);
        // Clear corrupted data
        localStorage.removeItem('seeking_org_admin_session');
        setCurrentOrganization(null);
        setIsAuthenticated(false);
      }
    } else {
      console.log('📊 AUTH CHECK - No session found, user not authenticated');
    }
    return false;
  };

  const clearAllCachedData = () => {
    // Clear session storage
    localStorage.removeItem('seeking_org_admin_session');
    
    // Clear component state
    setCurrentOrganization(null);
    setIsAuthenticated(false);
    
    // Clear form inputs if they exist
    const emailInput = document.getElementById('org-email') as HTMLInputElement;
    const passwordInput = document.getElementById('org-password') as HTMLInputElement;
    
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    
    console.log('✅ All Solution Seeking Organization cached data cleared');
  };

  return {
    isLoading,
    isAuthenticated,
    currentAdmin: currentOrganization, // Keep this name for backward compatibility
    currentOrganization,
    login,
    logout,
    checkAuthStatus,
    clearAllCachedData
  };
};
