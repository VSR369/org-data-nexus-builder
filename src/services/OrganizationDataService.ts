import { supabase } from "@/integrations/supabase/client";

export interface SolutionSeekerData {
  id: string;
  organization_id: string;
  organization_name: string;
  contact_person_name: string;
  email: string;
  phone_number?: string;
  country_code?: string;
  address?: string;
  website?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  
  // Organization classification
  organization_type?: string;
  entity_type?: string;
  country?: string;
  industry_segment?: string;
  
  // Membership and status information
  membership_status: string;
  activation_status: string;
  pricing_tier?: string;
  engagement_model?: string;
  payment_simulation_status?: string;
  workflow_step?: string;
  workflow_completed?: boolean;
  
  // Administrative flags
  has_user_account: boolean;
  has_engagement_record: boolean;
  overall_status: string;
  last_activity: string;
}

export interface AdminCreationData {
  admin_name: string;
  admin_email: string;
  contact_number?: string;
  admin_password_hash?: string;
  organization_id: string;
}

export interface ExistingAdmin {
  id: string;
  admin_name: string;
  admin_email: string;
  is_active: boolean;
  created_at: string;
}

export interface OrganizationSummary {
  organization: SolutionSeekerData;
  existing_admin?: ExistingAdmin;
  can_create_admin: boolean;
}

export class OrganizationDataService {
  /**
   * Get all solution seekers with comprehensive data
   */
  static async getAllSolutionSeekers(): Promise<SolutionSeekerData[]> {
    try {
      const { data, error } = await supabase
        .from('solution_seekers_comprehensive_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching solution seekers:', error);
      throw error;
    }
  }

  /**
   * Get a specific solution seeker for admin creation preview
   */
  static async getSeekerForAdminCreation(organizationId: string): Promise<OrganizationSummary> {
    try {
      const { data, error } = await supabase
        .rpc('get_organization_admin_summary', { org_id: organizationId });

      if (error) throw error;
      
      // Type assertion for the RPC response
      const result = data as any;
      if (result?.error) {
        throw new Error(result.error);
      }

      return result as OrganizationSummary;
    } catch (error) {
      console.error('Error fetching organization summary:', error);
      throw error;
    }
  }

  /**
   * Create a new organization administrator
   */
  static async createOrganizationAdmin(adminData: AdminCreationData): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('organization_administrators')
        .insert({
          organization_id: adminData.organization_id,
          admin_name: adminData.admin_name,
          admin_email: adminData.admin_email,
          contact_number: adminData.contact_number,
          admin_password_hash: adminData.admin_password_hash,
          role_type: 'organization_admin',
          is_active: true
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating organization admin:', error);
      throw error;
    }
  }
}