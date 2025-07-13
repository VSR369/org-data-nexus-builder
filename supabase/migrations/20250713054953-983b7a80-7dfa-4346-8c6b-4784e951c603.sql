-- Comprehensive Database Schema Fix Migration
-- This migration addresses all critical database schema issues

-- 1. Fix array column types in profiles table
ALTER TABLE public.profiles 
ALTER COLUMN company_logo TYPE text[] USING company_logo::text[],
ALTER COLUMN company_profile TYPE text[] USING company_profile::text[],
ALTER COLUMN registration_documents TYPE text[] USING registration_documents::text[];

-- 2. Add missing foreign key constraints for hierarchical relationships
ALTER TABLE public.master_domain_groups 
ADD CONSTRAINT fk_domain_groups_industry_segment 
FOREIGN KEY (industry_segment_id) REFERENCES public.master_industry_segments(id) ON DELETE SET NULL;

ALTER TABLE public.master_categories 
ADD CONSTRAINT fk_categories_domain_group 
FOREIGN KEY (domain_group_id) REFERENCES public.master_domain_groups(id) ON DELETE CASCADE;

ALTER TABLE public.master_sub_categories 
ADD CONSTRAINT fk_sub_categories_category 
FOREIGN KEY (category_id) REFERENCES public.master_categories(id) ON DELETE CASCADE;

ALTER TABLE public.master_sub_departments 
ADD CONSTRAINT fk_sub_departments_department 
FOREIGN KEY (department_id) REFERENCES public.master_departments(id) ON DELETE CASCADE;

ALTER TABLE public.master_team_units 
ADD CONSTRAINT fk_team_units_sub_department 
FOREIGN KEY (sub_department_id) REFERENCES public.master_sub_departments(id) ON DELETE CASCADE;

-- 3. Add referential integrity for master data lookups
ALTER TABLE public.master_currencies 
ADD CONSTRAINT fk_currencies_country 
FOREIGN KEY (country) REFERENCES public.master_countries(name) ON DELETE SET NULL;

-- 4. Add performance indexes for foreign key columns
CREATE INDEX IF NOT EXISTS idx_domain_groups_industry_segment ON public.master_domain_groups(industry_segment_id);
CREATE INDEX IF NOT EXISTS idx_categories_domain_group ON public.master_categories(domain_group_id);
CREATE INDEX IF NOT EXISTS idx_sub_categories_category ON public.master_sub_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_sub_departments_department ON public.master_sub_departments(department_id);
CREATE INDEX IF NOT EXISTS idx_team_units_sub_department ON public.master_team_units(sub_department_id);
CREATE INDEX IF NOT EXISTS idx_currencies_country ON public.master_currencies(country);

-- 5. Add indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_countries_code ON public.master_countries(code);
CREATE INDEX IF NOT EXISTS idx_currencies_code ON public.master_currencies(code);
CREATE INDEX IF NOT EXISTS idx_departments_organization ON public.master_departments(organization_id);

-- 6. Add unique constraints where needed
CREATE UNIQUE INDEX IF NOT EXISTS unique_country_code ON public.master_countries(code) WHERE code IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS unique_currency_code ON public.master_currencies(code) WHERE code IS NOT NULL;

-- 7. Add check constraints for data validation
ALTER TABLE public.master_reward_types 
ADD CONSTRAINT check_reward_type_valid 
CHECK (type IN ('monetary', 'non-monetary') OR type IS NULL);

-- 8. Create update triggers for updated_at columns where missing
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for tables that don't have them
CREATE TRIGGER update_master_countries_updated_at
  BEFORE UPDATE ON public.master_countries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_currencies_updated_at
  BEFORE UPDATE ON public.master_currencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_departments_updated_at
  BEFORE UPDATE ON public.master_departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_domain_groups_updated_at
  BEFORE UPDATE ON public.master_domain_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_categories_updated_at
  BEFORE UPDATE ON public.master_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_sub_categories_updated_at
  BEFORE UPDATE ON public.master_sub_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_sub_departments_updated_at
  BEFORE UPDATE ON public.master_sub_departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_team_units_updated_at
  BEFORE UPDATE ON public.master_team_units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Add comments for documentation
COMMENT ON TABLE public.master_domain_groups IS 'Domain groups with optional industry segment classification and hierarchical categories';
COMMENT ON TABLE public.master_categories IS 'Categories belong to domain groups and can have sub-categories';
COMMENT ON TABLE public.master_sub_categories IS 'Sub-categories belong to categories';
COMMENT ON TABLE public.master_departments IS 'Organizational departments with optional organization linkage';
COMMENT ON TABLE public.master_sub_departments IS 'Sub-departments belong to departments';
COMMENT ON TABLE public.master_team_units IS 'Team units belong to sub-departments';

-- 10. Validate data integrity after migration
-- This will fail if there are orphaned records
DO $$
BEGIN
  -- Check for orphaned categories
  IF EXISTS (
    SELECT 1 FROM public.master_categories c 
    LEFT JOIN public.master_domain_groups d ON c.domain_group_id = d.id 
    WHERE c.domain_group_id IS NOT NULL AND d.id IS NULL
  ) THEN
    RAISE EXCEPTION 'Found orphaned categories with invalid domain_group_id references';
  END IF;
  
  -- Check for orphaned sub-categories
  IF EXISTS (
    SELECT 1 FROM public.master_sub_categories sc 
    LEFT JOIN public.master_categories c ON sc.category_id = c.id 
    WHERE sc.category_id IS NOT NULL AND c.id IS NULL
  ) THEN
    RAISE EXCEPTION 'Found orphaned sub-categories with invalid category_id references';
  END IF;
  
  RAISE NOTICE 'Database schema validation completed successfully';
END $$;