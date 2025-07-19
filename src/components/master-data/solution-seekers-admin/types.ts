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

export interface AdminRecord {
  id: string;
  organization_id: string;
  admin_name: string;
  admin_email: string;
  contact_number?: string;
  role_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface AuditLogEntry {
  id: string;
  created_admin_id: string;
  created_by: string;
  organization_id: string;
  organization_name: string;
  admin_name: string;
  admin_email: string;
  action_type: 'created' | 'updated' | 'activated' | 'deactivated';
  notes?: string;
  created_at: string;
}