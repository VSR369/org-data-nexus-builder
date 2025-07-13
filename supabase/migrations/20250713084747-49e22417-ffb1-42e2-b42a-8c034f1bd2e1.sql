-- Create storage buckets for organization documents
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('organization-documents', 'organization-documents', false),
  ('organization-logos', 'organization-logos', true);

-- Create storage policies for organization documents
CREATE POLICY "Organization owners can upload documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'organization-documents');

CREATE POLICY "Organization owners can view their documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'organization-documents');

-- Create storage policies for organization logos (public)
CREATE POLICY "Anyone can view organization logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'organization-logos');

CREATE POLICY "Anyone can upload organization logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'organization-logos');