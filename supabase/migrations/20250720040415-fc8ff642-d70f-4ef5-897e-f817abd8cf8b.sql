
-- Create the super admin user account and link it to the existing platform administrator
-- First, let's insert a user record into auth.users (this simulates what would happen during signup)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'admin@system.com',
  crypt('SuperAdmin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System Administrator"}',
  false,
  'authenticated'
);

-- Update the existing platform administrator record to link it to the new auth user
UPDATE platform_administrators 
SET user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@system.com'
)
WHERE admin_email = 'admin@system.com';

-- Create a profile record for the super admin user
INSERT INTO profiles (
  id,
  custom_user_id,
  organization_name,
  contact_person_name,
  organization_type,
  entity_type,
  country
) 
SELECT 
  u.id,
  'SUPER_ADMIN_001',
  'System Administration',
  'System Administrator',
  'System',
  'System',
  'Global'
FROM auth.users u 
WHERE u.email = 'admin@system.com'
ON CONFLICT (id) DO NOTHING;

-- Verify the setup by checking if is_platform_admin() works
-- This is just for verification, not a permanent query
SELECT 
  u.email,
  pa.admin_name,
  pa.role_id,
  ar.role_name,
  pa.is_active,
  (u.id IS NOT NULL) as has_auth_user,
  is_platform_admin() as is_admin_function_result
FROM auth.users u
LEFT JOIN platform_administrators pa ON pa.user_id = u.id
LEFT JOIN admin_roles ar ON ar.id = pa.role_id
WHERE u.email = 'admin@system.com';
