-- Enhance the master_platform_fee_formulas table to support structured configurations
ALTER TABLE master_platform_fee_formulas 
ADD COLUMN platform_usage_fee_percentage NUMERIC(5,2) DEFAULT 0,
ADD COLUMN base_management_fee NUMERIC(12,2) DEFAULT 0,
ADD COLUMN base_consulting_fee NUMERIC(12,2) DEFAULT 0,
ADD COLUMN advance_payment_percentage NUMERIC(5,2) DEFAULT 25,
ADD COLUMN challenge_complexity_id UUID REFERENCES master_challenge_complexity(id),
ADD COLUMN formula_type TEXT DEFAULT 'structured' CHECK (formula_type IN ('structured', 'expression')),
ADD COLUMN configuration JSONB DEFAULT '{}';

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
  (SELECT id FROM master_engagement_models WHERE name = 'Aggregator' LIMIT 1),
  'Platform Usage Fee Only',
  15.0,
  0,
  0,
  25.0,
  'structured',
  'For Aggregator engagement model: Only Platform Usage Fee applies',
  true
),
-- Marketplace General Model  
(
  'Marketplace General Fee Formula',
  (SELECT id FROM master_engagement_models WHERE name = 'Marketplace General' LIMIT 1),
  'Platform Usage Fee + Management Fee',
  15.0,
  5000,
  0,
  25.0,
  'structured',
  'For Marketplace General: Platform Usage Fee + Management Fee (complexity adjusted)',
  true
),
-- Marketplace Program Managed Model
(
  'Marketplace Program Fee Formula',
  (SELECT id FROM master_engagement_models WHERE name = 'Marketplace Program Managed' LIMIT 1),
  'Platform Usage Fee + Management Fee + Consulting Fee',
  15.0,
  5000,
  3000,
  25.0,
  'structured',
  'For Marketplace Program Managed: All fees apply (complexity adjusted)',
  true
);

-- Create function to calculate structured formulas
CREATE OR REPLACE FUNCTION calculate_structured_formula(
  formula_id UUID,
  solution_fee NUMERIC,
  complexity_level TEXT DEFAULT 'Medium'
) RETURNS JSONB AS $$
DECLARE
  formula_record RECORD;
  complexity_record RECORD;
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
  
  -- Calculate Platform Usage Fee (% of solution fee)
  platform_fee := solution_fee * (formula_record.platform_usage_fee_percentage / 100);
  
  -- Calculate Management Fee (base * complexity multiplier)
  management_fee := formula_record.base_management_fee * complexity_record.management_fee_multiplier;
  
  -- Calculate Consulting Fee (base * complexity multiplier)  
  consulting_fee := formula_record.base_consulting_fee * complexity_record.consulting_fee_multiplier;
  
  -- Calculate Total Fee based on engagement model
  total_fee := platform_fee;
  
  -- Add fees based on engagement model requirements
  SELECT em.name INTO result
  FROM master_engagement_models em
  WHERE em.id = formula_record.engagement_model_id;
  
  CASE 
    WHEN result::TEXT = 'Marketplace General' THEN
      total_fee := platform_fee + management_fee;
    WHEN result::TEXT = 'Marketplace Program Managed' THEN  
      total_fee := platform_fee + management_fee + consulting_fee;
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