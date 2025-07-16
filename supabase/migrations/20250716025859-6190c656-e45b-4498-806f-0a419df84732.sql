-- Phase 1: Create comprehensive master data tables for marketplace-based pricing

-- 1. Master Pricing Tiers
CREATE TABLE public.master_pricing_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  level_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1,
  is_user_created BOOLEAN DEFAULT false
);

-- 2. Master Engagement Model Subtypes
CREATE TABLE public.master_engagement_model_subtypes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  engagement_model_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  required_fields JSONB DEFAULT '[]'::jsonb,
  optional_fields JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1,
  is_user_created BOOLEAN DEFAULT false,
  FOREIGN KEY (engagement_model_id) REFERENCES master_engagement_models(id)
);

-- 3. Master Fee Components
CREATE TABLE public.master_fee_components (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  component_type TEXT NOT NULL CHECK (component_type IN ('management_fee', 'consulting_fee', 'platform_fee', 'advance_payment')),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1,
  is_user_created BOOLEAN DEFAULT false
);

-- 4. Master Platform Fee Formulas
CREATE TABLE public.master_platform_fee_formulas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  engagement_model_id UUID NOT NULL,
  formula_name TEXT NOT NULL,
  formula_expression TEXT NOT NULL,
  description TEXT,
  variables JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1,
  is_user_created BOOLEAN DEFAULT false,
  FOREIGN KEY (engagement_model_id) REFERENCES master_engagement_models(id)
);

-- 5. Master Advance Payment Types
CREATE TABLE public.master_advance_payment_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  percentage_of_platform_fee NUMERIC NOT NULL CHECK (percentage_of_platform_fee >= 0 AND percentage_of_platform_fee <= 100),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1,
  is_user_created BOOLEAN DEFAULT false
);

-- 6. Tier Engagement Model Restrictions
CREATE TABLE public.tier_engagement_model_restrictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pricing_tier_id UUID NOT NULL,
  engagement_model_id UUID NOT NULL,
  engagement_model_subtype_id UUID,
  is_allowed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1,
  UNIQUE(pricing_tier_id, engagement_model_id, engagement_model_subtype_id),
  FOREIGN KEY (pricing_tier_id) REFERENCES master_pricing_tiers(id),
  FOREIGN KEY (engagement_model_id) REFERENCES master_engagement_models(id),
  FOREIGN KEY (engagement_model_subtype_id) REFERENCES master_engagement_model_subtypes(id)
);

-- 7. Master Pricing Parameters (Country/Currency specific fees)
CREATE TABLE public.master_pricing_parameters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL,
  currency_id UUID NOT NULL,
  organization_type_id UUID NOT NULL,
  entity_type_id UUID NOT NULL,
  fee_component_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  unit_of_measure_id UUID NOT NULL,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1,
  is_user_created BOOLEAN DEFAULT false,
  FOREIGN KEY (country_id) REFERENCES master_countries(id),
  FOREIGN KEY (currency_id) REFERENCES master_currencies(id),
  FOREIGN KEY (organization_type_id) REFERENCES master_organization_types(id),
  FOREIGN KEY (entity_type_id) REFERENCES master_entity_types(id),
  FOREIGN KEY (fee_component_id) REFERENCES master_fee_components(id),
  FOREIGN KEY (unit_of_measure_id) REFERENCES master_units_of_measure(id)
);

-- 8. Master System Configurations
CREATE TABLE public.master_system_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value TEXT NOT NULL,
  data_type TEXT NOT NULL CHECK (data_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  category TEXT DEFAULT 'general',
  is_system_config BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1
);

