-- Drop existing master_departments table and recreate with simple structure
DROP TABLE IF EXISTS public.master_departments CASCADE;

-- Create master_departments table (Level 1)
CREATE TABLE public.master_departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  organization_id TEXT,
  organization_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1
);

-- Create master_sub_departments table (Level 2)
CREATE TABLE public.master_sub_departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  department_id UUID NOT NULL REFERENCES public.master_departments(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1
);

-- Create master_team_units table (Level 3)
CREATE TABLE public.master_team_units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sub_department_id UUID NOT NULL REFERENCES public.master_sub_departments(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1
);

-- Enable Row Level Security
ALTER TABLE public.master_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_sub_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_team_units ENABLE ROW LEVEL SECURITY;

-- Create policies for departments
CREATE POLICY "Allow all operations on master_departments"
ON public.master_departments
FOR ALL
USING (true)
WITH CHECK (true);

-- Create policies for sub departments
CREATE POLICY "Allow all operations on master_sub_departments"
ON public.master_sub_departments
FOR ALL
USING (true)
WITH CHECK (true);

-- Create policies for team units
CREATE POLICY "Allow all operations on master_team_units"
ON public.master_team_units
FOR ALL
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_master_departments_organization_id ON public.master_departments(organization_id);
CREATE INDEX idx_master_sub_departments_department_id ON public.master_sub_departments(department_id);
CREATE INDEX idx_master_team_units_sub_department_id ON public.master_team_units(sub_department_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.master_departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sub_departments_updated_at
  BEFORE UPDATE ON public.master_sub_departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_units_updated_at
  BEFORE UPDATE ON public.master_team_units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();