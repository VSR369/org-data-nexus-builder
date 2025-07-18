
-- Make engagement_model nullable to allow membership decisions without requiring engagement model selection
ALTER TABLE engagement_activations ALTER COLUMN engagement_model DROP NOT NULL;

-- Update the check constraint to allow null values for engagement_model
-- First, drop the existing constraint if it exists
ALTER TABLE engagement_activations DROP CONSTRAINT IF EXISTS chk_engagement_model;

-- Add a new constraint that allows NULL or valid engagement model names
ALTER TABLE engagement_activations ADD CONSTRAINT chk_engagement_model_optional 
CHECK (engagement_model IS NULL OR engagement_model IN (
  'Market Place', 'Market Place General', 'Aggregator', 'Platform as a Service', 
  'Market Place & Aggregator', 'Custom'
));

-- Also make pricing_tier nullable to be consistent with the workflow
ALTER TABLE engagement_activations ALTER COLUMN pricing_tier DROP NOT NULL;

-- Update the pricing tier constraint to allow null values
ALTER TABLE engagement_activations DROP CONSTRAINT IF EXISTS chk_pricing_tier;
ALTER TABLE engagement_activations ADD CONSTRAINT chk_pricing_tier_optional 
CHECK (pricing_tier IS NULL OR pricing_tier IN (
  'basic', 'standard', 'premium', 'enterprise'
));
