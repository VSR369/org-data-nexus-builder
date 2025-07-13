-- Update master_reward_types table structure for simplified reward types
-- Make currency and amount truly optional for monetary types
-- Add constraint to ensure non-monetary types have descriptions

-- Remove any existing constraints that might require currency/amount for monetary types
ALTER TABLE master_reward_types 
DROP CONSTRAINT IF EXISTS reward_type_monetary_requirements;

-- Add a constraint to ensure non-monetary types have descriptions when provided
CREATE OR REPLACE FUNCTION validate_reward_type_requirements()
RETURNS TRIGGER AS $$
BEGIN
  -- For non-monetary types, description is optional but name is required
  IF NEW.type = 'non-monetary' AND (NEW.name IS NULL OR TRIM(NEW.name) = '') THEN
    RAISE EXCEPTION 'Non-monetary reward types must have a name';
  END IF;
  
  -- For monetary types, only name is required
  IF NEW.type = 'monetary' AND (NEW.name IS NULL OR TRIM(NEW.name) = '') THEN
    RAISE EXCEPTION 'Monetary reward types must have a name';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_reward_type_trigger ON master_reward_types;
CREATE TRIGGER validate_reward_type_trigger
  BEFORE INSERT OR UPDATE ON master_reward_types
  FOR EACH ROW
  EXECUTE FUNCTION validate_reward_type_requirements();