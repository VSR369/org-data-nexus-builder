-- Phase 1: Create organization registration system tables

-- Create organizations table with proper foreign keys to master data
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id TEXT NOT NULL UNIQUE, -- Auto-generated format ORG-XXXXXXXXX
  organization_name TEXT NOT NULL,
  organization_type_id UUID REFERENCES public.master_organization_types(id),
  entity_type_id UUID REFERENCES public.master_entity_types(id),
  industry_segment_id UUID REFERENCES public.master_industry_segments(id),
  website TEXT,
  country_id UUID REFERENCES public.master_countries(id),
  address TEXT NOT NULL,
  contact_person_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  country_code TEXT,
  phone_number TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  registration_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organization_documents table for file metadata storage
CREATE TABLE public.organization_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'company_profile' or 'company_logo'
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for organizations table
CREATE POLICY "Organizations can be viewed by everyone" 
ON public.organizations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert organizations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Organizations can update their own data" 
ON public.organizations 
FOR UPDATE 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create policies for organization_documents table
CREATE POLICY "Organization documents can be viewed by organization owner" 
ON public.organization_documents 
FOR SELECT 
USING (organization_id IN (
  SELECT id FROM public.organizations WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
));

CREATE POLICY "Anyone can insert organization documents" 
ON public.organization_documents 
FOR INSERT 
WITH CHECK (true);

-- Create function to generate organization ID
CREATE OR REPLACE FUNCTION public.generate_organization_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    id_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random 8-character alphanumeric string
        new_id := 'ORG-' || upper(substr(md5(random()::text), 1, 8));
        
        -- Check if this ID already exists
        SELECT EXISTS(SELECT 1 FROM public.organizations WHERE organization_id = new_id) INTO id_exists;
        
        -- If ID doesn't exist, we can use it
        IF NOT id_exists THEN
            RETURN new_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate organization ID
CREATE OR REPLACE FUNCTION public.set_organization_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.organization_id IS NULL OR NEW.organization_id = '' THEN
        NEW.organization_id := public.generate_organization_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_organization_id_trigger
    BEFORE INSERT ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_organization_id();

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();