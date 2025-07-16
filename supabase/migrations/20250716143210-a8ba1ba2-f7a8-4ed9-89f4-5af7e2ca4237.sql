-- Add membership_discount_percentage column to master_platform_fee_formulas table
ALTER TABLE master_platform_fee_formulas 
ADD COLUMN membership_discount_percentage NUMERIC(5,2) DEFAULT 0;