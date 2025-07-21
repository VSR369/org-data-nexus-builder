
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrgAdmin {
  id: string;
  admin_name: string;
  admin_email: string;
  organization_id: string;
  is_active: boolean;
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
  loginOrgAdmin: (email: string, password: string) => Promise<boolean>;
  logoutOrgAdmin: () => Promise<void>;
  getCurrentOrgAdmin: () => Promise<void>;
}

export const useOrgAdminAuth = (): UseOrgAdminAuthReturn => {
  const [orgAdmin, setOrgAdmin] = useState<OrgAdmin | null>(null);
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!orgAdmin;

  const fetchOrgAdminData = async (userId: string) => {
    try {
      // Get organization administrator record
      const { data: adminData, error: adminError } = await supabase
        .from('organization_administrators')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (adminError || !adminData) {
        console.error('Error fetching admin data:', adminError);
        return null;
      }

      setOrgAdmin(adminData);

      // Get organization comprehensive data
      const { data: orgData, error: orgError } = await supabase
        .from('solution_seekers_comprehensive_view')
        .select('*')
        .eq('organization_id', adminData.organization_id)
        .single();

      if (orgError) {
        console.error('Error fetching organization data:', orgError);
      } else if (orgData) {
        setOrganizationData(orgData);
      }

      return adminData;
    } catch (error) {
      console.error('Error in fetchOrgAdminData:', error);
      return null;
    }
  };

  const loginOrgAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error('Invalid email or password');
        return false;
      }

      if (data.user) {
        // Verify this user is an organization administrator
        const adminData = await fetchOrgAdminData(data.user.id);
        
        if (!adminData) {
          await supabase.auth.signOut();
          toast.error('This account is not authorized as an organization administrator');
          return false;
        }

        toast.success('Successfully signed in!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutOrgAdmin = async () => {
    try {
      await supabase.auth.signOut();
      setOrgAdmin(null);
      setOrganizationData(null);
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error signing out');
    }
  };

  const getCurrentOrgAdmin = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await fetchOrgAdminData(user.id);
      }
    } catch (error) {
      console.error('Error getting current admin:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchOrgAdminData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setOrgAdmin(null);
          setOrganizationData(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    getCurrentOrgAdmin();

    return () => subscription.unsubscribe();
  }, []);

  return {
    orgAdmin,
    organizationData,
    isAuthenticated,
    loading,
    loginOrgAdmin,
    logoutOrgAdmin,
    getCurrentOrgAdmin,
  };
};
