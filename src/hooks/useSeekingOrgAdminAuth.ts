
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
    console.log('🔐 === SEEKING ORG ADMIN LOGIN START ===');
    console.log('🔐 Attempting login with email:', email);
    
    try {
      // Clear any existing session first
      localStorage.removeItem('seeking_org_admin_session');
      setCurrentOrganization(null);
      setIsAuthenticated(false);
      
      // Try to authenticate using the dedicated administrator service
      const { administratorStorageService } = await import('@/services/AdministratorStorageService');
      
      // First try admin service (using email as adminId for backward compatibility)
      let authResult = await administratorStorageService.authenticateAdmin(email, password);
      
      if (!authResult.success) {
        // Fallback: try to find admin by email
        const adminByEmail = await administratorStorageService.findAdminByEmail(email);
        if (adminByEmail) {
          authResult = await administratorStorageService.authenticateAdmin(adminByEmail.adminId, password);
        }
      }
      
      if (authResult.success && authResult.admin) {
        const admin = authResult.admin;
        console.log('✅ Admin authentication successful:', admin.adminId);
        
        const organizationData: SeekingOrganization = {
          organizationId: admin.adminId,
          organizationName: admin.organizationName,
          role: 'seeking_organization',
          permissions: admin.permissions
        };
        
        setCurrentOrganization(organizationData);
        setIsAuthenticated(true);
        
        // Save session using administrator service
        await administratorStorageService.saveSession({
          adminId: admin.adminId,
          organizationName: admin.organizationName,
          adminEmail: admin.adminEmail,
          adminName: admin.adminName,
          role: admin.role,
          permissions: admin.permissions,
          loginTimestamp: new Date().toISOString()
        });
        
        // Also save legacy session for backward compatibility
        const sessionDataToStore = {
          ...organizationData,
          loginTime: new Date().toISOString(),
          adminData: {
            adminId: admin.adminId,
            adminName: admin.adminName,
            adminEmail: admin.adminEmail,
            role: admin.role
          }
        };
        
        console.log('📊 LOGIN - Saving session data to localStorage');
        localStorage.setItem('seeking_org_admin_session', JSON.stringify(sessionDataToStore));
        
        toast.success(`Successfully signed in as ${admin.adminName}!`);
        navigate('/seeking-org-admin-dashboard');
        console.log('🔐 === SEEKING ORG ADMIN LOGIN SUCCESS ===');
        return true;
      }
      
      // Fallback to regular user authentication for backward compatibility
      console.log('📊 Falling back to regular user authentication...');
      const { unifiedUserStorageService } = await import('@/services/UnifiedUserStorageService');
      await unifiedUserStorageService.initialize();
      
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
        
        const sessionDataToStore = {
          ...organizationData,
          loginTime: new Date().toISOString(),
          fallbackAuth: true
        };
        
        localStorage.setItem('seeking_org_admin_session', JSON.stringify(sessionDataToStore));
        
        toast.success('Successfully signed in to your organization account!');
        navigate('/seeking-org-admin-dashboard');
        console.log('🔐 === SEEKING ORG ADMIN LOGIN SUCCESS (FALLBACK) ===');
        return true;
      }
      
      console.log('❌ No valid authentication found');
      toast.error('Invalid credentials. Please check your email and password.');
      console.log('🔐 === SEEKING ORG ADMIN LOGIN FAILED ===');
      return false;
      
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('Login failed. Please try again.');
      console.log('🔐 === SEEKING ORG ADMIN LOGIN ERROR ===');
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
