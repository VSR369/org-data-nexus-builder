-- Update RLS policies for all master data tables to allow super admin access
-- Super admins should have full access to all master data

-- Master Billing Frequencies
DROP POLICY IF EXISTS "Allow all operations on billing frequencies" ON master_billing_frequencies;
CREATE POLICY "Super admin and authenticated users can manage billing frequencies" 
ON master_billing_frequencies 
FOR ALL 
TO authenticated 
USING (public.is_platform_admin() OR true) 
WITH CHECK (public.is_platform_admin() OR true);

-- Master Membership Statuses  
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON master_membership_statuses;
CREATE POLICY "Super admin and authenticated users can manage membership statuses" 
ON master_membership_statuses 
FOR ALL 
TO authenticated 
USING (public.is_platform_admin() OR true) 
WITH CHECK (public.is_platform_admin() OR true);

-- Master Countries
DROP POLICY IF EXISTS "Allow all operations on master_countries" ON master_countries;
CREATE POLICY "Super admin and authenticated users can manage countries" 
ON master_countries 
FOR ALL 
TO authenticated 
USING (public.is_platform_admin() OR true) 
WITH CHECK (public.is_platform_admin() OR true);

-- Master Currencies
DROP POLICY IF EXISTS "Allow all operations on master_currencies" ON master_currencies;
CREATE POLICY "Super admin and authenticated users can manage currencies" 
ON master_currencies 
FOR ALL 
TO authenticated 
USING (public.is_platform_admin() OR true) 
WITH CHECK (public.is_platform_admin() OR true);

-- Master Entity Types
DROP POLICY IF EXISTS "Allow all operations on master_entity_types" ON master_entity_types;
CREATE POLICY "Super admin and authenticated users can manage entity types" 
ON master_entity_types 
FOR ALL 
TO authenticated 
USING (public.is_platform_admin() OR true) 
WITH CHECK (public.is_platform_admin() OR true);

-- Master Organization Types
DROP POLICY IF EXISTS "Allow all operations on master_organization_types" ON master_organization_types;
CREATE POLICY "Super admin and authenticated users can manage organization types" 
ON master_organization_types 
FOR ALL 
TO authenticated 
USING (public.is_platform_admin() OR true) 
WITH CHECK (public.is_platform_admin() OR true);

-- Master Industry Segments
DROP POLICY IF EXISTS "Allow all operations on master_industry_segments" ON master_industry_segments;
CREATE POLICY "Super admin and authenticated users can manage industry segments" 
ON master_industry_segments 
FOR ALL 
TO authenticated 
USING (public.is_platform_admin() OR true) 
WITH CHECK (public.is_platform_admin() OR true);

-- Master Engagement Models
DROP POLICY IF EXISTS "Allow all operations on master_engagement_models" ON master_engagement_models;
CREATE POLICY "Super admin and authenticated users can manage engagement models" 
ON master_engagement_models 
FOR ALL 
TO authenticated 
USING (public.is_platform_admin() OR true) 
WITH CHECK (public.is_platform_admin() OR true);

-- Master Pricing Tiers
DROP POLICY IF EXISTS "Allow all operations on master_pricing_tiers" ON master_pricing_tiers;
CREATE POLICY "Super admin and authenticated users can manage pricing tiers" 
ON master_pricing_tiers 
FOR ALL 
TO authenticated 
USING (public.is_platform_admin() OR true) 
WITH CHECK (public.is_platform_admin() OR true);

-- Master Fee Components
DROP POLICY IF EXISTS "Allow all operations on master_fee_components" ON master_fee_components;
CREATE POLICY "Super admin and authenticated users can manage fee components" 
ON master_fee_components 
FOR ALL 
TO authenticated 
USING (public.is_platform_admin() OR true) 
WITH CHECK (public.is_platform_admin() OR true);