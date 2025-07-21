
-- Development Mode: Remove All Authentication Barriers
-- Make all operations available to all users without restrictions

-- 1. Enable RLS on tables that don't have it enabled but have policies
ALTER TABLE public.admin_creation_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_administrators ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies and replace with permissive ones

-- Admin Creation Audit - Remove super admin restriction
DROP POLICY IF EXISTS "Super admins can view audit logs" ON public.admin_creation_audit;
CREATE POLICY "Allow all operations on admin_creation_audit" 
ON public.admin_creation_audit 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Organization Administrators - Remove all restrictive policies
DROP POLICY IF EXISTS "Super admins can view all organization administrators" ON public.organization_administrators;
DROP POLICY IF EXISTS "Organization owners can view their administrators" ON public.organization_administrators;
DROP POLICY IF EXISTS "Super admins can create organization administrators" ON public.organization_administrators;
DROP POLICY IF EXISTS "Super admins can update organization administrators" ON public.organization_administrators;
DROP POLICY IF EXISTS "Super admins can delete organization administrators" ON public.organization_administrators;

CREATE POLICY "Allow all operations on organization_administrators" 
ON public.organization_administrators 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Organization Documents - Remove owner restriction
DROP POLICY IF EXISTS "Organization documents can be viewed by organization owner" ON public.organization_documents;
DROP POLICY IF EXISTS "Anyone can insert organization documents" ON public.organization_documents;

CREATE POLICY "Allow all operations on organization_documents" 
ON public.organization_documents 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Organizations - Remove user-specific restrictions
DROP POLICY IF EXISTS "Organizations can update their own data" ON public.organizations;
DROP POLICY IF EXISTS "Users can view their own organization" ON public.organizations;
DROP POLICY IF EXISTS "Organizations can be viewed by everyone" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can insert organizations" ON public.organizations;

CREATE POLICY "Allow all operations on organizations" 
ON public.organizations 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Platform Administrators - Remove super admin restriction
DROP POLICY IF EXISTS "Super admins can view platform administrators" ON public.platform_administrators;
DROP POLICY IF EXISTS "Super admins can manage platform administrators" ON public.platform_administrators;

CREATE POLICY "Allow all operations on platform_administrators" 
ON public.platform_administrators 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Profiles - Remove user-specific restrictions
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Allow all operations on profiles" 
ON public.profiles 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 3. Add missing tables that might need permissive policies
-- Organization Validation Tracking
DROP POLICY IF EXISTS "Allow authenticated users to read validation tracking" ON public.organization_validation_tracking;
DROP POLICY IF EXISTS "Allow authenticated users to update validation tracking" ON public.organization_validation_tracking;
DROP POLICY IF EXISTS "Allow authenticated users to insert validation tracking" ON public.organization_validation_tracking;

CREATE POLICY "Allow all operations on organization_validation_tracking" 
ON public.organization_validation_tracking 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Validation Audit Log
DROP POLICY IF EXISTS "Allow authenticated users to read audit log" ON public.validation_audit_log;
DROP POLICY IF EXISTS "Allow authenticated users to insert audit log" ON public.validation_audit_log;

CREATE POLICY "Allow all operations on validation_audit_log" 
ON public.validation_audit_log 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Member Status Change Alerts
DROP POLICY IF EXISTS "Allow authenticated users to read status change alerts" ON public.member_status_change_alerts;
DROP POLICY IF EXISTS "Allow authenticated users to update status change alerts" ON public.member_status_change_alerts;

CREATE POLICY "Allow all operations on member_status_change_alerts" 
ON public.member_status_change_alerts 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Verify all tables now have permissive policies
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
  AND (qual != 'true' OR with_check != 'true')
ORDER BY tablename, policyname;
