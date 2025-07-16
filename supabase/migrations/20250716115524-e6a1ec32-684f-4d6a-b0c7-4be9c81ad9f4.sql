-- Remove challenge_complexity_id column from master_platform_fee_formulas table
-- as formulas should work for all complexity levels, not be tied to a specific complexity

ALTER TABLE master_platform_fee_formulas 
DROP COLUMN IF EXISTS challenge_complexity_id;