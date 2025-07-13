-- Create master_categories table
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
  CONSTRAINT fk_categories_domain_group FOREIGN KEY (domain_group_id) REFERENCES public.master_domain_groups(id) ON DELETE CASCADE
);

-- Create master_sub_categories table
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
  CONSTRAINT fk_sub_categories_category FOREIGN KEY (category_id) REFERENCES public.master_categories(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.master_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_sub_categories ENABLE ROW LEVEL SECURITY;

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

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_master_categories_updated_at
  BEFORE UPDATE ON public.master_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_sub_categories_updated_at
  BEFORE UPDATE ON public.master_sub_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_categories_domain_group_id ON public.master_categories(domain_group_id);
CREATE INDEX idx_sub_categories_category_id ON public.master_sub_categories(category_id);

-- Migrate data from JSONB hierarchy to normalized tables
DO $$
DECLARE
    domain_group_record RECORD;
    category_record JSONB;
    sub_category_record JSONB;
    new_category_id UUID;
BEGIN
    -- Loop through all domain groups that have hierarchy data
    FOR domain_group_record IN 
        SELECT id, name, hierarchy 
        FROM public.master_domain_groups 
        WHERE hierarchy IS NOT NULL AND hierarchy != '{}'::jsonb
    LOOP
        -- Check if hierarchy has categories
        IF domain_group_record.hierarchy ? 'categories' THEN
            -- Loop through categories in the hierarchy
            FOR category_record IN 
                SELECT * FROM jsonb_array_elements(domain_group_record.hierarchy->'categories')
            LOOP
                -- Insert category
                INSERT INTO public.master_categories (
                    id,
                    name, 
                    description, 
                    domain_group_id, 
                    is_active,
                    created_at,
                    updated_at
                ) VALUES (
                    COALESCE((category_record->>'id')::UUID, gen_random_uuid()),
                    category_record->>'name',
                    category_record->>'description',
                    domain_group_record.id,
                    COALESCE((category_record->>'isActive')::BOOLEAN, true),
                    COALESCE((category_record->>'createdAt')::TIMESTAMP WITH TIME ZONE, now()),
                    now()
                ) RETURNING id INTO new_category_id;

                -- Check if category has sub-categories
                IF category_record ? 'subCategories' THEN
                    -- Loop through sub-categories
                    FOR sub_category_record IN 
                        SELECT * FROM jsonb_array_elements(category_record->'subCategories')
                    LOOP
                        -- Insert sub-category
                        INSERT INTO public.master_sub_categories (
                            id,
                            name, 
                            description, 
                            category_id, 
                            is_active,
                            created_at,
                            updated_at
                        ) VALUES (
                            COALESCE((sub_category_record->>'id')::UUID, gen_random_uuid()),
                            sub_category_record->>'name',
                            sub_category_record->>'description',
                            new_category_id,
                            COALESCE((sub_category_record->>'isActive')::BOOLEAN, true),
                            COALESCE((sub_category_record->>'createdAt')::TIMESTAMP WITH TIME ZONE, now()),
                            now()
                        );
                    END LOOP;
                END IF;
            END LOOP;
        END IF;
    END LOOP;
END $$;