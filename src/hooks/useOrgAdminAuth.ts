
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
      setLoading(false);
    }
  };

  const logoutOrgAdmin = async () => {
    try {
      console.log('🚪 Logging out org admin...');
      await supabase.auth.signOut();
      setOrgAdmin(null);
      setOrganizationData(null);
      setAuthInitialized(false);
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('❌ Logout error:', error);
      toast.error('Error signing out');
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
          setAuthInitialized(true);
        }
      } else {
        console.log('ℹ️ No existing user session found');
        setAuthInitialized(true); // Mark as initialized even if no user
      }
    } catch (error) {
      console.error('❌ Error getting current admin:', error);
      setAuthInitialized(true); // Mark as initialized even on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Setting up org admin auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in, fetching admin data...');
          const adminData = await fetchOrgAdminData(session.user.id);
          if (adminData) {
            setAuthInitialized(true);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out, clearing admin data...');
          setOrgAdmin(null);
          setOrganizationData(null);
          setAuthInitialized(true);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    getCurrentOrgAdmin();

    return () => {
      console.log('🧹 Cleaning up org admin auth subscription...');
      subscription.unsubscribe();
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
