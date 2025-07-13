-- Remove unnecessary fields from master_reward_types table
-- Based on simplified requirements: 
-- - Monetary types: only need name
-- - Non-monetary types: need name and optional description

-- Drop the amount and currency columns as they are no longer needed
ALTER TABLE master_reward_types 
DROP COLUMN IF EXISTS amount,
DROP COLUMN IF EXISTS currency;

-- Update the validation function to reflect the simplified requirements
CREATE OR REPLACE FUNCTION validate_reward_type_requirements()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure type is either 'monetary' or 'non-monetary'
  IF NEW.type NOT IN ('monetary', 'non-monetary') THEN
    RAISE EXCEPTION 'Reward type must be either "monetary" or "non-monetary"';
  END IF;
  
  -- Name is required for all reward types
  IF NEW.name IS NULL OR TRIM(NEW.name) = '' THEN
    RAISE EXCEPTION 'Reward type name is required';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;