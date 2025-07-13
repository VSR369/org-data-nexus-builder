-- Add terms and conditions tracking fields to engagement_activations
ALTER TABLE public.engagement_activations 
ADD COLUMN mem_terms BOOLEAN DEFAULT false,
ADD COLUMN enm_terms BOOLEAN DEFAULT false;

-- Rename existing payment fields with mem_ prefix
ALTER TABLE public.engagement_activations 
RENAME COLUMN payment_status TO mem_payment_status;

ALTER TABLE public.engagement_activations 
RENAME COLUMN payment_amount TO mem_payment_amount;

ALTER TABLE public.engagement_activations 
RENAME COLUMN payment_date TO mem_payment_date;

-- Add new membership payment tracking fields
ALTER TABLE public.engagement_activations 
ADD COLUMN mem_payment_currency TEXT,
ADD COLUMN mem_payment_method TEXT,
ADD COLUMN mem_receipt_number TEXT;

-- Update default values for renamed fields
ALTER TABLE public.engagement_activations 
ALTER COLUMN mem_payment_status SET DEFAULT 'idle';

-- Add comments for clarity
COMMENT ON COLUMN public.engagement_activations.mem_terms IS 'Membership terms and conditions acceptance';
COMMENT ON COLUMN public.engagement_activations.enm_terms IS 'Engagement model terms and conditions acceptance';
COMMENT ON COLUMN public.engagement_activations.mem_payment_status IS 'Annual membership payment status';
COMMENT ON COLUMN public.engagement_activations.mem_payment_amount IS 'Annual membership payment amount';
COMMENT ON COLUMN public.engagement_activations.mem_payment_date IS 'Annual membership payment date';
COMMENT ON COLUMN public.engagement_activations.mem_payment_currency IS 'Annual membership payment currency';
COMMENT ON COLUMN public.engagement_activations.mem_payment_method IS 'Annual membership payment method';
COMMENT ON COLUMN public.engagement_activations.mem_receipt_number IS 'Annual membership payment receipt number';