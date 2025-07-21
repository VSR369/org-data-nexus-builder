
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ValidationStatus {
  payment_approved: boolean;
  document_validated: boolean;
  admin_ready: boolean;
  workflow_complete: boolean;
  can_authorize_admin: boolean;
  validation_status: any;
}

export interface ValidationAction {
  type: 'payment' | 'document' | 'admin_authorization';
  status: string;
  reason?: string;
}

export interface AdminCredentials {
  email: string;
  temporaryPassword: string;
  adminId: string;
  organizationName: string;
  isNewUser: boolean;
}

// Generate strong password that meets Supabase requirements
const generateStrongPassword = (): string => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%&*';
  
  let password = '';
  // Ensure at least one of each type
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  
  // Fill remaining characters
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = 4; i < 12; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const useValidationWorkflow = (organizationId: string) => {
  const [loading, setLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | null>(null);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials | null>(null);

  const fetchValidationStatus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('check_validation_prerequisites', { org_id: organizationId });

      if (error) throw error;

      setValidationStatus(data as unknown as ValidationStatus);
      return data;
    } catch (error: any) {
      console.error('Error fetching validation status:', error);
      toast.error('Failed to fetch validation status');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateValidationStatus = async (action: ValidationAction) => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Authentication required');
        return false;
      }

      const { data, error } = await supabase
        .rpc('update_validation_status', {
          org_id: organizationId,
          validation_type: action.type,
          new_status: action.status,
          reason: action.reason,
          user_id: user.id
        });

      if (error) throw error;

      toast.success(`${action.type} validation ${action.status} successfully`);
      
      // Refresh validation status
      await fetchValidationStatus();
      
      return true;
    } catch (error: any) {
      console.error('Error updating validation status:', error);
      toast.error(`Failed to update ${action.type} validation`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createAdministrator = async (adminData: {
    admin_name: string;
    admin_email: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🚀 Starting administrator creation for:', adminData.admin_email);
      
      // Step 1: Check if admin already exists for this organization
      const { data: existingAdminInfo, error: checkError } = await supabase
        .rpc('get_organization_admin_info', {
          p_organization_id: organizationId
        });

      if (checkError) {
        console.error('Error checking existing admin:', checkError);
        toast.error(`Failed to check existing administrator: ${checkError.message}`);
        return false;
      }

      if ((existingAdminInfo as any)?.has_admin) {
        toast.error('An administrator already exists for this organization');
        return false;
      }

      // Step 2: Generate temporary password and attempt user signup
      const tempPassword = generateStrongPassword();
      let authUserId: string;
      let isNewUser = true;

      console.log('🔑 Attempting to create user with signup...');
      
      // Use regular signup instead of admin API
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.admin_email,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            admin_name: adminData.admin_name
          }
        }
      });

      if (authError) {
        // Handle case where user already exists
        if (authError.message?.includes('User already registered') || 
            authError.message?.includes('already been registered')) {
          console.log('👤 User already exists, this is okay for admin creation');
          
          // For existing users, we'll use a placeholder ID and let the backend handle it
          // The database function will need to handle existing users appropriately
          authUserId = 'existing-user-placeholder';
          isNewUser = false;
        } else {
          console.error('Signup error:', authError);
          toast.error(`Failed to create user account: ${authError.message}`);
          return false;
        }
      } else {
        if (!authData.user) {
          console.error('No user data returned from signup');
          toast.error('Failed to create user account: No user data returned');
          return false;
        }
        authUserId = authData.user.id;
        console.log('✅ User created successfully:', authUserId);
      }

      // Step 3: Create organization administrator record using the database function
      console.log('🏢 Creating organization administrator record...');
      
      const { data: adminResult, error: adminError } = await supabase
        .rpc('create_organization_admin', {
          p_organization_id: organizationId,
          p_admin_name: adminData.admin_name,
          p_admin_email: adminData.admin_email,
          p_user_id: authUserId === 'existing-user-placeholder' ? null : authUserId
        });

      if (adminError) {
        console.error('Error creating organization admin:', adminError);
        toast.error(`Failed to create organization administrator: ${adminError.message}`);
        return false;
      }

      if (!(adminResult as any)?.success) {
        console.error('Admin creation function failed:', adminResult);
        toast.error(`Failed to create organization administrator: ${(adminResult as any)?.message || 'Unknown error'}`);
        return false;
      }

      // Step 4: Store credentials for display
      setAdminCredentials({
        email: adminData.admin_email,
        temporaryPassword: isNewUser ? tempPassword : 'Login with existing password',
        adminId: (adminResult as any).admin_id,
        organizationName: (adminResult as any).organization_name,
        isNewUser: isNewUser
      });

      const successMessage = isNewUser 
        ? 'Organization administrator created successfully with new user account!'
        : 'Organization administrator role assigned to existing user account!';
      
      toast.success(successMessage);
      return true;

    } catch (error: any) {
      console.error('Unexpected error creating administrator:', error);
      toast.error('An unexpected error occurred while creating the administrator');
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
