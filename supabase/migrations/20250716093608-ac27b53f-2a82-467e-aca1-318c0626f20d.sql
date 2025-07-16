-- Remove ALL restrictive constraints on fee components
ALTER TABLE master_fee_components 
DROP CONSTRAINT IF EXISTS master_fee_components_component_type_check;

ALTER TABLE master_fee_components 
DROP CONSTRAINT IF EXISTS fee_components_type_restriction;

-- Add back the missing fee component types (only if they don't already exist)
DO $$
BEGIN
    -- Insert Total Fee if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM master_fee_components WHERE name = 'Total Fee') THEN
        INSERT INTO master_fee_components (name, component_type, description, is_active, is_user_created, created_at, updated_at)
        VALUES ('Total Fee', 'total_fee', 'Total comprehensive fee calculation', true, false, now(), now());
    END IF;
    
    -- Insert Platform Usage Fee if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM master_fee_components WHERE name = 'Platform Usage Fee') THEN
        INSERT INTO master_fee_components (name, component_type, description, is_active, is_user_created, created_at, updated_at)
        VALUES ('Platform Usage Fee', 'platform_usage_fee', 'Fee for platform usage and services', true, false, now(), now());
    END IF;
    
    -- Insert Advance Payment if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM master_fee_components WHERE name = 'Advance Payment') THEN
        INSERT INTO master_fee_components (name, component_type, description, is_active, is_user_created, created_at, updated_at)
        VALUES ('Advance Payment', 'advance_payment', 'Advance payment component', true, false, now(), now());
    END IF;
END $$;

-- Update the trigger to allow all fee component types for pricing parameters
DROP TRIGGER IF EXISTS validate_pricing_parameter_fee_component_trigger ON master_pricing_parameters;
DROP FUNCTION IF EXISTS validate_pricing_parameter_fee_component();

-- Create a more flexible validation function that allows all fee component types
CREATE OR REPLACE FUNCTION validate_pricing_parameter_fee_component()
RETURNS TRIGGER AS $$
BEGIN
  -- Simply ensure the fee component exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM master_fee_components 
    WHERE id = NEW.fee_component_id 
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Fee component must exist and be active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger with the updated function
CREATE TRIGGER validate_pricing_parameter_fee_component_trigger
  BEFORE INSERT OR UPDATE ON master_pricing_parameters
  FOR EACH ROW
  EXECUTE FUNCTION validate_pricing_parameter_fee_component();