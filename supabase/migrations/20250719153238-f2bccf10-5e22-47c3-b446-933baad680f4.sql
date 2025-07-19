
-- Disable RLS on organization_administrators table
ALTER TABLE public.organization_administrators DISABLE ROW LEVEL SECURITY;

-- Disable RLS on admin_creation_audit table  
ALTER TABLE public.admin_creation_audit DISABLE ROW LEVEL SECURITY;

-- Disable RLS on platform_administrators table
ALTER TABLE public.platform_administrators DISABLE ROW LEVEL SECURITY;

-- Drop the problematic recursive policies to prevent future issues
-- (These will be commented out since the tables now have RLS disabled, but keeping for reference)

-- DROP POLICY IF EXISTS "Super admins can create administrators" ON public.organization_administrators;
-- DROP POLICY IF EXISTS "Super admins can update administrators" ON public.organization_administrators;  
-- DROP POLICY IF EXISTS "Super admins can view all administrators" ON public.organization_administrators;
-- DROP POLICY IF EXISTS "Super admins can view audit logs" ON public.admin_creation_audit;

-- Note: All existing data and table structures remain intact
-- RLS can be re-enabled in production with proper policies
