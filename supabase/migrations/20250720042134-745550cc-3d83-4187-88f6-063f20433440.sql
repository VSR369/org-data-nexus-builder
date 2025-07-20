
-- Fix the super admin password by updating it properly
-- This will set a new secure password that can be used to log in

UPDATE auth.users 
SET 
  encrypted_password = crypt('SuperAdmin2024!', gen_salt('bf')),
  updated_at = now()
WHERE email = 'admin@system.com';

-- Verify the update worked
SELECT 
  email,
  created_at,
  updated_at,
  email_confirmed_at
FROM auth.users 
WHERE email = 'admin@system.com';
