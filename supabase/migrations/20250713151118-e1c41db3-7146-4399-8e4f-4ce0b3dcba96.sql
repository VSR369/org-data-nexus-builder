-- Step 1: Clean up existing duplicates by keeping the most recent version
-- Create a temporary table with deduplicated data
CREATE TEMP TABLE pricing_configs_dedup AS
SELECT DISTINCT ON (country, organization_type, engagement_model, membership_status)
  id,
  config_id,
  country,
  organization_type,
  engagement_model,
  entity_type,
  membership_status,
  currency,
  quarterly_fee,
  half_yearly_fee,
  annual_fee,
  platform_fee_percentage,
  discount_percentage,
  internal_paas_pricing,
  version,
  created_at,
  updated_at
FROM pricing_configs
ORDER BY country, organization_type, engagement_model, membership_status, created_at DESC;

-- Delete all existing records
DELETE FROM pricing_configs;

-- Insert the deduplicated records back
INSERT INTO pricing_configs (
  id, config_id, country, organization_type, engagement_model, entity_type,
  membership_status, currency, quarterly_fee, half_yearly_fee, annual_fee,
  platform_fee_percentage, discount_percentage, internal_paas_pricing,
  version, created_at, updated_at
)
SELECT 
  id, config_id, country, organization_type, engagement_model, entity_type,
  membership_status, currency, quarterly_fee, half_yearly_fee, annual_fee,
  platform_fee_percentage, discount_percentage, internal_paas_pricing,
  version, created_at, updated_at
FROM pricing_configs_dedup;

-- Step 2: Add unique constraint to prevent future duplicates
ALTER TABLE pricing_configs 
ADD CONSTRAINT unique_pricing_config 
UNIQUE (country, organization_type, engagement_model, membership_status);

-- Step 3: Create index for better query performance
CREATE INDEX idx_pricing_configs_business_key 
ON pricing_configs (country, organization_type, engagement_model, membership_status);