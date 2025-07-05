
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SeekingOrgAdminAuthService } from '@/services/SeekingOrgAdminAuthService';

interface SeekingOrganization {
  organizationId: string;
  organizationName: string;
  role: 'seeking_organization';
  permissions: string[];
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface RememberMeData {
  userId: string;
  email: string;
  timestamp: string;
}

export const useSeekingOrgAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState<SeekingOrganization | null>(null);
  const navigate = useNavigate();

  // Check for existing session on hook initialization
  useEffect(() => {
    const session = SeekingOrgAdminAuthService.getCurrentSession();
    
    if (session) {
      console.log('✅ Existing session found:', session.sessionId);
      
      const organizationData: SeekingOrganization = {
        organizationId: session.organizationId,
        organizationName: session.organizationName,
        role: 'seeking_organization',
        permissions: ['manage_admin', 'view_dashboard', 'manage_organization']
      };
      
      setCurrentOrganization(organizationData);
      setIsAuthenticated(true);
    } else {
      console.log('📊 No existing session found');
    }
  }, []);

  const login = async (identifier: string, password: string, rememberMe: boolean = false): Promise<AuthResult> => {
    setIsLoading(true);
    console.log('🔐 Starting administrator login for:', identifier);
    
    try {
      // Clear any existing session
      SeekingOrgAdminAuthService.clearSession();
      setCurrentOrganization(null);
      setIsAuthenticated(false);
      
      // Authenticate using the new service
      const authResult = await SeekingOrgAdminAuthService.authenticate(identifier, password);
      
      if (authResult.success && authResult.admin) {
        const admin = authResult.admin;
        console.log('✅ Authentication successful for:', admin.name);
        
        // Create session
        const session = SeekingOrgAdminAuthService.createSession(admin, rememberMe);
        
        // Set organization data
        const organizationData: SeekingOrganization = {
          organizationId: admin.organizationId,
          organizationName: admin.organizationName,
          role: 'seeking_organization',
          permissions: ['manage_admin', 'view_dashboard', 'manage_organization']
        };
        
        setCurrentOrganization(organizationData);
        setIsAuthenticated(true);
        
        toast.success(`Welcome back, ${admin.name}!`);
        navigate('/seeking-org-admin-dashboard');
        
        return { success: true };
      } else {
        // Authentication failed
        const errorMessage = authResult.error || 'Authentication failed';
        console.log('❌ Authentication failed:', errorMessage);
        
        // Don't show toast here, let the form handle the error display
        return { 
          success: false, 
          error: errorMessage 
        };
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      
      return { 
        success: false, 
        error: errorMessage 
      };
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

  const getRememberMeData = (): RememberMeData | null => {
    return SeekingOrgAdminAuthService.getRememberMeData();
  };

  return {
    isLoading,
    isAuthenticated,
    currentAdmin: currentOrganization, // Keep this name for backward compatibility
    currentOrganization,
    login,
    logout,
    checkAuthStatus,
    getRememberMeData,
    clearAllCachedData
  };
};
