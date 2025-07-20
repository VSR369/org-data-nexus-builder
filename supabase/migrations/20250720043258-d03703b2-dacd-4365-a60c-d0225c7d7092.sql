
-- Fix the super admin authentication schema error
-- Update email change fields to NULL to resolve the database query error
UPDATE auth.users 
SET 
  email_change = NULL,
  email_change_token_new = NULL,
  email_change_token_current = NULL,
  email_change_confirm_status = 0,
  updated_at = now()
WHERE email = 'admin@system.com';

-- Verify the fix by checking the updated record
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
