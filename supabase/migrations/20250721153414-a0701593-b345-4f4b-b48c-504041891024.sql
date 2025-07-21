
-- Step 1: Remove all complex admin-related tables and functions
DROP TABLE IF EXISTS admin_creation_audit CASCADE;
DROP TABLE IF EXISTS organization_administrators CASCADE;
DROP TABLE IF EXISTS validation_audit_log CASCADE;
DROP TABLE IF EXISTS organization_validation_tracking CASCADE;

-- Step 2: Drop all admin-related functions
DROP FUNCTION IF EXISTS create_organization_admin(text, text, text, uuid) CASCADE;
DROP FUNCTION IF EXISTS get_organization_admin_info(text) CASCADE;
DROP FUNCTION IF EXISTS get_organization_admin_summary(text) CASCADE;
DROP FUNCTION IF EXISTS check_validation_prerequisites(text) CASCADE;
DROP FUNCTION IF EXISTS update_validation_status(text, text, text, text, uuid) CASCADE;
DROP FUNCTION IF EXISTS initialize_organization_validation(text, text) CASCADE;
DROP FUNCTION IF EXISTS auto_initialize_validation_tracking() CASCADE;

-- Step 3: Create simple org_admins table
CREATE TABLE public.org_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id), -- One admin per organization
  UNIQUE(user_id) -- One user can only be admin of one org
);

-- Step 4: Enable simple RLS
ALTER TABLE public.org_admins ENABLE ROW LEVEL SECURITY;

-- Step 5: Create simple RLS policy - users can only see their own admin record
CREATE POLICY "Users can manage their own admin record" 
ON public.org_admins 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Step 6: Create simple function to check if user is org admin
CREATE OR REPLACE FUNCTION public.is_org_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id
  FROM public.org_admins
  WHERE user_id = check_user_id
  LIMIT 1;
$$;
