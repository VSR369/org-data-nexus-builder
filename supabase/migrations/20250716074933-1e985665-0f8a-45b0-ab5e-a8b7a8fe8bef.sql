-- Update the check constraint to include 'solution_fee' as a valid component type
ALTER TABLE master_fee_components 
DROP CONSTRAINT IF EXISTS master_fee_components_component_type_check;

-- Add the updated constraint with solution_fee included
ALTER TABLE master_fee_components 
ADD CONSTRAINT master_fee_components_component_type_check 
CHECK (component_type IN ('management_fee', 'consulting_fee', 'platform_fee', 'advance_payment', 'solution_fee'));