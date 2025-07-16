-- Enhance the master_platform_fee_formulas table to support structured configurations
ALTER TABLE master_platform_fee_formulas 
ADD COLUMN IF NOT EXISTS platform_usage_fee_percentage NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS base_management_fee NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS base_consulting_fee NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS advance_payment_percentage NUMERIC(5,2) DEFAULT 25,
ADD COLUMN IF NOT EXISTS challenge_complexity_id UUID REFERENCES master_challenge_complexity(id),
ADD COLUMN IF NOT EXISTS formula_type TEXT DEFAULT 'structured',
ADD COLUMN IF NOT EXISTS configuration JSONB DEFAULT '{}';

-- Add check constraint for formula_type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'master_platform_fee_formulas_formula_type_check') THEN
        ALTER TABLE master_platform_fee_formulas 
        ADD CONSTRAINT master_platform_fee_formulas_formula_type_check 
        CHECK (formula_type IN ('structured', 'expression'));
    END IF;
END $$;

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
)
ON CONFLICT (formula_name) DO NOTHING;

-- Create function to calculate structured formulas
CREATE OR REPLACE FUNCTION calculate_structured_formula(
  formula_id UUID,
  solution_fee NUMERIC,
  complexity_level TEXT DEFAULT 'Medium'
) RETURNS JSONB AS $$
DECLARE
  formula_record RECORD;
  complexity_record RECORD;
  engagement_model_name TEXT;
  platform_fee NUMERIC := 0;
  management_fee NUMERIC := 0;
  consulting_fee NUMERIC := 0;
  total_fee NUMERIC := 0;
  advance_payment NUMERIC := 0;
  result JSONB;
BEGIN
  -- Get formula configuration
  SELECT * INTO formula_record 
  FROM master_platform_fee_formulas 
  WHERE id = formula_id AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Formula not found or inactive';
  END IF;
  
  -- Get complexity multipliers
  SELECT * INTO complexity_record 
  FROM master_challenge_complexity 
  WHERE name = complexity_level AND is_active = true;
  
  IF NOT FOUND THEN
    -- Default multipliers if complexity not found
    complexity_record.management_fee_multiplier := 1.0;
    complexity_record.consulting_fee_multiplier := 1.0;
  END IF;
  
  -- Get engagement model name
  SELECT em.name INTO engagement_model_name
  FROM master_engagement_models em
  WHERE em.id = formula_record.engagement_model_id;
  
  -- Calculate Platform Usage Fee (% of solution fee)
  platform_fee := solution_fee * (formula_record.platform_usage_fee_percentage / 100);
  
  -- Calculate Management Fee (base * complexity multiplier)
  management_fee := formula_record.base_management_fee * complexity_record.management_fee_multiplier;
  
  -- Calculate Consulting Fee (base * complexity multiplier)  
  consulting_fee := formula_record.base_consulting_fee * complexity_record.consulting_fee_multiplier;
  
  -- Calculate Total Fee based on engagement model
  total_fee := platform_fee;
  
  -- Add fees based on engagement model requirements
  CASE 
    WHEN engagement_model_name = 'Market Place' THEN
      total_fee := platform_fee + management_fee;
    WHEN engagement_model_name = 'Market Place & Aggregator' THEN  
      total_fee := platform_fee + management_fee + consulting_fee;
    WHEN engagement_model_name = 'Platform as a Service' THEN
      total_fee := platform_fee + consulting_fee;
    ELSE
      total_fee := platform_fee; -- Aggregator or default
  END CASE;
  
  -- Calculate Advance Payment (% of total fee)
  advance_payment := total_fee * (formula_record.advance_payment_percentage / 100);
  
  -- Build result
  result := jsonb_build_object(
    'solution_fee', solution_fee,
    'platform_usage_fee', platform_fee,
    'management_fee', management_fee,
    'consulting_fee', consulting_fee,
    'total_fee', total_fee,
    'advance_payment', advance_payment,
    'complexity_level', complexity_level,
    'management_multiplier', complexity_record.management_fee_multiplier,
    'consulting_multiplier', complexity_record.consulting_fee_multiplier,
    'engagement_model', engagement_model_name,
    'breakdown', jsonb_build_object(
      'platform_percentage', formula_record.platform_usage_fee_percentage,
      'base_management_fee', formula_record.base_management_fee,
      'base_consulting_fee', formula_record.base_consulting_fee,
      'advance_percentage', formula_record.advance_payment_percentage
    )
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;