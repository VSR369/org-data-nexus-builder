-- Create RLS policies for profiles table to allow authenticated users to manage their own profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Function to automatically create profile when organization is created
CREATE OR REPLACE FUNCTION public.create_profile_from_organization()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if user_id is provided and no profile exists
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO public.profiles (
      id,
      custom_user_id,
      organization_name,
      organization_id,
      contact_person_name,
      organization_type,
      entity_type,
      country,
      country_code,
      industry_segment,
      address,
      phone_number,
      website
    )
    SELECT 
      NEW.user_id,
      NEW.organization_id,
      NEW.organization_name,
      NEW.organization_id,
      NEW.contact_person_name,
      ot.name as organization_type,
      et.name as entity_type,
      c.name as country,
      NEW.country_code,
      i.name as industry_segment,
      NEW.address,
      NEW.phone_number,
      NEW.website
    FROM organizations o
    LEFT JOIN master_organization_types ot ON ot.id = NEW.organization_type_id
    LEFT JOIN master_entity_types et ON et.id = NEW.entity_type_id
    LEFT JOIN master_countries c ON c.id = NEW.country_id
    LEFT JOIN master_industry_segments i ON i.id = NEW.industry_segment_id
    WHERE o.id = NEW.id
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when organization is created or updated
CREATE TRIGGER organization_create_profile
  AFTER INSERT OR UPDATE ON public.organizations
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION public.create_profile_from_organization();