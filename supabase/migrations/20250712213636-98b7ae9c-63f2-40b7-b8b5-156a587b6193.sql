-- Add missing columns to engagement_activations table for enhanced data storage
ALTER TABLE public.engagement_activations 
ADD COLUMN IF NOT EXISTS membership_type TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'idle',
ADD COLUMN IF NOT EXISTS payment_amount NUMERIC,
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS selected_frequency TEXT,
ADD COLUMN IF NOT EXISTS pricing_locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_platform_fee_percentage NUMERIC;

-- Add comments for clarity
COMMENT ON COLUMN public.engagement_activations.membership_type IS 'Membership type: not-a-member or annual';
COMMENT ON COLUMN public.engagement_activations.payment_status IS 'Payment status: idle, processing, paid, failed';
COMMENT ON COLUMN public.engagement_activations.payment_amount IS 'Actual payment amount processed';
COMMENT ON COLUMN public.engagement_activations.payment_date IS 'When payment was completed';
COMMENT ON COLUMN public.engagement_activations.selected_frequency IS 'For PaaS models only: quarterly, half-yearly, annual';
COMMENT ON COLUMN public.engagement_activations.pricing_locked IS 'Prevents changing membership selection after payment completion';
COMMENT ON COLUMN public.engagement_activations.updated_platform_fee_percentage IS 'Discounted rate after membership upgrade';