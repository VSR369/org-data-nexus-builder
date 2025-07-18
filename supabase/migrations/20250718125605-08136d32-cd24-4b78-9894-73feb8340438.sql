
-- First, get the IDs we need
WITH tier_ids AS (
  SELECT id, name FROM master_pricing_tiers WHERE name IN ('Basic', 'Standard', 'Premium')
),
model_ids AS (
  SELECT id, name FROM master_engagement_models WHERE name IN ('Market Place', 'Aggregator', 'Market Place & Aggregator', 'Platform as a Service')
)
-- Insert all combinations of tiers and engagement models
INSERT INTO master_tier_engagement_model_access (
  pricing_tier_id,
  engagement_model_id,
  is_allowed,
  is_active,
  is_default,
  selection_scope,
  switch_requirements,
  max_concurrent_models,
  allows_multiple_challenges,
  business_rules,
  created_at,
  updated_at
)
SELECT 
  t.id as pricing_tier_id,
  m.id as engagement_model_id,
  true as is_allowed,
  true as is_active,
  false as is_default,
  'per_challenge' as selection_scope,
  'none' as switch_requirements,
  1 as max_concurrent_models,
  true as allows_multiple_challenges,
  '{}' as business_rules,
  now() as created_at,
  now() as updated_at
FROM tier_ids t
CROSS JOIN model_ids m
-- Only insert if the combination doesn't already exist
WHERE NOT EXISTS (
  SELECT 1 FROM master_tier_engagement_model_access tema
  WHERE tema.pricing_tier_id = t.id AND tema.engagement_model_id = m.id
);
