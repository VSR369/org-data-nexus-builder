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

export interface ExistingAdmin {
  id: string;
  admin_name: string;
  admin_email: string;
  contact_number?: string;
  is_active: boolean;
  created_at: string;
}

export interface OrganizationSummary {
  organization: SolutionSeekerData;
  existing_admin?: ExistingAdmin;
  can_create_admin: boolean;
}

export interface AdminCreationData {
  admin_name: string;
  admin_email: string;
  contact_number?: string;
  admin_password_hash?: string;
  organization_id: string;
  organization_name?: string;
}
