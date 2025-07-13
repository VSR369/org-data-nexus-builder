-- Phase 1: Add missing fields and relationships to master data tables

-- 1. Add country field to master_currencies with proper foreign key
ALTER TABLE public.master_currencies 
ADD COLUMN country text,
ADD COLUMN country_code text;

-- Add foreign key constraint linking currencies to countries
ALTER TABLE public.master_currencies 
ADD CONSTRAINT fk_master_currencies_country 
FOREIGN KEY (country) REFERENCES public.master_countries(name) ON UPDATE CASCADE;

-- 2. Ensure proper foreign key relationship for master_sub_categories
ALTER TABLE public.master_sub_categories 
ADD CONSTRAINT fk_master_sub_categories_category 
FOREIGN KEY (category_id) REFERENCES public.master_categories(id) ON DELETE CASCADE;

-- 3. Add foreign key constraint for master_domain_groups to industry_segments
ALTER TABLE public.master_domain_groups 
ADD CONSTRAINT fk_master_domain_groups_industry_segment 
FOREIGN KEY (industry_segment_id) REFERENCES public.master_industry_segments(id) ON DELETE SET NULL;

-- 4. Add indexes for better performance
CREATE INDEX idx_master_currencies_country ON public.master_currencies(country);
CREATE INDEX idx_master_currencies_country_code ON public.master_currencies(country_code);
CREATE INDEX idx_master_sub_categories_category_id ON public.master_sub_categories(category_id);
CREATE INDEX idx_master_domain_groups_industry_segment_id ON public.master_domain_groups(industry_segment_id);

-- 5. Add missing fields to master_seeker_membership_fees for better structure
ALTER TABLE public.master_seeker_membership_fees
ADD COLUMN IF NOT EXISTS monthly_amount numeric,
ADD COLUMN IF NOT EXISTS monthly_currency text,
ADD COLUMN IF NOT EXISTS description text;

-- 6. Add constraints to ensure currency-country consistency
CREATE OR REPLACE FUNCTION validate_currency_country_consistency()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure currency and country are both provided or both null
  IF (NEW.country IS NOT NULL AND NEW.country_code IS NULL) OR 
     (NEW.country IS NULL AND NEW.country_code IS NOT NULL) THEN
    RAISE EXCEPTION 'Country and country_code must both be provided or both be null';
  END IF;
  
  -- If country is provided, ensure it exists in master_countries
  IF NEW.country IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM master_countries WHERE name = NEW.country) THEN
      RAISE EXCEPTION 'Country % does not exist in master_countries', NEW.country;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_currency_country_consistency
  BEFORE INSERT OR UPDATE ON public.master_currencies
  FOR EACH ROW EXECUTE FUNCTION validate_currency_country_consistency();

-- 7. Add validation for pricing configs to ensure proper fee structure
CREATE OR REPLACE FUNCTION validate_pricing_config_fees()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure at least one fee amount is provided
  IF NEW.annual_fee IS NULL AND NEW.half_yearly_fee IS NULL AND NEW.quarterly_fee IS NULL THEN
    RAISE EXCEPTION 'At least one fee amount (annual, half-yearly, or quarterly) must be provided';
  END IF;
  
  -- Ensure currency is provided when fees are set
  IF (NEW.annual_fee IS NOT NULL OR NEW.half_yearly_fee IS NOT NULL OR NEW.quarterly_fee IS NOT NULL) 
     AND NEW.currency IS NULL THEN
    RAISE EXCEPTION 'Currency must be provided when fee amounts are set';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_pricing_config_fees
  BEFORE INSERT OR UPDATE ON public.pricing_configs
  FOR EACH ROW EXECUTE FUNCTION validate_pricing_config_fees();