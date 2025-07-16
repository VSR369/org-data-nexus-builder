-- Update Platform Usage Fee to Solution Fee
UPDATE master_fee_components 
SET 
  component_type = 'solution_fee',
  name = 'Solution Fee',
  description = 'Fee for solution services and implementation'
WHERE component_type = 'platform_usage_fee' AND name = 'Platform Usage Fee';