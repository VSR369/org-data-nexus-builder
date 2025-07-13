-- Create master data tables for localStorage migration
-- Each table supports user-created records, versioning, and audit trails

-- 1. Countries Master Data
CREATE TABLE public.master_countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Currencies Master Data
CREATE TABLE public.master_currencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  symbol TEXT,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Organization Types Master Data
CREATE TABLE public.master_organization_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Entity Types Master Data
CREATE TABLE public.master_entity_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Departments Master Data
CREATE TABLE public.master_departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Industry Segments Master Data
CREATE TABLE public.master_industry_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Competency Capabilities Master Data
CREATE TABLE public.master_competency_capabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Engagement Models Master Data
CREATE TABLE public.master_engagement_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. Challenge Statuses Master Data
CREATE TABLE public.master_challenge_statuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. Solution Statuses Master Data
CREATE TABLE public.master_solution_statuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Reward Types Master Data
CREATE TABLE public.master_reward_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 12. Communication Types Master Data
CREATE TABLE public.master_communication_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_user_created BOOLEAN DEFAULT false,
  created_by TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security for all tables
ALTER TABLE public.master_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_organization_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_entity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_industry_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_competency_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_engagement_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_challenge_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_solution_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_reward_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_communication_types ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies for all operations (public access for master data)
-- Countries
CREATE POLICY "Allow all operations on master_countries" ON public.master_countries FOR ALL USING (true) WITH CHECK (true);

-- Currencies
CREATE POLICY "Allow all operations on master_currencies" ON public.master_currencies FOR ALL USING (true) WITH CHECK (true);

-- Organization Types
CREATE POLICY "Allow all operations on master_organization_types" ON public.master_organization_types FOR ALL USING (true) WITH CHECK (true);

-- Entity Types
CREATE POLICY "Allow all operations on master_entity_types" ON public.master_entity_types FOR ALL USING (true) WITH CHECK (true);

-- Departments
CREATE POLICY "Allow all operations on master_departments" ON public.master_departments FOR ALL USING (true) WITH CHECK (true);

-- Industry Segments
CREATE POLICY "Allow all operations on master_industry_segments" ON public.master_industry_segments FOR ALL USING (true) WITH CHECK (true);

-- Competency Capabilities
CREATE POLICY "Allow all operations on master_competency_capabilities" ON public.master_competency_capabilities FOR ALL USING (true) WITH CHECK (true);

-- Engagement Models
CREATE POLICY "Allow all operations on master_engagement_models" ON public.master_engagement_models FOR ALL USING (true) WITH CHECK (true);

-- Challenge Statuses
CREATE POLICY "Allow all operations on master_challenge_statuses" ON public.master_challenge_statuses FOR ALL USING (true) WITH CHECK (true);

-- Solution Statuses
CREATE POLICY "Allow all operations on master_solution_statuses" ON public.master_solution_statuses FOR ALL USING (true) WITH CHECK (true);

-- Reward Types
CREATE POLICY "Allow all operations on master_reward_types" ON public.master_reward_types FOR ALL USING (true) WITH CHECK (true);

-- Communication Types
CREATE POLICY "Allow all operations on master_communication_types" ON public.master_communication_types FOR ALL USING (true) WITH CHECK (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_master_countries_updated_at
  BEFORE UPDATE ON public.master_countries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_currencies_updated_at
  BEFORE UPDATE ON public.master_currencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_organization_types_updated_at
  BEFORE UPDATE ON public.master_organization_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_entity_types_updated_at
  BEFORE UPDATE ON public.master_entity_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_departments_updated_at
  BEFORE UPDATE ON public.master_departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_industry_segments_updated_at
  BEFORE UPDATE ON public.master_industry_segments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_competency_capabilities_updated_at
  BEFORE UPDATE ON public.master_competency_capabilities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_engagement_models_updated_at
  BEFORE UPDATE ON public.master_engagement_models
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_challenge_statuses_updated_at
  BEFORE UPDATE ON public.master_challenge_statuses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_solution_statuses_updated_at
  BEFORE UPDATE ON public.master_solution_statuses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_reward_types_updated_at
  BEFORE UPDATE ON public.master_reward_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_communication_types_updated_at
  BEFORE UPDATE ON public.master_communication_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();