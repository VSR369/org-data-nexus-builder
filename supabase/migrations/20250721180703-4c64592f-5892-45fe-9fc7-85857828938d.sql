
-- Create seeking_organization_roles table with simplified structure for testing
CREATE TABLE public.seeking_organization_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email_id TEXT NOT NULL,
  user_id TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  domain_group_id UUID REFERENCES public.master_domain_groups(id),
  category_id UUID REFERENCES public.master_categories(id),
  subcategory_id UUID REFERENCES public.master_sub_categories(id),
  department_id UUID REFERENCES public.master_departments(id),
  sub_department_id UUID REFERENCES public.master_sub_departments(id),
  team_unit_id UUID REFERENCES public.master_team_units(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT DEFAULT 'user',
  version INTEGER DEFAULT 1
);

-- Enable Row Level Security (simplified for testing)
ALTER TABLE public.seeking_organization_roles ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policy for authenticated users (testing mode)
CREATE POLICY "Allow all operations on seeking_organization_roles" 
ON public.seeking_organization_roles 
FOR ALL 
TO authenticated
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_seeking_organization_roles_updated_at
BEFORE UPDATE ON public.seeking_organization_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add some test data for the four roles
INSERT INTO public.seeking_organization_roles (role_name, mobile_number, email_id, user_id, password) VALUES
('Challenge Creator', '+1234567890', 'creator@test.com', 'creator123', 'pass'),
('Challenge Curator', '+1234567891', 'curator@test.com', 'curator123', 'pass'),
('Innovation Director', '+1234567892', 'director@test.com', 'director123', 'pass'),
('Expert Reviewer', '+1234567893', 'reviewer@test.com', 'reviewer123', 'pass');
