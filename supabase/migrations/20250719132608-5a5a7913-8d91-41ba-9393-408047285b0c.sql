-- Create comprehensive view for solution seekers data (corrected)
CREATE OR REPLACE VIEW solution_seekers_comprehensive_view AS
SELECT 
  o.id,
  o.organization_id,
  o.organization_name,
  o.contact_person_name,
  o.email,
  o.phone_number,
  o.country_code,
  o.address,
  o.website,
  o.user_id,
  o.created_at,
  o.updated_at,
  
  -- Organization classification
  ot.name as organization_type,
  et.name as entity_type,
  c.name as country,
  c.currency_code as country_currency,
  ist.name as industry_segment,
  
  -- Membership and status information
  COALESCE(ea.membership_status, 'Not Active') as membership_status,
  COALESCE(ea.activation_status, 'Pending') as activation_status,
  ea.pricing_tier,
  ea.engagement_model,
  ea.payment_simulation_status,
  ea.workflow_step,
  ea.workflow_completed,
  
  -- Administrative flags
  CASE WHEN o.user_id IS NOT NULL THEN true ELSE false END as has_user_account,
  CASE WHEN ea.id IS NOT NULL THEN true ELSE false END as has_engagement_record,
  
  -- Computed status fields
  CASE 
    WHEN ea.activation_status = 'Activated' AND ea.membership_status != 'Not Active' THEN 'Active Member'
    WHEN ea.activation_status = 'Pending' THEN 'Pending Activation'
    WHEN o.user_id IS NOT NULL THEN 'Registered - No Engagement'
    ELSE 'Registration Only'
  END as overall_status,
  
  -- Last activity timestamp
  GREATEST(o.updated_at, COALESCE(ea.updated_at, o.updated_at)) as last_activity

FROM organizations o
LEFT JOIN master_organization_types ot ON o.organization_type_id = ot.id
LEFT JOIN master_entity_types et ON o.entity_type_id = et.id
LEFT JOIN master_countries c ON o.country_id = c.id
LEFT JOIN master_industry_segments ist ON o.industry_segment_id = ist.id
LEFT JOIN engagement_activations ea ON o.user_id = ea.user_id
ORDER BY o.created_at DESC;

-- Create administrator roles table for proper role management
CREATE TABLE IF NOT EXISTS organization_administrators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL REFERENCES organizations(organization_id),
  user_id UUID REFERENCES auth.users(id),
  admin_name TEXT NOT NULL,
  admin_email TEXT NOT NULL UNIQUE,
  admin_password_hash TEXT,
  contact_number TEXT,
  role_type TEXT DEFAULT 'organization_admin' CHECK (role_type IN ('organization_admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on administrator roles table
ALTER TABLE organization_administrators ENABLE ROW LEVEL SECURITY;

-- Create policies for administrator roles
CREATE POLICY "Super admins can view all administrators" 
ON organization_administrators 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM organization_administrators WHERE role_type = 'super_admin' AND is_active = true));

CREATE POLICY "Super admins can create administrators" 
ON organization_administrators 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM organization_administrators WHERE role_type = 'super_admin' AND is_active = true));

CREATE POLICY "Super admins can update administrators" 
ON organization_administrators 
FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM organization_administrators WHERE role_type = 'super_admin' AND is_active = true));

CREATE POLICY "Organization admins can view their own record" 
ON organization_administrators 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create audit log table for admin account creation
CREATE TABLE IF NOT EXISTS admin_creation_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_admin_id UUID NOT NULL REFERENCES organization_administrators(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  organization_id TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('created', 'updated', 'activated', 'deactivated')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE admin_creation_audit ENABLE ROW LEVEL SECURITY;

-- Create policy for audit log
CREATE POLICY "Super admins can view audit logs" 
ON admin_creation_audit 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM organization_administrators WHERE role_type = 'super_admin' AND is_active = true));

-- Create trigger for updated_at on administrator roles
CREATE TRIGGER update_organization_administrators_updated_at
BEFORE UPDATE ON organization_administrators
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get organization summary for admin creation
CREATE OR REPLACE FUNCTION get_organization_admin_summary(org_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'organization', row_to_json(org_data),
    'existing_admin', admin_data,
    'can_create_admin', CASE WHEN admin_data IS NULL THEN true ELSE false END
  )
  INTO result
  FROM (
    SELECT * FROM solution_seekers_comprehensive_view 
    WHERE organization_id = org_id
  ) org_data
  LEFT JOIN (
    SELECT jsonb_build_object(
      'id', id,
      'admin_name', admin_name,
      'admin_email', admin_email,
      'is_active', is_active,
      'created_at', created_at
    ) as admin_data
    FROM organization_administrators 
    WHERE organization_id = org_id AND is_active = true
  ) admin_info ON true;
  
  RETURN COALESCE(result, jsonb_build_object('error', 'Organization not found'));
END;
$$;