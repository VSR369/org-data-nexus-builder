-- Phase 1: Database Updates (Final)

-- Add new fields to master_pricing_parameters
ALTER TABLE public.master_pricing_parameters 
ADD COLUMN IF NOT EXISTS rate_type TEXT DEFAULT 'currency' CHECK (rate_type IN ('currency', 'percentage')),
ADD COLUMN IF NOT EXISTS complexity_applicable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS engagement_model_context JSONB DEFAULT '{}';

-- Create engagement_model_fee_mapping table
CREATE TABLE IF NOT EXISTS public.engagement_model_fee_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_model_id UUID NOT NULL,
    fee_component_id UUID NOT NULL,
    is_required BOOLEAN DEFAULT true,
    calculation_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    FOREIGN KEY (engagement_model_id) REFERENCES master_engagement_models(id),
    FOREIGN KEY (fee_component_id) REFERENCES master_fee_components(id),
    UNIQUE(engagement_model_id, fee_component_id)
);

-- Add default_rate_type to master_fee_components
ALTER TABLE public.master_fee_components 
ADD COLUMN IF NOT EXISTS default_rate_type TEXT DEFAULT 'currency' CHECK (default_rate_type IN ('currency', 'percentage'));

-- Update the check constraint to include new component types
ALTER TABLE public.master_fee_components 
DROP CONSTRAINT IF EXISTS master_fee_components_component_type_check;

ALTER TABLE public.master_fee_components 
ADD CONSTRAINT master_fee_components_component_type_check 
CHECK (component_type = ANY (ARRAY['management_fee'::text, 'consulting_fee'::text, 'platform_fee'::text, 'advance_payment'::text, 'solution_fee'::text, 'platform_usage_fee'::text]));

-- Enable RLS on engagement_model_fee_mapping
ALTER TABLE public.engagement_model_fee_mapping ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for engagement_model_fee_mapping
CREATE POLICY "Allow all operations on engagement_model_fee_mapping"
ON public.engagement_model_fee_mapping
FOR ALL
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at on engagement_model_fee_mapping
CREATE TRIGGER update_engagement_model_fee_mapping_updated_at
    BEFORE UPDATE ON public.engagement_model_fee_mapping
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Data Migration: Set rate types based on component types
UPDATE public.master_pricing_parameters 
SET rate_type = 'percentage' 
WHERE fee_component_id IN (
    SELECT id FROM master_fee_components 
    WHERE component_type IN ('solution_fee', 'advance_payment', 'platform_fee')
);

UPDATE public.master_pricing_parameters 
SET rate_type = 'currency' 
WHERE fee_component_id IN (
    SELECT id FROM master_fee_components 
    WHERE component_type IN ('management_fee', 'consulting_fee')
);

-- Set complexity applicability - only management and consulting fees use complexity multipliers
UPDATE public.master_pricing_parameters 
SET complexity_applicable = true 
WHERE fee_component_id IN (
    SELECT id FROM master_fee_components 
    WHERE component_type IN ('management_fee', 'consulting_fee')
);

-- Update default rate types in master_fee_components
UPDATE public.master_fee_components 
SET default_rate_type = 'percentage' 
WHERE component_type IN ('solution_fee', 'advance_payment', 'platform_fee');

UPDATE public.master_fee_components 
SET default_rate_type = 'currency' 
WHERE component_type IN ('management_fee', 'consulting_fee');

-- Insert default engagement model fee mappings
-- First, let's ensure we have the basic fee components
INSERT INTO public.master_fee_components (name, component_type, description, is_active) 
SELECT 'Platform Usage Fee', 'platform_usage_fee', 'Percentage of solution fee', true
WHERE NOT EXISTS (SELECT 1 FROM master_fee_components WHERE name = 'Platform Usage Fee');

INSERT INTO public.master_fee_components (name, component_type, description, is_active) 
SELECT 'Management Fee', 'management_fee', 'Fixed management fee amount', true
WHERE NOT EXISTS (SELECT 1 FROM master_fee_components WHERE name = 'Management Fee');

INSERT INTO public.master_fee_components (name, component_type, description, is_active) 
SELECT 'Consulting Fee', 'consulting_fee', 'Fixed consulting fee amount', true
WHERE NOT EXISTS (SELECT 1 FROM master_fee_components WHERE name = 'Consulting Fee');

INSERT INTO public.master_fee_components (name, component_type, description, is_active) 
SELECT 'Advance Payment', 'advance_payment', 'Percentage of total fee paid in advance', true
WHERE NOT EXISTS (SELECT 1 FROM master_fee_components WHERE name = 'Advance Payment');

-- Create default engagement model fee mappings
WITH engagement_models AS (
    SELECT id, name FROM master_engagement_models
),
fee_components AS (
    SELECT id, name, component_type FROM master_fee_components
)
INSERT INTO public.engagement_model_fee_mapping (engagement_model_id, fee_component_id, is_required, calculation_order)
SELECT 
    em.id,
    fc.id,
    CASE 
        WHEN em.name = 'Marketplace General' AND fc.component_type IN ('platform_usage_fee', 'management_fee', 'advance_payment') THEN true
        WHEN em.name = 'Marketplace Program Managed' AND fc.component_type IN ('platform_usage_fee', 'management_fee', 'consulting_fee', 'advance_payment') THEN true
        WHEN em.name = 'Aggregator' AND fc.component_type IN ('platform_usage_fee', 'advance_payment') THEN true
        ELSE false
    END as is_required,
    CASE fc.component_type
        WHEN 'platform_usage_fee' THEN 1
        WHEN 'management_fee' THEN 2
        WHEN 'consulting_fee' THEN 3
        WHEN 'advance_payment' THEN 4
        ELSE 5
    END as calculation_order
FROM engagement_models em
CROSS JOIN fee_components fc
WHERE (
    (em.name = 'Marketplace General' AND fc.component_type IN ('platform_usage_fee', 'management_fee', 'advance_payment'))
    OR (em.name = 'Marketplace Program Managed' AND fc.component_type IN ('platform_usage_fee', 'management_fee', 'consulting_fee', 'advance_payment'))
    OR (em.name = 'Aggregator' AND fc.component_type IN ('platform_usage_fee', 'advance_payment'))
)
ON CONFLICT (engagement_model_id, fee_component_id) DO NOTHING;