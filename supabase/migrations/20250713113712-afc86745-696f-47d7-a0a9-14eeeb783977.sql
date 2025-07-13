-- Fix database schema issues for organization registration
-- Remove password_hash NOT NULL constraint since we're using Supabase Auth
ALTER TABLE public.organizations 
ALTER COLUMN password_hash DROP NOT NULL;

-- Delete the existing auth user vsr@btbt.co.in to allow fresh registration
-- This will also cascade delete any related organization records via user_id
DELETE FROM auth.users WHERE email = 'vsr@btbt.co.in';