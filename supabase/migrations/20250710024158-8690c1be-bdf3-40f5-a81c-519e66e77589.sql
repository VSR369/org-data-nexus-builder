-- Add billing_frequency column to engagement_activations table
ALTER TABLE public.engagement_activations 
ADD COLUMN billing_frequency TEXT;