-- Phase 1 Continued: Add database functions, indexes, and views

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