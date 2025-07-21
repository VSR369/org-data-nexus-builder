
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Simple validation status interface
export interface ValidationStatus {
  organization_id: string;
  status: string;
  organization_name: string;
  has_admin: boolean;
  admin_info: any;
}

// Admin credentials interface
export interface AdminCredentials {
  email: string;
  temporaryPassword?: string;
  adminId: string;
  organizationName: string;
  isNewUser: boolean;
}

// Validation action interface
export interface ValidationAction {
  action: string;
  notes?: string;
}

// Password generation function
const generateStrongPassword = (): string => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let result = '';
  
  // Ensure at least one character from each required set
  const sets = [
    'abcdefghijklmnopqrstuvwxyz', // lowercase
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // uppercase  
    '0123456789', // numbers
    '!@#$%^&*' // symbols
  ];
  
  sets.forEach(set => {
    result += set.charAt(Math.floor(Math.random() * set.length));
  });
  
  // Fill the rest randomly
  for (let i = result.length; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the result
  return result.split('').sort(() => 0.5 - Math.random()).join('');
};

export const useValidationWorkflow = (organizationId: string) => {
  const [loading, setLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | null>(null);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials | null>(null);

  // Simplified validation status fetch - just return basic info
  const fetchValidationStatus = async (): Promise<ValidationStatus | null> => {
    try {
      setLoading(true);
      
      // Get organization data
      const { data: orgData, error: orgError } = await supabase
        .from('solution_seekers_comprehensive_view')
        .select('*')
        .eq('organization_id', organizationId)
        .single();

      if (orgError || !orgData) {
        console.error('Error fetching organization:', orgError);
        return null;
      }

      // Check if admin already exists
      const { data: adminData } = await supabase
        .from('org_admins')
        .select('*')
        .eq('organization_id', organizationId)
        .single();

      const status: ValidationStatus = {
        organization_id: organizationId,
        status: adminData ? 'completed' : 'pending',
        organization_name: orgData.organization_name,
        has_admin: !!adminData,
        admin_info: adminData || null
      };

      setValidationStatus(status);
      return status;
    } catch (error) {
      console.error('Error fetching validation status:', error);
      toast.error('Failed to fetch validation status');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Simplified validation update - just update local state
  const updateValidationStatus = async (action: ValidationAction): Promise<boolean> => {
    try {
      setLoading(true);
      
      // For simplicity, just update local state
      if (validationStatus) {
        const updatedStatus = {
          ...validationStatus,
          status: action.action === 'approve' ? 'approved' : 'rejected',
          last_action: action.action,
          notes: action.notes
        };
        setValidationStatus(updatedStatus);
      }

      toast.success(`Validation ${action.action} successful`);
      return true;
    } catch (error) {
      console.error('Error updating validation status:', error);
      toast.error('Failed to update validation status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Simplified admin creation using regular Supabase auth
  const createAdministrator = async (adminData: {
    admin_name: string;
    admin_email: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      const tempPassword = generateStrongPassword();

      // Check if admin already exists
      const { data: existingAdmin } = await supabase
        .from('org_admins')
        .select('*')
        .eq('organization_id', organizationId)
        .single();

      if (existingAdmin) {
        toast.error('An administrator already exists for this organization');
        return false;
      }

      // Try to sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: adminData.admin_email,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/org-admin/login`
        }
      });

      let userId: string;
      let isNewUser = true;

      if (signUpError) {
        // If user already exists, that's okay - we'll still create the admin record
        if (signUpError.message?.includes('already registered')) {
          // Get existing user by attempting a sign in (but don't actually sign in)
          const { data: existingUserData } = await supabase.auth.signInWithPassword({
            email: adminData.admin_email,
            password: 'dummy-password' // This will fail but we just want to check if user exists
          });
          
          if (!existingUserData.user) {
            toast.error('User exists but could not retrieve user ID');
            return false;
          }
          
          userId = existingUserData.user.id;
          isNewUser = false;
        } else {
          throw signUpError;
        }
      } else {
        if (!authData.user) {
          throw new Error('Failed to get user ID');
        }
        userId = authData.user.id;
      }

      // Get organization name for display
      const { data: orgData } = await supabase
        .from('solution_seekers_comprehensive_view')
        .select('organization_name')
        .eq('organization_id', organizationId)
        .single();

      // Create admin record in org_admins table
      const { error: adminError } = await supabase
        .from('org_admins')
        .insert({
          organization_id: organizationId,
          user_id: userId,
          admin_email: adminData.admin_email,
          admin_name: adminData.admin_name
        });

      if (adminError) {
        throw adminError;
      }

      // Set credentials for display
      const credentials: AdminCredentials = {
        email: adminData.admin_email,
        temporaryPassword: isNewUser ? tempPassword : undefined,
        adminId: organizationId,
        organizationName: orgData?.organization_name || 'Unknown',
        isNewUser: isNewUser
      };

      setAdminCredentials(credentials);
      toast.success('Administrator created successfully');
      
      // Refresh validation status
      await fetchValidationStatus();
      
      return true;
    } catch (error) {
      console.error('Error creating administrator:', error);
      toast.error('Failed to create administrator');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearAdminCredentials = () => {
    setAdminCredentials(null);
  };

  return {
    loading,
    validationStatus,
    adminCredentials,
    fetchValidationStatus,
    updateValidationStatus,
    createAdministrator,
    clearAdminCredentials
  };
};
