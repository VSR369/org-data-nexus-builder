
-- Complete Super Admin Authentication Schema Fix
-- Root cause: email_change_token_current and related fields have inconsistent defaults and values

-- Step 1: Fix ALL email change related column defaults to NULL
ALTER TABLE auth.users 
ALTER COLUMN email_change SET DEFAULT NULL;

ALTER TABLE auth.users 
ALTER COLUMN email_change_token_new SET DEFAULT NULL;

ALTER TABLE auth.users 
ALTER COLUMN email_change_token_current SET DEFAULT NULL;

-- Step 2: Normalize ALL existing users to have NULL values instead of empty strings
UPDATE auth.users 
SET 
  email_change = NULL,
  email_change_token_new = NULL,
  email_change_token_current = NULL,
  updated_at = now()
WHERE 
  email_change = '' OR 
  email_change_token_new = '' OR 
  email_change_token_current = '';

-- Step 3: Ensure admin user record is properly refreshed
UPDATE auth.users 
SET 
  email_change = NULL,
  email_change_token_new = NULL,
  email_change_token_current = NULL,
  email_change_confirm_status = 0,
  updated_at = now()
WHERE email = 'admin@system.com';

-- Step 4: Verify the admin user exists and has correct structure
SELECT 
  id,
  email,
  email_confirmed_at,
  email_change,
  email_change_token_new,
  email_change_token_current,
  email_change_confirm_status,
  created_at,
  updated_at
FROM auth.users 
WHERE email = 'admin@system.com';

-- Step 5: Verify schema defaults are now correctly set to NULL
SELECT 
  column_name, 
  column_default, 
  is_nullable,
  data_type 
FROM information_schema.columns 
WHERE table_schema = 'auth' 
  AND table_name = 'users' 
  AND column_name IN ('email_change', 'email_change_token_current', 'email_change_token_new');

-- Step 6: Check platform administrator role is properly linked
SELECT 
  u.email,
  pa.admin_name,
  pa.is_active,
  ar.role_name
FROM auth.users u
LEFT JOIN platform_administrators pa ON pa.user_id = u.id
LEFT JOIN admin_roles ar ON ar.id = pa.role_id
WHERE u.email = 'admin@system.com';
