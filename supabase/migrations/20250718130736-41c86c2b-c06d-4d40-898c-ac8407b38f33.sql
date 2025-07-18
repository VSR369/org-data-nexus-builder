
-- Remove Platform as a Service engagement model and all related records
-- Phase 1: Remove tier access records for Platform as a Service
DELETE FROM master_tier_engagement_model_access 
WHERE engagement_model_id IN (
  SELECT id FROM master_engagement_models WHERE name = 'Platform as a Service'
);

-- Phase 2: Remove pricing configurations for Platform as a Service
DELETE FROM pricing_configurations 
WHERE engagement_model_id IN (
  SELECT id FROM master_engagement_models WHERE name = 'Platform as a Service'
);

-- Phase 3: Remove the Platform as a Service engagement model itself
DELETE FROM master_engagement_models 
WHERE name = 'Platform as a Service';

-- Verify the cleanup by checking remaining engagement models
SELECT name, description, created_at 
FROM master_engagement_models 
WHERE is_user_created = false 
ORDER BY name;
