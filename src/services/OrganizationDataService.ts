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
  
  // Payment details
  mem_payment_amount?: number;
  mem_payment_currency?: string;
  mem_payment_date?: string;
  mem_receipt_number?: string;
  mem_payment_method?: string;
  mem_payment_status?: string;
  selected_frequency?: string;
  current_frequency?: string;
  frequency_payments?: any;
  frequency_change_history?: any;
  total_payments_made?: number;
  last_payment_date?: string;
  
  // Tier and engagement details
  tier_features?: any;
  engagement_model_details?: any;
  pricing_locked?: boolean;
  engagement_locked?: boolean;
  platform_fee_percentage?: number;
  updated_platform_fee_percentage?: number;
  discount_percentage?: number;
  final_calculated_price?: number;
  
  // Terms acceptance
  mem_terms?: boolean;
  enm_terms?: boolean;
  terms_accepted?: boolean;
  
  // Workflow and timing
  tier_selected_at?: string;
  engagement_model_selected_at?: string;
  lock_date?: string;
  
  // Administrative flags
  has_user_account: boolean;
  has_engagement_record: boolean;
  overall_status: string;
  last_activity: string;
}

export interface ComprehensiveOrganizationData {
  organization: SolutionSeekerData;
  membership_fees: MembershipFee[];
  tier_configuration: TierConfiguration;
  engagement_model_details: EngagementModelDetails;
  pricing_configurations: PricingConfiguration[];
}

export interface MembershipFee {
  id: string;
  country: string;
  organization_type: string;
  entity_type: string;
  monthly_amount?: number;
  monthly_currency?: string;
  quarterly_amount?: number;
  quarterly_currency?: string;
  half_yearly_amount?: number;
  half_yearly_currency?: string;
  annual_amount?: number;
  annual_currency?: string;
  description?: string;
}

export interface TierConfiguration {
  tier_info: {
    name: string;
    description: string;
    level_order: number;
  };
  configurations: TierConfigDetail[];
}

export interface TierConfigDetail {
  country: string;
  currency: string;
  monthly_challenge_limit?: number;
  solutions_per_challenge: number;
  allows_overage: boolean;
  fixed_charge_per_challenge: number;
  support_type: string;
  support_level: string;
  support_availability: string;
  support_response_time: string;
  analytics_access: string;
  analytics_features: any[];
  analytics_dashboard_access: boolean;
  onboarding_type: string;
  onboarding_service_type: string;
  onboarding_resources: any[];
  workflow_template: string;
  workflow_customization_level: string;
  workflow_template_count: number;
}

export interface EngagementModelDetails {
  model_info: {
    name: string;
    description: string;
  };
  complexity_levels: ComplexityLevel[];
  platform_fee_formulas: PlatformFeeFormula[];
  subtypes: EngagementModelSubtype[];
}

export interface ComplexityLevel {
  name: string;
  description: string;
  level_order: number;
  consulting_fee_multiplier: number;
  management_fee_multiplier: number;
}

export interface PlatformFeeFormula {
  formula_name: string;
  description: string;
  formula_expression: string;
  base_consulting_fee: number;
  base_management_fee: number;
  platform_usage_fee_percentage: number;
  advance_payment_percentage: number;
  membership_discount_percentage: number;
  country: string;
  currency: string;
}

export interface EngagementModelSubtype {
  name: string;
  description: string;
  required_fields: any[];
  optional_fields: any[];
}

export interface PricingConfiguration {
  config_name: string;
  base_value: number;
  calculated_value: number;
  unit_symbol: string;
  currency_code: string;
  membership_discount: number;
  billing_frequency: string;
  effective_from: string;
  effective_to: string;
}

export interface AdminCreationData {
  admin_name: string;
  admin_email: string;
  contact_number?: string;
  admin_password_hash?: string;
  organization_id: string;
  organization_name?: string;
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
   * Get organization admin details
   */
  static async getOrganizationAdmin(organizationId: string): Promise<ExistingAdmin | null> {
    try {
      const { data, error } = await supabase
        .from('organization_administrators')
        .select('id, admin_name, admin_email, contact_number, is_active, created_at')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found
          return null;
        }
        throw error;
      }

