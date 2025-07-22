
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrgAdmin {
  id: string;
  admin_name: string;
  admin_email: string;
  organization_id: string;
  user_id: string;
  created_at: string;
}

interface OrganizationData {
  [key: string]: any; // Allow all properties from the comprehensive view
}

interface UseOrgAdminAuthReturn {
  orgAdmin: OrgAdmin | null;
  organizationData: OrganizationData | null;
  isAuthenticated: boolean;
  loading: boolean;
  authInitialized: boolean;
  loginOrgAdmin: (email: string, password: string) => Promise<boolean>;
  logoutOrgAdmin: () => Promise<void>;
  getCurrentOrgAdmin: () => Promise<void>;
}

export const useOrgAdminAuth = (): UseOrgAdminAuthReturn => {
  const [orgAdmin, setOrgAdmin] = useState<OrgAdmin | null>(null);
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  const isAuthenticated = !!orgAdmin && authInitialized;

  const fetchOrgAdminData = async (userId: string) => {
    try {
      console.log('🔍 Fetching org admin data for user:', userId);
      
      // Get organization administrator record from simplified org_admins table
      const { data: adminData, error: adminError } = await supabase
        .from('org_admins')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (adminError || !adminData) {
        console.error('❌ Error fetching admin data:', adminError);
        setOrgAdmin(null);
        setOrganizationData(null);
        return null;
      }

      console.log('✅ Admin data fetched successfully:', adminData);
      setOrgAdmin(adminData);

      // Get organization comprehensive data
      const { data: orgData, error: orgError } = await supabase
        .from('solution_seekers_comprehensive_view')
        .select('*')
        .eq('organization_id', adminData.organization_id)
        .single();

      if (orgError) {
        console.error('❌ Error fetching organization data:', orgError);
        toast.error('Failed to load organization details');
        setOrganizationData(null);
      } else if (orgData) {
        console.log('✅ Organization data fetched successfully:', orgData);
        setOrganizationData(orgData);
      }

      return adminData;
    } catch (error) {
      console.error('❌ Error in fetchOrgAdminData:', error);
      setOrgAdmin(null);
      setOrganizationData(null);
      return null;
    }
  };

  const loginOrgAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔐 Starting org admin login process...');
      
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        console.error('❌ Auth login error:', error);
        toast.error('Invalid email or password');
        return false;
      }

      if (data.user) {
        console.log('✅ Auth login successful, user ID:', data.user.id);
        
        // Verify this user is an organization administrator
        const adminData = await fetchOrgAdminData(data.user.id);
        
        if (!adminData) {
          console.error('❌ User is not an org admin, signing out...');
          await supabase.auth.signOut();
          toast.error('This account is not authorized as an organization administrator');
          return false;
        }

        console.log('✅ Org admin verification successful');
        setAuthInitialized(true);
        toast.success('Successfully signed in!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('An unexpected error occurred during login');
      return false;
    } finally {
      // Always reset loading state regardless of success or failure
      console.log('🔄 Resetting loading state after login attempt');
      setLoading(false);
    }
  };

  const logoutOrgAdmin = async () => {
    try {
      console.log('🚪 Logging out org admin...');
      setLoading(true);
      await supabase.auth.signOut();
      setOrgAdmin(null);
      setOrganizationData(null);
      setAuthInitialized(false);
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('❌ Logout error:', error);
      toast.error('Error signing out');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentOrgAdmin = async () => {
    try {
      setLoading(true);
      console.log('🔍 Checking for existing org admin session...');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('✅ Found existing user session:', user.id);
        const adminData = await fetchOrgAdminData(user.id);
        if (adminData) {
          console.log('✅ Admin verification successful, setting authInitialized to true');
          setAuthInitialized(true);
        } else {
          console.log('❌ User is not an admin, setting authInitialized to true');
          setAuthInitialized(true);
        }
      } else {
        console.log('ℹ️ No existing user session found, setting authInitialized to true');
        setAuthInitialized(true);
      }
    } catch (error) {
      console.error('❌ Error getting current admin:', error);
      setAuthInitialized(true); // Always set to true even on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Setting up org admin auth state listener...');
    
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.id);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in via auth state change, fetching admin data...');
          const adminData = await fetchOrgAdminData(session.user.id);
          if (mounted) {
            if (adminData) {
              console.log('✅ Setting authInitialized to true after successful admin fetch');
              setAuthInitialized(true);
            } else {
              console.log('❌ Not an admin, but setting authInitialized to true');
              setAuthInitialized(true);
            }
            // Don't reset loading here as it's managed by login function
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out via auth state change, clearing admin data...');
          if (mounted) {
            setOrgAdmin(null);
            setOrganizationData(null);
            setAuthInitialized(true);
            setLoading(false);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed');
          // Don't change auth state for token refresh
        }
      }
    );

    // Check for existing session after setting up listener
    getCurrentOrgAdmin();

    // Add timeout fallback to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && !authInitialized) {
        console.log('⏰ Auth initialization timeout, forcing initialization');
        setAuthInitialized(true);
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => {
      console.log('🧹 Cleaning up org admin auth subscription...');
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    orgAdmin,
    organizationData,
    isAuthenticated,
    loading,
    authInitialized,
    loginOrgAdmin,
    logoutOrgAdmin,
    getCurrentOrgAdmin,
  };
};
