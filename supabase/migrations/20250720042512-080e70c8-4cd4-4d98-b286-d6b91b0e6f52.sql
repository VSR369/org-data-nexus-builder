
-- Clean up and recreate super admin user properly
-- This approach uses Supabase's built-in functions for proper auth user creation

-- First, clean up existing super admin user if it exists
DELETE FROM platform_administrators WHERE admin_email = 'admin@system.com';
DELETE FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@system.com');
DELETE FROM auth.users WHERE email = 'admin@system.com';

-- Create new super admin user using Supabase's auth system
-- This uses the proper auth functions that Supabase expects
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change_token_current
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@system.com',
  crypt('Admin123456!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System Administrator"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

-- Get the newly created user ID
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Get the user ID we just created
  SELECT id INTO new_user_id FROM auth.users WHERE email = 'admin@system.com';
  
  -- Create platform administrator record
  INSERT INTO platform_administrators (
    id,
    user_id,
    admin_name,
    admin_email,
    role_id,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    'System Administrator',
    'admin@system.com',
    (SELECT id FROM admin_roles WHERE role_name = 'super_admin'),
    true,
    now(),
    now()
  );
  
  -- Create profile record
  INSERT INTO profiles (
    id,
    custom_user_id,
    organization_name,
    contact_person_name,
    organization_type,
    entity_type,
    country
  ) VALUES (
    new_user_id,
    'SUPER_ADMIN_001',
    'System Administration',
    'System Administrator',
    'System',
    'System',
    'Global'
  );
END $$;

-- Verify the setup
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at,
  pa.admin_name,
  pa.is_active,
  ar.role_name,
  p.custom_user_id
FROM auth.users u
LEFT JOIN platform_administrators pa ON pa.user_id = u.id
LEFT JOIN admin_roles ar ON ar.id = pa.role_id
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'admin@system.com';