-- 9. Enhanced Pricing Configurations Table
ALTER TABLE public.pricing_configurations 
ADD COLUMN IF NOT EXISTS pricing_tier_id UUID,
ADD COLUMN IF NOT EXISTS engagement_model_subtype_id UUID,
ADD COLUMN IF NOT EXISTS platform_fee_formula_id UUID,
ADD COLUMN IF NOT EXISTS advance_payment_type_id UUID,
ADD COLUMN IF NOT EXISTS calculated_platform_fee NUMERIC,
ADD COLUMN IF NOT EXISTS calculated_advance_payment NUMERIC,
ADD COLUMN IF NOT EXISTS management_fee_amount NUMERIC,
ADD COLUMN IF NOT EXISTS consulting_fee_amount NUMERIC,
ADD COLUMN IF NOT EXISTS formula_variables JSONB DEFAULT '{}'::jsonb;

-- Add foreign key constraints to pricing_configurations
ALTER TABLE public.pricing_configurations 
ADD CONSTRAINT fk_pricing_tier 
FOREIGN KEY (pricing_tier_id) REFERENCES master_pricing_tiers(id);

ALTER TABLE public.pricing_configurations 
ADD CONSTRAINT fk_engagement_model_subtype 
FOREIGN KEY (engagement_model_subtype_id) REFERENCES master_engagement_model_subtypes(id);

ALTER TABLE public.pricing_configurations 
ADD CONSTRAINT fk_platform_fee_formula 
FOREIGN KEY (platform_fee_formula_id) REFERENCES master_platform_fee_formulas(id);

ALTER TABLE public.pricing_configurations 
ADD CONSTRAINT fk_advance_payment_type 
FOREIGN KEY (advance_payment_type_id) REFERENCES master_advance_payment_types(id);

-- Enable RLS on all new tables
ALTER TABLE public.master_pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_engagement_model_subtypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_fee_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_platform_fee_formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_advance_payment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_engagement_model_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_pricing_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_system_configurations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now)
CREATE POLICY "Allow all operations on master_pricing_tiers" ON public.master_pricing_tiers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_engagement_model_subtypes" ON public.master_engagement_model_subtypes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_fee_components" ON public.master_fee_components FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_platform_fee_formulas" ON public.master_platform_fee_formulas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_advance_payment_types" ON public.master_advance_payment_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tier_engagement_model_restrictions" ON public.tier_engagement_model_restrictions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_pricing_parameters" ON public.master_pricing_parameters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_system_configurations" ON public.master_system_configurations FOR ALL USING (true) WITH CHECK (true);

-- Create update triggers for all new tables
CREATE TRIGGER update_master_pricing_tiers_updated_at
  BEFORE UPDATE ON public.master_pricing_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_engagement_model_subtypes_updated_at
  BEFORE UPDATE ON public.master_engagement_model_subtypes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_fee_components_updated_at
  BEFORE UPDATE ON public.master_fee_components
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_platform_fee_formulas_updated_at
  BEFORE UPDATE ON public.master_platform_fee_formulas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_advance_payment_types_updated_at
  BEFORE UPDATE ON public.master_advance_payment_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tier_engagement_model_restrictions_updated_at
  BEFORE UPDATE ON public.tier_engagement_model_restrictions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_pricing_parameters_updated_at
  BEFORE UPDATE ON public.master_pricing_parameters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_system_configurations_updated_at
  BEFORE UPDATE ON public.master_system_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default fee components
INSERT INTO public.master_fee_components (name, component_type, description) VALUES
('Management Fee', 'management_fee', 'Fee for managing the engagement'),
('Consulting Fee', 'consulting_fee', 'Fee for consulting services'),
('Platform Fee', 'platform_fee', 'Platform usage fee'),
('Advance Payment', 'advance_payment', 'Advance payment requirement');

-- Insert default system configurations
INSERT INTO public.master_system_configurations (config_key, config_value, data_type, description, category, is_system_config) VALUES
('default_currency', 'USD', 'string', 'Default currency for pricing calculations', 'pricing', true),
('platform_fee_calculation_enabled', 'true', 'boolean', 'Enable platform fee formula calculations', 'pricing', true),
('advance_payment_enabled', 'true', 'boolean', 'Enable advance payment calculations', 'pricing', true);