      return data as ExistingAdmin;
    } catch (error) {
      console.error('Error fetching organization admin:', error);
      throw error;
    }
  }

  /**
   * Update an existing organization administrator
   */
  static async updateOrganizationAdmin(adminId: string, updates: Partial<AdminCreationData>): Promise<void> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        throw new Error('User not authenticated');
      }

      // Check if user is platform admin
      const { data: isPlatformAdmin, error: checkError } = await supabase
        .rpc('is_platform_admin');

      if (checkError) {
        console.error('Error checking platform admin status:', checkError);
        throw new Error('Failed to verify admin permissions');
      }

      if (!isPlatformAdmin) {
        throw new Error('Only platform administrators can update organization admins');
      }

      const { error } = await supabase
        .from('organization_administrators')
        .update({
          admin_name: updates.admin_name,
          admin_email: updates.admin_email,
          contact_number: updates.contact_number,
          admin_password_hash: updates.admin_password_hash,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminId);

      if (error) {
        console.error('Error updating organization admin:', error);
        throw new Error(`Failed to update organization admin: ${error.message}`);
      }

      // Log the admin update in audit table
      try {
        await supabase
          .from('admin_creation_audit')
          .insert({
            organization_id: updates.organization_id || '',
            organization_name: updates.organization_name || 'Unknown',
            admin_name: updates.admin_name || '',
            admin_email: updates.admin_email || '',
            created_admin_id: adminId,
            created_by: currentUser.user.id,
            action_type: 'updated',
            notes: 'Organization administrator updated via platform'
          });
      } catch (auditError) {
        console.warn('Failed to log admin update audit:', auditError);
      }
    } catch (error) {
      console.error('Error updating organization admin:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive organization data with all details
   */
  static async getComprehensiveOrganizationData(organizationId: string): Promise<ComprehensiveOrganizationData> {
    try {
      const { data, error } = await supabase
        .rpc('get_comprehensive_organization_data', { org_id: organizationId });

      if (error) throw error;
      
      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(data.error as string);
      }

      return data as unknown as ComprehensiveOrganizationData;
    } catch (error) {
      console.error('Error fetching comprehensive organization data:', error);
      throw error;
    }
  }

  /**
   * Create a new organization administrator
   */
  static async createOrganizationAdmin(adminData: AdminCreationData): Promise<string> {
    try {
      // First, check if current user is a platform admin
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        throw new Error('User not authenticated');
      }

      // Check if user is platform admin using the new function
      const { data: isPlatformAdmin, error: checkError } = await supabase
        .rpc('is_platform_admin');

      if (checkError) {
        console.error('Error checking platform admin status:', checkError);
        throw new Error('Failed to verify admin permissions');
      }

      if (!isPlatformAdmin) {
        throw new Error('Only platform administrators can create organization admins');
      }

      // Create organization administrator
      const { data, error } = await supabase
        .from('organization_administrators')
        .insert({
          organization_id: adminData.organization_id,
          admin_name: adminData.admin_name,
          admin_email: adminData.admin_email,
          contact_number: adminData.contact_number,
          admin_password_hash: adminData.admin_password_hash,
          role_type: 'organization_admin',
          is_active: true,
          created_by: currentUser.user.id
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating organization admin:', error);
        throw new Error(`Failed to create organization admin: ${error.message}`);
      }

      // Log the admin creation in audit table
      try {
        await supabase
          .from('admin_creation_audit')
          .insert({
            organization_id: adminData.organization_id,
            organization_name: adminData.organization_name || 'Unknown',
            admin_name: adminData.admin_name,
            admin_email: adminData.admin_email,
            created_admin_id: data.id,
            created_by: currentUser.user.id,
            action_type: 'created',
            notes: 'Organization administrator created via platform'
          });
      } catch (auditError) {
        console.warn('Failed to log admin creation audit:', auditError);
        // Don't fail the whole operation if audit logging fails
      }

      return data.id;
    } catch (error) {
      console.error('Error creating organization admin:', error);
      throw error;
    }
  }
}
