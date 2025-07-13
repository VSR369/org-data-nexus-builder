-- Phase 1: Fix Data Model Relationships (Corrected)
-- Add foreign key ID columns to master_seeker_membership_fees (nullable first)
ALTER TABLE master_seeker_membership_fees 
ADD COLUMN IF NOT EXISTS country_id UUID REFERENCES master_countries(id),
ADD COLUMN IF NOT EXISTS organization_type_id UUID REFERENCES master_organization_types(id),
ADD COLUMN IF NOT EXISTS entity_type_id UUID REFERENCES master_entity_types(id);

-- Update existing records in master_seeker_membership_fees to use foreign key IDs
UPDATE master_seeker_membership_fees 
SET country_id = (SELECT id FROM master_countries WHERE name = master_seeker_membership_fees.country)
WHERE country_id IS NULL AND country IS NOT NULL;

UPDATE master_seeker_membership_fees 
SET organization_type_id = (SELECT id FROM master_organization_types WHERE name = master_seeker_membership_fees.organization_type)
WHERE organization_type_id IS NULL AND organization_type IS NOT NULL;

UPDATE master_seeker_membership_fees 
SET entity_type_id = (SELECT id FROM master_entity_types WHERE name = master_seeker_membership_fees.entity_type)
WHERE entity_type_id IS NULL AND entity_type IS NOT NULL;

-- Add foreign key ID columns to pricing_configs (nullable first)
ALTER TABLE pricing_configs 
ADD COLUMN IF NOT EXISTS country_id UUID REFERENCES master_countries(id),
ADD COLUMN IF NOT EXISTS organization_type_id UUID REFERENCES master_organization_types(id),
ADD COLUMN IF NOT EXISTS entity_type_id UUID REFERENCES master_entity_types(id),
ADD COLUMN IF NOT EXISTS engagement_model_id UUID REFERENCES master_engagement_models(id);

-- Update existing records in pricing_configs to use foreign key IDs
UPDATE pricing_configs 
SET country_id = (SELECT id FROM master_countries WHERE name = pricing_configs.country)
WHERE country_id IS NULL AND country IS NOT NULL;

UPDATE pricing_configs 
SET organization_type_id = (SELECT id FROM master_organization_types WHERE name = pricing_configs.organization_type)
WHERE organization_type_id IS NULL AND organization_type IS NOT NULL;

UPDATE pricing_configs 
SET entity_type_id = (SELECT id FROM master_entity_types WHERE name = pricing_configs.entity_type)
WHERE entity_type_id IS NULL AND entity_type IS NOT NULL;

UPDATE pricing_configs 
SET engagement_model_id = (SELECT id FROM master_engagement_models WHERE name = pricing_configs.engagement_model)
WHERE engagement_model_id IS NULL AND engagement_model IS NOT NULL;

-- Only make NOT NULL for records that have valid foreign key references
-- Delete records that couldn't be matched to master data
DELETE FROM master_seeker_membership_fees WHERE country_id IS NULL OR organization_type_id IS NULL OR entity_type_id IS NULL;
DELETE FROM pricing_configs WHERE country_id IS NULL OR organization_type_id IS NULL OR entity_type_id IS NULL OR engagement_model_id IS NULL;

-- Now make the foreign key columns NOT NULL after cleaning data
ALTER TABLE master_seeker_membership_fees 
ALTER COLUMN country_id SET NOT NULL,
ALTER COLUMN organization_type_id SET NOT NULL,
ALTER COLUMN entity_type_id SET NOT NULL;

ALTER TABLE pricing_configs 
ALTER COLUMN country_id SET NOT NULL,
ALTER COLUMN organization_type_id SET NOT NULL,
ALTER COLUMN entity_type_id SET NOT NULL,
ALTER COLUMN engagement_model_id SET NOT NULL;