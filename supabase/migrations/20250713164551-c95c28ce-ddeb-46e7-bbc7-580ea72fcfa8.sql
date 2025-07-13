-- Phase 1: Database Restructuring - Clean slate and new structure
-- Remove hardcoded data and create flexible pricing system

-- First, clean up existing pricing_configs
TRUNCATE TABLE pricing_configs;

-- Add proper unique constraints to pricing_configs
ALTER TABLE pricing_configs DROP CONSTRAINT IF EXISTS unique_pricing_config;
ALTER TABLE pricing_configs ADD CONSTRAINT unique_pricing_config 
UNIQUE (country_id, organization_type_id, entity_type_id, engagement_model_id, membership_status);

-- Create pricing_templates table for reusable base configurations
CREATE TABLE IF NOT EXISTS pricing_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL UNIQUE,
  engagement_model_id UUID NOT NULL REFERENCES master_engagement_models(id),
  engagement_model TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('marketplace', 'paas')),
  base_platform_fee_percentage NUMERIC,
  base_quarterly_fee NUMERIC,
  base_half_yearly_fee NUMERIC, 
  base_annual_fee NUMERIC,
  base_currency TEXT DEFAULT 'INR',
  internal_paas_pricing JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by TEXT,
  description TEXT
);

-- Create pricing_rules table for business logic
CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL UNIQUE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('member_discount', 'org_multiplier', 'country_adjustment')),
  target_field TEXT NOT NULL, -- 'platform_fee', 'quarterly_fee', etc.
  condition_type TEXT NOT NULL CHECK (condition_type IN ('organization_type', 'membership_status', 'country')),
  condition_value TEXT NOT NULL,
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('percentage', 'fixed_amount', 'multiplier')),
  adjustment_value NUMERIC NOT NULL,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by TEXT,
  description TEXT
);

-- Create pricing_overrides table for specific customizations
CREATE TABLE IF NOT EXISTS pricing_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES master_countries(id),
  organization_type_id UUID REFERENCES master_organization_types(id),
  entity_type_id UUID REFERENCES master_entity_types(id),
  engagement_model_id UUID REFERENCES master_engagement_models(id),
  membership_status TEXT CHECK (membership_status IN ('Member', 'Non-Member')),
  override_field TEXT NOT NULL, -- 'platform_fee_percentage', 'quarterly_fee', etc.
  override_value NUMERIC NOT NULL,
  override_currency TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by TEXT,
  description TEXT,
  UNIQUE(country_id, organization_type_id, entity_type_id, engagement_model_id, membership_status, override_field)
);

-- Insert base pricing templates (admin-configurable, not hardcoded)
INSERT INTO pricing_templates (
  template_name, 
  engagement_model_id, 
  engagement_model, 
  template_type,
  base_platform_fee_percentage,
  base_quarterly_fee,
  base_half_yearly_fee,
  base_annual_fee,
  base_currency,
  internal_paas_pricing,
  description
)
SELECT 
  'Marketplace Standard',
  em.id,
  em.name,
  'marketplace',
  6.0, -- Base platform fee
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  'Standard marketplace configuration'
FROM master_engagement_models em 
WHERE em.name IN ('Market Place', 'Aggregator', 'Market Place & Aggregator')
ON CONFLICT (template_name) DO NOTHING;

INSERT INTO pricing_templates (
  template_name,
  engagement_model_id,
  engagement_model,
  template_type,
  base_platform_fee_percentage,
  base_quarterly_fee,
  base_half_yearly_fee,
  base_annual_fee,
  base_currency,
  internal_paas_pricing,
  description
)
SELECT 
  'PaaS Standard',
  em.id,
  em.name,
  'paas',
  NULL,
  5000.00, -- Base quarterly fee
  9000.00, -- Base half-yearly fee
  16000.00, -- Base annual fee
  'INR',
  '{"basic": {"monthly": 500, "annual": 5000}, "standard": {"monthly": 1000, "annual": 10000}, "premium": {"monthly": 2000, "annual": 20000}}'::jsonb,
  'Standard PaaS configuration'
FROM master_engagement_models em 
WHERE em.name = 'Platform as a Service'
ON CONFLICT (template_name) DO NOTHING;

-- Insert business rules (admin-configurable)
INSERT INTO pricing_rules (
  rule_name,
  rule_type,
  target_field,
  condition_type,
  condition_value,
  adjustment_type,
  adjustment_value,
  description
) VALUES
('MSME Platform Fee Discount', 'org_multiplier', 'platform_fee_percentage', 'organization_type', 'MSME', 'multiplier', 0.8, 'MSME organizations get 20% discount on platform fees'),
('MSME PaaS Fee Discount', 'org_multiplier', 'quarterly_fee', 'organization_type', 'MSME', 'multiplier', 0.5, 'MSME organizations get 50% discount on PaaS fees'),
('MSME PaaS Half-Yearly Discount', 'org_multiplier', 'half_yearly_fee', 'organization_type', 'MSME', 'multiplier', 0.5, 'MSME organizations get 50% discount on half-yearly PaaS fees'),
('MSME PaaS Annual Discount', 'org_multiplier', 'annual_fee', 'organization_type', 'MSME', 'multiplier', 0.5, 'MSME organizations get 50% discount on annual PaaS fees'),
('Member Discount', 'member_discount', 'all_fees', 'membership_status', 'Member', 'percentage', 10.0, 'Members get 10% discount on all fees')
ON CONFLICT (rule_name) DO NOTHING;

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_pricing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pricing_templates_updated_at 
  BEFORE UPDATE ON pricing_templates 
  FOR EACH ROW EXECUTE FUNCTION update_pricing_updated_at();

CREATE TRIGGER pricing_rules_updated_at 
  BEFORE UPDATE ON pricing_rules 
  FOR EACH ROW EXECUTE FUNCTION update_pricing_updated_at();

CREATE TRIGGER pricing_overrides_updated_at 
  BEFORE UPDATE ON pricing_overrides 
  FOR EACH ROW EXECUTE FUNCTION update_pricing_updated_at();

-- Add RLS policies
ALTER TABLE pricing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_overrides ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (admin-only in production)
CREATE POLICY "Allow all operations on pricing_templates" ON pricing_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on pricing_rules" ON pricing_rules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on pricing_overrides" ON pricing_overrides FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pricing_templates_engagement_model ON pricing_templates(engagement_model_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_condition ON pricing_rules(condition_type, condition_value);
CREATE INDEX IF NOT EXISTS idx_pricing_overrides_lookup ON pricing_overrides(country_id, organization_type_id, entity_type_id, engagement_model_id);