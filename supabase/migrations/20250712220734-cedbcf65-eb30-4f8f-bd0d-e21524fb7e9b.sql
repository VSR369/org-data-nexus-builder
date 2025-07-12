-- Add new fields to engagement_activations table for engagement model locking and PaaS frequency management
ALTER TABLE engagement_activations ADD COLUMN engagement_locked boolean DEFAULT false;
ALTER TABLE engagement_activations ADD COLUMN lock_date timestamp with time zone;
ALTER TABLE engagement_activations ADD COLUMN frequency_payments jsonb DEFAULT '[]'::jsonb;
ALTER TABLE engagement_activations ADD COLUMN current_frequency text;
ALTER TABLE engagement_activations ADD COLUMN frequency_change_history jsonb DEFAULT '[]'::jsonb;
ALTER TABLE engagement_activations ADD COLUMN total_payments_made numeric DEFAULT 0;
ALTER TABLE engagement_activations ADD COLUMN last_payment_date timestamp with time zone;