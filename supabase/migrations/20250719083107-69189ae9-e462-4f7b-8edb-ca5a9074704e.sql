
-- Phase 1: Fix Database Constraints (Critical)
-- First, let's check and fix the pricing tier constraint
ALTER TABLE engagement_activations 
DROP CONSTRAINT IF EXISTS chk_pricing_tier_optional;

-- Add updated constraint that matches actual tier names from database
ALTER TABLE engagement_activations 
ADD CONSTRAINT chk_pricing_tier_optional 
CHECK (
  pricing_tier IS NULL OR 
  pricing_tier IN ('Basic', 'Standard', 'Premium', 'Enterprise')
);

-- Fix engagement model constraint to remove deprecated models
ALTER TABLE engagement_activations 
DROP CONSTRAINT IF EXISTS chk_engagement_model_optional;

-- Add updated constraint for current engagement models
ALTER TABLE engagement_activations 
ADD CONSTRAINT chk_engagement_model_optional 
CHECK (
  engagement_model IS NULL OR 
  engagement_model IN ('Marketplace', 'Aggregator')
);

-- Add constraint for membership status validation
ALTER TABLE engagement_activations 
DROP CONSTRAINT IF EXISTS chk_membership_status_valid;

ALTER TABLE engagement_activations 
ADD CONSTRAINT chk_membership_status_valid 
CHECK (
  membership_status IN ('active', 'inactive', 'Active', 'Inactive', 'Pending', 'Suspended')
);

-- Ensure workflow step constraint allows all valid steps
ALTER TABLE engagement_activations 
DROP CONSTRAINT IF EXISTS chk_workflow_step_valid;

ALTER TABLE engagement_activations 
ADD CONSTRAINT chk_workflow_step_valid 
CHECK (
  workflow_step IS NULL OR 
  workflow_step IN (
    'membership_decision', 
    'tier_selection', 
    'engagement_model_selection', 
    'terms_acceptance', 
    'completed',
    'activation_complete'
  )
);

-- Clean up any invalid data that might cause constraint violations
UPDATE engagement_activations 
SET pricing_tier = CASE 
  WHEN LOWER(pricing_tier) = 'basic' THEN 'Basic'
  WHEN LOWER(pricing_tier) = 'standard' THEN 'Standard'
  WHEN LOWER(pricing_tier) = 'premium' THEN 'Premium'
  WHEN LOWER(pricing_tier) = 'enterprise' THEN 'Enterprise'
  ELSE pricing_tier
END
WHERE pricing_tier IS NOT NULL;

UPDATE engagement_activations 
SET engagement_model = CASE 
  WHEN engagement_model = 'Market Place' THEN 'Marketplace'
  WHEN engagement_model = 'market place' THEN 'Marketplace'
  WHEN engagement_model = 'aggregator' THEN 'Aggregator'
  ELSE engagement_model
END
WHERE engagement_model IS NOT NULL;

-- Add indexes for better performance on the membership flow queries
CREATE INDEX IF NOT EXISTS idx_engagement_activations_workflow 
ON engagement_activations(user_id, workflow_step, membership_status);

CREATE INDEX IF NOT EXISTS idx_tier_configurations_active 
ON master_tier_configurations(country_id, is_active) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_platform_fee_formulas_active 
ON master_platform_fee_formulas(engagement_model_id, country_id, is_active) 
WHERE is_active = true;
