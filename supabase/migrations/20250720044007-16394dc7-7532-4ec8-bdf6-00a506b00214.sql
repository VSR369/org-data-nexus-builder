
-- Complete fix for super admin authentication schema error
-- Root cause: email_change_token_current defaults to empty string instead of NULL

-- Step 1: Fix the specific admin user record
UPDATE auth.users 
SET 
  email_change = NULL,
  email_change_token_new = NULL,
  email_change_token_current = NULL,
  email_change_confirm_status = 0,
  updated_at = now()
WHERE email = 'admin@system.com';

-- Step 2: Fix the schema default value to prevent future issues
-- Change the default from empty string to NULL for email_change_token_current
ALTER TABLE auth.users 
ALTER COLUMN email_change_token_current SET DEFAULT NULL;

-- Step 3: Update any other users that might have empty string values
UPDATE auth.users 
SET 
  email_change_token_current = NULL,
  updated_at = now()
WHERE email_change_token_current = '';

-- Step 4: Verify the admin user record is properly fixed
SELECT 
  id,
  email,
  email_change,
  email_change_token_new,
  email_change_token_current,
  email_change_confirm_status,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users 
WHERE email = 'admin@system.com';

-- Step 5: Verify the schema default is now correct
SELECT column_name, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'auth' 
  AND table_name = 'users' 
  AND column_name = 'email_change_token_current';
