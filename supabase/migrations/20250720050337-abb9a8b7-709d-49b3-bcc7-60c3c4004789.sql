
-- Development Mode: Remove All Authentication Barriers for Master Data
-- Make all master data operations available to public without authentication

-- Update restrictive policies to allow full public access

-- 1. Countries - Change from authenticated to public
DROP POLICY IF EXISTS "Super admin and authenticated users can manage countries" ON public.master_countries;
CREATE POLICY "Allow all operations on master_countries" 
ON public.master_countries 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 2. Currencies - Change from authenticated to public  
DROP POLICY IF EXISTS "Super admin and authenticated users can manage currencies" ON public.master_currencies;
CREATE POLICY "Allow all operations on master_currencies" 
ON public.master_currencies 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 3. Organization Types - Change from authenticated to public
DROP POLICY IF EXISTS "Super admin and authenticated users can manage organization typ" ON public.master_organization_types;
CREATE POLICY "Allow all operations on master_organization_types" 
ON public.master_organization_types 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Entity Types - Change from authenticated to public
DROP POLICY IF EXISTS "Super admin and authenticated users can manage entity types" ON public.master_entity_types;
CREATE POLICY "Allow all operations on master_entity_types" 
ON public.master_entity_types 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 5. Engagement Models - Change from authenticated to public
DROP POLICY IF EXISTS "Super admin and authenticated users can manage engagement model" ON public.master_engagement_models;
CREATE POLICY "Allow all operations on master_engagement_models" 
ON public.master_engagement_models 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 6. Industry Segments - Change from authenticated to public
DROP POLICY IF EXISTS "Super admin and authenticated users can manage industry segment" ON public.master_industry_segments;
CREATE POLICY "Allow all operations on master_industry_segments" 
ON public.master_industry_segments 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 7. Billing Frequencies - Change from authenticated to public
DROP POLICY IF EXISTS "Super admin and authenticated users can manage billing frequenc" ON public.master_billing_frequencies;
CREATE POLICY "Allow all operations on master_billing_frequencies" 
ON public.master_billing_frequencies 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 8. Membership Statuses - Change from authenticated to public
DROP POLICY IF EXISTS "Super admin and authenticated users can manage membership statu" ON public.master_membership_statuses;
CREATE POLICY "Allow all operations on master_membership_statuses" 
ON public.master_membership_statuses 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 9. Pricing Tiers - Change from authenticated to public
DROP POLICY IF EXISTS "Super admin and authenticated users can manage pricing tiers" ON public.master_pricing_tiers;
CREATE POLICY "Allow all operations on master_pricing_tiers" 
ON public.master_pricing_tiers 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 10. Fee Components - Change from authenticated to public
DROP POLICY IF EXISTS "Super admin and authenticated users can manage fee components" ON public.master_fee_components;
CREATE POLICY "Allow all operations on master_fee_components" 
ON public.master_fee_components 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Verify all policies are now public access
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename LIKE 'master_%'
ORDER BY tablename, policyname;
