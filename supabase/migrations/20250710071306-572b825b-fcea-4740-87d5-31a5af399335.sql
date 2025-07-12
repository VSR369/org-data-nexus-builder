
-- Create enhanced profiles table to store all organization registration data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Custom business identifier (what user enters as "User ID")
  custom_user_id TEXT UNIQUE NOT NULL,
  
  -- Organization details
  organization_name TEXT NOT NULL,
  organization_id TEXT,
  organization_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  industry_segment TEXT,
  
  -- Location and contact
  country TEXT NOT NULL,
  address TEXT,
  website TEXT,
  
  -- Contact person details
  contact_person_name TEXT NOT NULL,
  phone_number TEXT,
  country_code TEXT,
  
  -- File storage references
  registration_documents TEXT[], -- Array of file URLs/paths
  company_profile TEXT[], -- Array of file URLs/paths  
  company_logo TEXT[], -- Array of file URLs/paths
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('registration-documents', 'registration-documents', false),
  ('company-profiles', 'company-profiles', false),
  ('company-logos', 'company-logos', false);

-- Create storage policies
CREATE POLICY "Users can upload their own registration documents"
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'registration-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own registration documents"
ON storage.objects FOR SELECT 
USING (bucket_id = 'registration-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own company profiles"
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'company-profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own company profiles"
ON storage.objects FOR SELECT 
USING (bucket_id = 'company-profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own company logos"
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own company logos"
ON storage.objects FOR SELECT 
USING (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_profiles_custom_user_id ON public.profiles(custom_user_id);
CREATE INDEX idx_profiles_organization_name ON public.profiles(organization_name);
CREATE INDEX idx_profiles_organization_type ON public.profiles(organization_type);
CREATE INDEX idx_profiles_country ON public.profiles(country);
