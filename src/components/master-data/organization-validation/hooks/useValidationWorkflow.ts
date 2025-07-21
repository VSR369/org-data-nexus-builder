
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
  password: string;
  userId: string;
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
  }) => {
    try {
      setLoading(true);
      
      // Get current user (platform admin)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Platform admin authentication required');
        return false;
      }

      console.log('🔐 Starting admin creation for:', adminData.admin_email);

      // Generate strong password that meets Supabase requirements
      const tempPassword = generateStrongPassword();
      
      console.log('🔐 Creating Supabase Auth user for admin:', adminData.admin_email);
      console.log('🔧 Using password length:', tempPassword.length);
      
      // Create Supabase Auth user with proper configuration for development
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.admin_email,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            admin_name: adminData.admin_name,
            organization_id: organizationId,
            created_by_platform_admin: user.id
          }
        }
      });

      if (authError) {
        console.error('❌ Error creating auth user:', authError);
        throw new Error(`Failed to create auth user: ${authError.message}`);
      }

      if (!authData?.user) {
        throw new Error('Failed to create auth user - no user data returned');
      }

      console.log('✅ Auth user created successfully:', authData.user.id);

      // Insert administrator record into database
      const { error: dbError } = await supabase
        .from('organization_administrators')
        .insert({
          organization_id: organizationId,
          user_id: authData.user.id,
          admin_name: adminData.admin_name,
          admin_email: adminData.admin_email,
          role_type: 'admin',
          is_active: true,
          created_by: user.id
        });

      if (dbError) {
        console.error('❌ Error inserting admin record:', dbError);
        throw dbError;
      }

      console.log('✅ Administrator record created in database');

      // Update validation status to authorized
      await updateValidationStatus({
        type: 'admin_authorization',
        status: 'authorized',
        reason: `Administrator account created for ${adminData.admin_name}`
      });

      // Store credentials for display
      setAdminCredentials({
        email: adminData.admin_email,
        password: tempPassword,
        userId: authData.user.id
      });

      toast.success('Administrator account created successfully! Check credentials below.');
      
      return true;
    } catch (error: any) {
      console.error('❌ Error creating administrator:', error);
      toast.error(`Failed to create administrator account: ${error.message}`);
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
