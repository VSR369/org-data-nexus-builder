-- Comprehensive Database Schema Fix Migration (Safe Version)
-- This migration addresses all critical database schema issues with existence checks

-- 1. Fix array column types in profiles table (only if needed)
DO $$
BEGIN
  -- Check if columns need to be converted
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'company_logo' 
    AND data_type != 'ARRAY'
  ) THEN
    ALTER TABLE public.profiles 
    ALTER COLUMN company_logo TYPE text[] USING company_logo::text[],
    ALTER COLUMN company_profile TYPE text[] USING company_profile::text[],
    ALTER COLUMN registration_documents TYPE text[] USING registration_documents::text[];
    RAISE NOTICE 'Fixed array column types in profiles table';
  END IF;
END $$;

-- 2. Add missing foreign key constraints (check if they exist first)
DO $$
BEGIN
  -- Add domain_groups -> industry_segments FK if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_domain_groups_industry_segment'
  ) THEN
    ALTER TABLE public.master_domain_groups 
    ADD CONSTRAINT fk_domain_groups_industry_segment 
    FOREIGN KEY (industry_segment_id) REFERENCES public.master_industry_segments(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added FK: domain_groups -> industry_segments';
  END IF;

  -- Add sub_categories -> categories FK if not exists  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_sub_categories_category'
  ) THEN
    ALTER TABLE public.master_sub_categories 
    ADD CONSTRAINT fk_sub_categories_category 
    FOREIGN KEY (category_id) REFERENCES public.master_categories(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: sub_categories -> categories';
  END IF;

  -- Add currencies -> countries FK if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_currencies_country'
  ) THEN
    ALTER TABLE public.master_currencies 
    ADD CONSTRAINT fk_currencies_country 
    FOREIGN KEY (country) REFERENCES public.master_countries(name) ON DELETE SET NULL;
    RAISE NOTICE 'Added FK: currencies -> countries';
  END IF;
END $$;

-- 3. Add performance indexes (check if they exist first)
CREATE INDEX IF NOT EXISTS idx_domain_groups_industry_segment ON public.master_domain_groups(industry_segment_id);
CREATE INDEX IF NOT EXISTS idx_categories_domain_group ON public.master_categories(domain_group_id);
CREATE INDEX IF NOT EXISTS idx_sub_categories_category ON public.master_sub_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_sub_departments_department ON public.master_sub_departments(department_id);
CREATE INDEX IF NOT EXISTS idx_team_units_sub_department ON public.master_team_units(sub_department_id);
CREATE INDEX IF NOT EXISTS idx_currencies_country ON public.master_currencies(country);
CREATE INDEX IF NOT EXISTS idx_countries_code ON public.master_countries(code);
CREATE INDEX IF NOT EXISTS idx_currencies_code ON public.master_currencies(code);
CREATE INDEX IF NOT EXISTS idx_departments_organization ON public.master_departments(organization_id);

-- 4. Add unique constraints where needed
CREATE UNIQUE INDEX IF NOT EXISTS unique_country_code ON public.master_countries(code) WHERE code IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS unique_currency_code ON public.master_currencies(code) WHERE code IS NOT NULL;

-- 5. Add check constraints for data validation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_reward_type_valid'
  ) THEN
    ALTER TABLE public.master_reward_types 
    ADD CONSTRAINT check_reward_type_valid 
    CHECK (type IN ('monetary', 'non-monetary') OR type IS NULL);
    RAISE NOTICE 'Added check constraint for reward types';
  END IF;
END $$;

-- 6. Create/update function for updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Add missing update triggers (check if they exist first)
DO $$
BEGIN
  -- Countries trigger
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_master_countries_updated_at'
  ) THEN
    CREATE TRIGGER update_master_countries_updated_at
      BEFORE UPDATE ON public.master_countries
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
    RAISE NOTICE 'Added update trigger for master_countries';
  END IF;

  -- Currencies trigger
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_master_currencies_updated_at'
  ) THEN
    CREATE TRIGGER update_master_currencies_updated_at
      BEFORE UPDATE ON public.master_currencies
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
    RAISE NOTICE 'Added update trigger for master_currencies';
  END IF;

  -- Departments trigger
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_master_departments_updated_at'
  ) THEN
    CREATE TRIGGER update_master_departments_updated_at
      BEFORE UPDATE ON public.master_departments
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
    RAISE NOTICE 'Added update trigger for master_departments';
  END IF;
END $$;

-- 8. Add table documentation
COMMENT ON TABLE public.master_domain_groups IS 'Domain groups with optional industry segment classification and hierarchical categories';
COMMENT ON TABLE public.master_categories IS 'Categories belong to domain groups and can have sub-categories';
COMMENT ON TABLE public.master_sub_categories IS 'Sub-categories belong to categories';
COMMENT ON TABLE public.master_departments IS 'Organizational departments with optional organization linkage';
COMMENT ON TABLE public.master_sub_departments IS 'Sub-departments belong to departments';
COMMENT ON TABLE public.master_team_units IS 'Team units belong to sub-departments';

-- 9. Final validation message
SELECT 'Database schema migration completed successfully!' as status;