-- Add user_id column to organizations table to link with auth.users
ALTER TABLE public.organizations 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_organizations_user_id ON public.organizations(user_id);

-- Update RLS policies to work with auth users
DROP POLICY IF EXISTS "Organizations can update their own data" ON public.organizations;

CREATE POLICY "Organizations can update their own data" 
ON public.organizations 
FOR UPDATE 
USING (user_id = auth.uid());

-- Allow users to view their own organization data
CREATE POLICY "Users can view their own organization" 
ON public.organizations 
FOR SELECT 
USING (user_id = auth.uid());

-- Update organization_documents policies to use user_id
DROP POLICY IF EXISTS "Organization documents can be viewed by organization owner" ON public.organization_documents;

CREATE POLICY "Organization documents can be viewed by organization owner" 
ON public.organization_documents 
FOR SELECT 
USING (organization_id IN (
  SELECT id FROM organizations 
  WHERE user_id = auth.uid()
));