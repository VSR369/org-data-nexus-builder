-- Create structured formula configuration for different engagement models
INSERT INTO master_platform_fee_formulas (
  formula_name,
  engagement_model_id,
  formula_expression,
  platform_usage_fee_percentage,
  base_management_fee,
  base_consulting_fee,
  advance_payment_percentage,
  formula_type,
  description,
  is_active
) VALUES 
-- Aggregator Model
(
  'Aggregator Fee Formula',
  (SELECT id FROM master_engagement_models WHERE name = 'Aggregator'),
  'Platform Usage Fee Only',
  15.0,
  0,
  0,
  25.0,
  'structured',
  'For Aggregator engagement model: Only Platform Usage Fee applies',
  true
),
-- Market Place Model  
(
  'Market Place Fee Formula',
  (SELECT id FROM master_engagement_models WHERE name = 'Market Place'),
  'Platform Usage Fee + Management Fee',
  15.0,
  5000,
  0,
  25.0,
  'structured',
  'For Market Place: Platform Usage Fee + Management Fee (complexity adjusted)',
  true
),
-- Market Place & Aggregator Model
(
  'Market Place & Aggregator Fee Formula',
  (SELECT id FROM master_engagement_models WHERE name = 'Market Place & Aggregator'),
  'Platform Usage Fee + Management Fee + Consulting Fee',
  15.0,
  5000,
  3000,
  25.0,
  'structured',
  'For Market Place & Aggregator: All fees apply (complexity adjusted)',
  true
),
-- Platform as a Service Model
(
  'Platform as a Service Fee Formula',
  (SELECT id FROM master_engagement_models WHERE name = 'Platform as a Service'),
  'Platform Usage Fee + Consulting Fee',
  12.0,
  0,
  2500,
  30.0,
  'structured',
  'For Platform as a Service: Platform Usage Fee + Consulting Fee (complexity adjusted)',
  true
);