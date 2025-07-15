-- Create master_organization_categories table
CREATE TABLE public.master_organization_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_type TEXT NOT NULL CHECK (category_type IN ('solution_seeker', 'platform_provider', 'solution_provider')),
  workflow_config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1
);

-- Create junction table for organization type and category mapping
CREATE TABLE public.master_org_type_category_mapping (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_type_id UUID NOT NULL REFERENCES public.master_organization_types(id) ON DELETE CASCADE,
  organization_category_id UUID NOT NULL REFERENCES public.master_organization_categories(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_type_id, organization_category_id)
);

-- Create junction table for organization type and department mapping
CREATE TABLE public.master_org_type_department_mapping (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_type_id UUID NOT NULL REFERENCES public.master_organization_types(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.master_departments(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_type_id, department_id)
);

-- Create junction table for organization category and department mapping
CREATE TABLE public.master_org_category_department_mapping (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_category_id UUID NOT NULL REFERENCES public.master_organization_categories(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.master_departments(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_category_id, department_id)
);

-- Add organization_category_id to organizations table
ALTER TABLE public.organizations 
ADD COLUMN organization_category_id UUID REFERENCES public.master_organization_categories(id);

-- Enable RLS on all new tables
ALTER TABLE public.master_organization_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_org_type_category_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_org_type_department_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_org_category_department_mapping ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all new tables
CREATE POLICY "Allow all operations on master_organization_categories" 
ON public.master_organization_categories 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on master_org_type_category_mapping" 
ON public.master_org_type_category_mapping 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on master_org_type_department_mapping" 
ON public.master_org_type_department_mapping 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on master_org_category_department_mapping" 
ON public.master_org_category_department_mapping 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_master_organization_categories_updated_at
  BEFORE UPDATE ON public.master_organization_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_org_type_category_mapping_updated_at
  BEFORE UPDATE ON public.master_org_type_category_mapping
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_org_type_department_mapping_updated_at
  BEFORE UPDATE ON public.master_org_type_department_mapping
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_org_category_department_mapping_updated_at
  BEFORE UPDATE ON public.master_org_category_department_mapping
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial organization categories
INSERT INTO public.master_organization_categories (name, description, category_type) VALUES
('Solution Seeking Organization', 'Organizations that seek solutions to their business challenges', 'solution_seeker'),
('Platform Provider Organization', 'Organizations that provide platform infrastructure and services', 'platform_provider'),
('Solution Provider Organization', 'Organizations that provide solutions to business challenges', 'solution_provider'),
('Individual Solution Provider', 'Individual professionals who provide solutions', 'solution_provider');

-- Create indexes for better performance
CREATE INDEX idx_master_organization_categories_category_type ON public.master_organization_categories(category_type);
CREATE INDEX idx_master_organization_categories_is_active ON public.master_organization_categories(is_active);
CREATE INDEX idx_master_org_type_category_mapping_org_type ON public.master_org_type_category_mapping(organization_type_id);
CREATE INDEX idx_master_org_type_category_mapping_org_category ON public.master_org_type_category_mapping(organization_category_id);
CREATE INDEX idx_master_org_type_department_mapping_org_type ON public.master_org_type_department_mapping(organization_type_id);
CREATE INDEX idx_master_org_type_department_mapping_department ON public.master_org_type_department_mapping(department_id);
CREATE INDEX idx_master_org_category_department_mapping_org_category ON public.master_org_category_department_mapping(organization_category_id);
CREATE INDEX idx_master_org_category_department_mapping_department ON public.master_org_category_department_mapping(department_id);