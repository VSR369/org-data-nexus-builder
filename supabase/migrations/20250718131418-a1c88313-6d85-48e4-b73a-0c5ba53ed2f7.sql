
-- Remove Market Place & Aggregator engagement model and all related records
-- Phase 1: Remove tier access records for Market Place & Aggregator
DELETE FROM master_tier_engagement_model_access 
WHERE engagement_model_id IN (
  SELECT id FROM master_engagement_models WHERE name = 'Market Place & Aggregator'
);

-- Phase 2: Remove pricing configurations for Market Place & Aggregator
DELETE FROM pricing_configurations 
WHERE engagement_model_id IN (
  SELECT id FROM master_engagement_models WHERE name = 'Market Place & Aggregator'
);

-- Phase 3: Remove the Market Place & Aggregator engagement model itself
DELETE FROM master_engagement_models 
WHERE name = 'Market Place & Aggregator';

-- Verify the cleanup by checking remaining engagement models
SELECT name, description, created_at 
FROM master_engagement_models 
WHERE is_user_created = false 
ORDER BY name;
