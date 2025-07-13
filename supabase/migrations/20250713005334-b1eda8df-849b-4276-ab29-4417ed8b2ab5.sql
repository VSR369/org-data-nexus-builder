-- Create Domain Groups tables
CREATE TABLE public.master_domain_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  industry_segment_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1,
  is_user_created BOOLEAN DEFAULT false,
  FOREIGN KEY (industry_segment_id) REFERENCES public.master_industry_segments(id)
);

CREATE TABLE public.master_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  domain_group_id UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1,
  is_user_created BOOLEAN DEFAULT false,
  FOREIGN KEY (domain_group_id) REFERENCES public.master_domain_groups(id) ON DELETE CASCADE
);

CREATE TABLE public.master_sub_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1,
  is_user_created BOOLEAN DEFAULT false,
  FOREIGN KEY (category_id) REFERENCES public.master_categories(id) ON DELETE CASCADE
);

-- Create Seeker Membership Fees table
CREATE TABLE public.master_seeker_membership_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  quarterly_amount NUMERIC,
  quarterly_currency TEXT,
  half_yearly_amount NUMERIC,
  half_yearly_currency TEXT,
  annual_amount NUMERIC,
  annual_currency TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1,
  is_user_created BOOLEAN DEFAULT false
);

-- Enable RLS on all tables
ALTER TABLE public.master_domain_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_seeker_membership_fees ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for master_domain_groups
CREATE POLICY "Allow all operations on master_domain_groups" 
ON public.master_domain_groups 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for master_categories
CREATE POLICY "Allow all operations on master_categories" 
ON public.master_categories 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for master_sub_categories
CREATE POLICY "Allow all operations on master_sub_categories" 
ON public.master_sub_categories 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for master_seeker_membership_fees
CREATE POLICY "Allow all operations on master_seeker_membership_fees" 
ON public.master_seeker_membership_fees 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_master_domain_groups_updated_at
BEFORE UPDATE ON public.master_domain_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_categories_updated_at
BEFORE UPDATE ON public.master_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_sub_categories_updated_at
BEFORE UPDATE ON public.master_sub_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_seeker_membership_fees_updated_at
BEFORE UPDATE ON public.master_seeker_membership_fees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();