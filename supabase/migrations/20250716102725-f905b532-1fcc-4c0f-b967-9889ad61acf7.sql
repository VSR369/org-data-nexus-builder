-- Add the new columns to support structured formula configuration
ALTER TABLE master_platform_fee_formulas 
ADD COLUMN platform_usage_fee_percentage NUMERIC(5,2) DEFAULT 0,
ADD COLUMN base_management_fee NUMERIC(12,2) DEFAULT 0,
ADD COLUMN base_consulting_fee NUMERIC(12,2) DEFAULT 0,
ADD COLUMN advance_payment_percentage NUMERIC(5,2) DEFAULT 25,
ADD COLUMN challenge_complexity_id UUID REFERENCES master_challenge_complexity(id),
ADD COLUMN formula_type TEXT DEFAULT 'structured',
ADD COLUMN configuration JSONB DEFAULT '{}';

-- Add check constraint for formula_type
ALTER TABLE master_platform_fee_formulas 
ADD CONSTRAINT master_platform_fee_formulas_formula_type_check 
CHECK (formula_type IN ('structured', 'expression'));