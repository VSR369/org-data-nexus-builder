
-- Phase 1: Remove Super Administrator Infrastructure Completely
-- This will eliminate infinite recursion and simplify the organization admin creation process

-- Step 1: Remove foreign key dependencies first
ALTER TABLE admin_creation_audit DROP COLUMN IF EXISTS platform_admin_id;
ALTER TABLE organization_administrators DROP COLUMN IF EXISTS created_by;

-- Step 2: Drop super admin related tables
DROP TABLE IF EXISTS platform_administrators CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;

-- Step 3: Remove super admin functions
DROP FUNCTION IF EXISTS is_platform_admin() CASCADE;

-- Step 4: Simplify RLS policies - Remove all complex recursive policies
-- Replace with simple permissive policies for development

-- Organization Administrators - Remove complex policies
DROP POLICY IF EXISTS "Super admins can view all organization administrators" ON organization_administrators;
DROP POLICY IF EXISTS "Organization owners can view their administrators" ON organization_administrators;
DROP POLICY IF EXISTS "Super admins can create organization administrators" ON organization_administrators;
DROP POLICY IF EXISTS "Super admins can update organization administrators" ON organization_administrators;
DROP POLICY IF EXISTS "Super admins can delete organization administrators" ON organization_administrators;

-- Create simple permissive policy for organization administrators
CREATE POLICY "Allow all operations on organization_administrators_simple" 
ON organization_administrators 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Admin Creation Audit - Simplify policies
DROP POLICY IF EXISTS "Super admins can view audit logs" ON admin_creation_audit;

CREATE POLICY "Allow all operations on admin_creation_audit_simple" 
ON admin_creation_audit 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Step 5: Update admin_creation_audit table structure
-- Remove platform admin references and simplify
ALTER TABLE admin_creation_audit 
ADD COLUMN IF NOT EXISTS created_by_email TEXT DEFAULT 'system@admin.local';

-- Step 6: Clean up any existing data references
UPDATE admin_creation_audit 
SET created_by_email = 'system@admin.local' 
WHERE created_by_email IS NULL;

-- Step 7: Create a simple function to handle organization admin creation
CREATE OR REPLACE FUNCTION create_organization_admin(
  p_organization_id TEXT,
  p_admin_name TEXT,
  p_admin_email TEXT,
  p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
  new_admin_id UUID;
  result JSONB;
BEGIN
  -- Insert the organization administrator record
  INSERT INTO organization_administrators (
    organization_id,
    user_id,
    admin_name,
    admin_email,
    role_type,
    is_active
  ) VALUES (
    p_organization_id,
    p_user_id,
    p_admin_name,
    p_admin_email,
    'admin',
    true
  ) RETURNING id INTO new_admin_id;
  
  -- Create audit record
  INSERT INTO admin_creation_audit (
    organization_id,
    organization_name,
    admin_name,
    admin_email,
    created_admin_id,
    action_type,
    created_by_email,
    notes
  ) VALUES (
    p_organization_id,
    (SELECT organization_name FROM solution_seekers_comprehensive_view WHERE organization_id = p_organization_id LIMIT 1),
    p_admin_name,
    p_admin_email,
    new_admin_id,
    'admin_created',
    'system@admin.local',
    'Organization administrator created via simplified workflow'
  );
  
  result := jsonb_build_object(
    'success', true,
    'admin_id', new_admin_id,
    'message', 'Organization administrator created successfully'
  );
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  result := jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'message', 'Failed to create organization administrator'
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Verify the cleanup
SELECT 
  'Super admin tables removed' as status,
  NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'platform_administrators') as platform_admins_removed,
  NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_roles') as admin_roles_removed;
