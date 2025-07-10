
-- First, let's fix the RLS policy issue for profiles table
-- The current policy requires auth.uid() which won't work during registration
-- We need to allow authenticated users to insert their own profiles

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a new policy that allows users to insert profiles during registration
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Also ensure we have a policy for users to read their own profiles after login
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- And update policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);
