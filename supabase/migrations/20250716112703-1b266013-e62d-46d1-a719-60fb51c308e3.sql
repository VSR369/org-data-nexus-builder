-- Remove Platform as a Service formula record from master_platform_fee_formulas
DELETE FROM master_platform_fee_formulas 
WHERE engagement_model_id IN (
  SELECT id FROM master_engagement_models WHERE name = 'Platform as a Service'
);

-- Add new columns to master_platform_fee_formulas table
ALTER TABLE master_platform_fee_formulas 
ADD COLUMN country_id UUID REFERENCES master_countries(id),
ADD COLUMN currency_id UUID REFERENCES master_currencies(id),
ADD COLUMN engagement_model_subtype_id UUID REFERENCES master_engagement_model_subtypes(id);

-- Update existing formulas to populate new fields with default values
-- Set default country to first available country
UPDATE master_platform_fee_formulas 
SET country_id = (SELECT id FROM master_countries LIMIT 1)
WHERE country_id IS NULL;

-- Set default currency to first available currency
UPDATE master_platform_fee_formulas 
SET currency_id = (SELECT id FROM master_currencies LIMIT 1)
WHERE currency_id IS NULL;