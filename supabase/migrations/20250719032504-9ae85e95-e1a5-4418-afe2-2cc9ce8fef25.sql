
-- Phase 1: Add missing foreign key constraints and database integrity enhancements
-- Add foreign key constraints to organizations table
ALTER TABLE organizations 
ADD CONSTRAINT fk_organizations_country 
FOREIGN KEY (country_id) REFERENCES master_countries(id),
ADD CONSTRAINT fk_organizations_organization_type 
FOREIGN KEY (organization_type_id) REFERENCES master_organization_types(id),
ADD CONSTRAINT fk_organizations_entity_type 
FOREIGN KEY (entity_type_id) REFERENCES master_entity_types(id),
ADD CONSTRAINT fk_organizations_industry_segment 
FOREIGN KEY (industry_segment_id) REFERENCES master_industry_segments(id);

-- Add foreign key constraints to engagement_activations table
ALTER TABLE engagement_activations 
ADD CONSTRAINT fk_engagement_activations_user 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_organizations_lookup 
ON organizations(organization_id, user_id);

CREATE INDEX IF NOT EXISTS idx_engagement_activations_user 
ON engagement_activations(user_id, membership_status);

CREATE INDEX IF NOT EXISTS idx_organizations_country_type 
ON organizations(country_id, organization_type_id, entity_type_id);

-- Add business rule constraints
ALTER TABLE organizations 
ADD CONSTRAINT chk_organization_id_format 
CHECK (organization_id ~ '^ORG-[A-Z0-9]{8}$');

ALTER TABLE engagement_activations 
ADD CONSTRAINT chk_membership_status_valid 
CHECK (membership_status IN ('Active', 'Inactive', 'Pending', 'Suspended'));

-- Create materialized view for organization comprehensive data
CREATE MATERIALIZED VIEW organization_comprehensive_data AS
SELECT 
  o.id as organization_pk_id,
  o.organization_id,
  o.user_id,
  o.organization_name,
  o.contact_person_name,
  o.email,
  o.phone_number,
  o.address,
  o.website,
  c.name as country_name,
  c.code as country_code,
  ot.name as organization_type_name,
  et.name as entity_type_name,
  ins.name as industry_segment_name,
  ea.membership_status,
  ea.pricing_tier,
  ea.engagement_model,
  ea.mem_payment_amount,
  ea.mem_payment_currency,
  ea.mem_payment_status,
  ea.selected_frequency,
  ea.final_calculated_price,
  ea.discount_percentage,
  ea.created_at as registration_date,
  ea.updated_at as last_updated
FROM organizations o
LEFT JOIN master_countries c ON o.country_id = c.id
LEFT JOIN master_organization_types ot ON o.organization_type_id = ot.id
LEFT JOIN master_entity_types et ON o.entity_type_id = et.id
LEFT JOIN master_industry_segments ins ON o.industry_segment_id = ins.id
LEFT JOIN engagement_activations ea ON o.user_id = ea.user_id AND ea.membership_status = 'Active';

-- Create index on materialized view
CREATE UNIQUE INDEX idx_org_comp_data_org_id 
ON organization_comprehensive_data(organization_id);

CREATE INDEX idx_org_comp_data_user_id 
ON organization_comprehensive_data(user_id);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_organization_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY organization_comprehensive_data;
END;
$$;

-- Create comprehensive data retrieval function
CREATE OR REPLACE FUNCTION get_organization_comprehensive_data(org_identifier text)
RETURNS TABLE (
  organization_pk_id uuid,
  organization_id text,
  user_id uuid,
  organization_name text,
  contact_person_name text,
  email text,
  phone_number text,
  address text,
  website text,
  country_name text,
  country_code text,
  organization_type_name text,
  entity_type_name text,
  industry_segment_name text,
  membership_status text,
  pricing_tier text,
  engagement_model text,
  payment_amount numeric,
  payment_currency text,
  payment_status text,
  selected_frequency text,
  final_calculated_price numeric,
  discount_percentage numeric,
  registration_date timestamp with time zone,
  last_updated timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ocd.organization_pk_id,
    ocd.organization_id,
    ocd.user_id,
    ocd.organization_name,
    ocd.contact_person_name,
    ocd.email,
    ocd.phone_number,
    ocd.address,
    ocd.website,
    ocd.country_name,
    ocd.country_code,
    ocd.organization_type_name,
    ocd.entity_type_name,
    ocd.industry_segment_name,
    ocd.membership_status,
    ocd.pricing_tier,
    ocd.engagement_model,
    ocd.mem_payment_amount,
    ocd.mem_payment_currency,
    ocd.mem_payment_status,
    ocd.selected_frequency,
    ocd.final_calculated_price,
    ocd.discount_percentage,
    ocd.registration_date,
    ocd.last_updated
  FROM organization_comprehensive_data ocd
  WHERE ocd.organization_id = org_identifier 
     OR ocd.user_id::text = org_identifier;
END;
$$;

-- Clean up legacy data and constraints
-- Remove references to deprecated engagement models
UPDATE engagement_activations 
SET engagement_model = 'Marketplace' 
WHERE engagement_model IN ('Platform as a Service', 'Market Place & Aggregator');

-- Update master data to remove deprecated models
DELETE FROM master_engagement_models 
WHERE name IN ('Platform as a Service', 'Market Place & Aggregator');

-- Add audit logging trigger
CREATE OR REPLACE FUNCTION audit_organization_changes()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO organization_audit_log (
      organization_id,
      user_id,
      action,
      old_data,
      new_data,
      changed_at,
      changed_by
    ) VALUES (
      NEW.organization_id,
      NEW.user_id,
      'UPDATE',
      row_to_json(OLD),
      row_to_json(NEW),
      now(),
      auth.uid()
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO organization_audit_log (
      organization_id,
      user_id,
      action,
      new_data,
      changed_at,
      changed_by
    ) VALUES (
      NEW.organization_id,
      NEW.user_id,
      'INSERT',
      row_to_json(NEW),
      now(),
      auth.uid()
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Create audit log table
CREATE TABLE IF NOT EXISTS organization_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id text NOT NULL,
  user_id uuid,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone DEFAULT now(),
  changed_by uuid
);

-- Apply audit trigger
CREATE TRIGGER organization_audit_trigger
  AFTER INSERT OR UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION audit_organization_changes();
