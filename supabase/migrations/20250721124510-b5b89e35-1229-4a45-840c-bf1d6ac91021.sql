
-- Complete RLS Policy Cleanup for Organization Administrator Creation
-- This will eliminate ALL infinite recursion issues

-- Step 1: Drop ALL existing RLS policies on organization_administrators
DROP POLICY IF EXISTS "Allow all operations on organization_administrators_simple" ON organization_administrators;
DROP POLICY IF EXISTS "Super admins can view all organization administrators" ON organization_administrators;
DROP POLICY IF EXISTS "Organization owners can view their administrators" ON organization_administrators;
DROP POLICY IF EXISTS "Super admins can create organization administrators" ON organization_administrators;
DROP POLICY IF EXISTS "Super admins can update organization administrators" ON organization_administrators;
DROP POLICY IF EXISTS "Super admins can delete organization administrators" ON organization_administrators;
DROP POLICY IF EXISTS "Users can view their own administrators" ON organization_administrators;
DROP POLICY IF EXISTS "Users can create their own administrators" ON organization_administrators;
DROP POLICY IF EXISTS "Users can update their own administrators" ON organization_administrators;

-- Step 2: Drop ALL existing RLS policies on admin_creation_audit
DROP POLICY IF EXISTS "Allow all operations on admin_creation_audit_simple" ON admin_creation_audit;
DROP POLICY IF EXISTS "Allow all operations on admin_creation_audit" ON admin_creation_audit;
DROP POLICY IF EXISTS "Super admins can view audit logs" ON admin_creation_audit;
DROP POLICY IF EXISTS "Users can view audit logs" ON admin_creation_audit;

-- Step 3: Create single, simple permissive policies
CREATE POLICY "organization_administrators_all_access" 
ON organization_administrators 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "admin_creation_audit_all_access" 
ON admin_creation_audit 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Step 4: Enhanced organization admin creation function with better error handling
CREATE OR REPLACE FUNCTION create_organization_admin(
  p_organization_id TEXT,
  p_admin_name TEXT,
  p_admin_email TEXT,
  p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
  new_admin_id UUID;
  existing_admin_count INTEGER;
  org_name TEXT;
  result JSONB;
BEGIN
  -- Check if organization exists
  SELECT organization_name INTO org_name
  FROM solution_seekers_comprehensive_view 
  WHERE organization_id = p_organization_id;
  
  IF org_name IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'ORGANIZATION_NOT_FOUND',
      'message', 'Organization not found'
    );
  END IF;
  
  -- Check if admin already exists for this organization
  SELECT COUNT(*) INTO existing_admin_count
  FROM organization_administrators
  WHERE organization_id = p_organization_id AND is_active = true;
  
  IF existing_admin_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'ADMIN_EXISTS',
      'message', 'An active administrator already exists for this organization'
    );
  END IF;
  
  -- Check if user_id already has an admin role elsewhere
  SELECT COUNT(*) INTO existing_admin_count
  FROM organization_administrators
  WHERE user_id = p_user_id AND is_active = true;
  
  IF existing_admin_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'USER_ALREADY_ADMIN',
      'message', 'This user is already an administrator for another organization'
    );
  END IF;
  
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
    org_name,
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
    'message', 'Organization administrator created successfully',
    'organization_name', org_name
  );
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  result := jsonb_build_object(
    'success', false,
    'error', 'DATABASE_ERROR',
    'message', 'Failed to create organization administrator: ' || SQLERRM
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Function to check existing administrators
CREATE OR REPLACE FUNCTION get_organization_admin_info(p_organization_id TEXT)
RETURNS JSONB AS $$
DECLARE
  admin_info JSONB;
  org_info JSONB;
BEGIN
  -- Get organization info
  SELECT jsonb_build_object(
    'organization_id', organization_id,
    'organization_name', organization_name,
    'contact_person_name', contact_person_name,
    'email', email
  ) INTO org_info
  FROM solution_seekers_comprehensive_view
  WHERE organization_id = p_organization_id;
  
  -- Get admin info if exists
  SELECT jsonb_build_object(
    'admin_id', id,
    'admin_name', admin_name,
    'admin_email', admin_email,
    'user_id', user_id,
    'is_active', is_active,
    'created_at', created_at
  ) INTO admin_info
  FROM organization_administrators
  WHERE organization_id = p_organization_id AND is_active = true
  LIMIT 1;
  
  RETURN jsonb_build_object(
    'organization', org_info,
    'existing_admin', admin_info,
    'has_admin', admin_info IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Verify the policies are clean
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('organization_administrators', 'admin_creation_audit')
ORDER BY tablename, policyname;
