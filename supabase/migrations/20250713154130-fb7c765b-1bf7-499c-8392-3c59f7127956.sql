-- Phase 1: Fix Data Model Relationships
-- Add foreign key ID columns to master_seeker_membership_fees
ALTER TABLE master_seeker_membership_fees 
ADD COLUMN country_id UUID REFERENCES master_countries(id),
ADD COLUMN organization_type_id UUID REFERENCES master_organization_types(id),
ADD COLUMN entity_type_id UUID REFERENCES master_entity_types(id);

-- Update existing records in master_seeker_membership_fees to use foreign key IDs
UPDATE master_seeker_membership_fees 
SET country_id = (SELECT id FROM master_countries WHERE name = master_seeker_membership_fees.country)
WHERE country_id IS NULL;

UPDATE master_seeker_membership_fees 
SET organization_type_id = (SELECT id FROM master_organization_types WHERE name = master_seeker_membership_fees.organization_type)
WHERE organization_type_id IS NULL;

UPDATE master_seeker_membership_fees 
SET entity_type_id = (SELECT id FROM master_entity_types WHERE name = master_seeker_membership_fees.entity_type)
WHERE entity_type_id IS NULL;

-- Add foreign key ID columns to pricing_configs
ALTER TABLE pricing_configs 
ADD COLUMN country_id UUID REFERENCES master_countries(id),
ADD COLUMN organization_type_id UUID REFERENCES master_organization_types(id),
ADD COLUMN entity_type_id UUID REFERENCES master_entity_types(id),
ADD COLUMN engagement_model_id UUID REFERENCES master_engagement_models(id);

-- Update existing records in pricing_configs to use foreign key IDs
UPDATE pricing_configs 
SET country_id = (SELECT id FROM master_countries WHERE name = pricing_configs.country)
WHERE country_id IS NULL;

UPDATE pricing_configs 
SET organization_type_id = (SELECT id FROM master_organization_types WHERE name = pricing_configs.organization_type)
WHERE organization_type_id IS NULL;

UPDATE pricing_configs 
SET entity_type_id = (SELECT id FROM master_entity_types WHERE name = pricing_configs.entity_type)
WHERE entity_type_id IS NULL;

UPDATE pricing_configs 
SET engagement_model_id = (SELECT id FROM master_engagement_models WHERE name = pricing_configs.engagement_model)
WHERE engagement_model_id IS NULL;

-- Make the foreign key columns NOT NULL after data migration
ALTER TABLE master_seeker_membership_fees 
ALTER COLUMN country_id SET NOT NULL,
ALTER COLUMN organization_type_id SET NOT NULL,
ALTER COLUMN entity_type_id SET NOT NULL;

ALTER TABLE pricing_configs 
ALTER COLUMN country_id SET NOT NULL,
ALTER COLUMN organization_type_id SET NOT NULL,
ALTER COLUMN entity_type_id SET NOT NULL,
ALTER COLUMN engagement_model_id SET NOT NULL;

-- Create database functions for data lookup
CREATE OR REPLACE FUNCTION get_membership_fees_for_organization(
  org_country_id UUID,
  org_type_id UUID,
  org_entity_type_id UUID
) RETURNS TABLE (
  id UUID,
  monthly_amount NUMERIC,
  monthly_currency TEXT,
  quarterly_amount NUMERIC,
  quarterly_currency TEXT,
  half_yearly_amount NUMERIC,
  half_yearly_currency TEXT,
  annual_amount NUMERIC,
  annual_currency TEXT,
  description TEXT
) LANGUAGE SQL STABLE AS $$
  SELECT 
    msf.id,
    msf.monthly_amount,
    msf.monthly_currency,
    msf.quarterly_amount,
    msf.quarterly_currency,
    msf.half_yearly_amount,
    msf.half_yearly_currency,
    msf.annual_amount,
    msf.annual_currency,
    msf.description
  FROM master_seeker_membership_fees msf
  WHERE msf.country_id = org_country_id
    AND msf.organization_type_id = org_type_id
    AND msf.entity_type_id = org_entity_type_id;
$$;

CREATE OR REPLACE FUNCTION get_pricing_configs_for_organization(
  org_country_id UUID,
  org_type_id UUID,
  org_entity_type_id UUID,
  engagement_model_id UUID DEFAULT NULL
) RETURNS TABLE (
  id UUID,
  config_id TEXT,
  engagement_model_name TEXT,
  membership_status TEXT,
  quarterly_fee NUMERIC,
  half_yearly_fee NUMERIC,
  annual_fee NUMERIC,
  currency TEXT,
  platform_fee_percentage NUMERIC,
  discount_percentage NUMERIC,
  internal_paas_pricing JSONB
) LANGUAGE SQL STABLE AS $$
  SELECT 
    pc.id,
    pc.config_id,
    em.name as engagement_model_name,
    pc.membership_status,
    pc.quarterly_fee,
    pc.half_yearly_fee,
    pc.annual_fee,
    pc.currency,
    pc.platform_fee_percentage,
    pc.discount_percentage,
    pc.internal_paas_pricing
  FROM pricing_configs pc
  JOIN master_engagement_models em ON pc.engagement_model_id = em.id
  WHERE pc.country_id = org_country_id
    AND pc.organization_type_id = org_type_id
    AND pc.entity_type_id = org_entity_type_id
    AND (engagement_model_id IS NULL OR pc.engagement_model_id = engagement_model_id);
$$;

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_membership_fees_org_lookup ON master_seeker_membership_fees(country_id, organization_type_id, entity_type_id);
CREATE INDEX IF NOT EXISTS idx_pricing_configs_org_lookup ON pricing_configs(country_id, organization_type_id, entity_type_id, engagement_model_id);

-- Create a view for organization context with master data names for easier debugging
CREATE OR REPLACE VIEW organization_context AS
SELECT 
  o.id,
  o.user_id,
  o.organization_name,
  o.organization_id,
  o.contact_person_name,
  o.email,
  o.phone_number,
  o.address,
  o.website,
  c.name as country_name,
  c.id as country_id,
  ot.name as organization_type_name,
  ot.id as organization_type_id,
  et.name as entity_type_name,
  et.id as entity_type_id,
  ins.name as industry_segment_name,
  ins.id as industry_segment_id
FROM organizations o
LEFT JOIN master_countries c ON o.country_id = c.id
LEFT JOIN master_organization_types ot ON o.organization_type_id = ot.id
LEFT JOIN master_entity_types et ON o.entity_type_id = et.id
LEFT JOIN master_industry_segments ins ON o.industry_segment_id = ins.id;