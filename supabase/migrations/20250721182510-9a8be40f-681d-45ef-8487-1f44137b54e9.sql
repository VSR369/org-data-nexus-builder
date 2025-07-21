
-- Add person_name field to seeking_organization_roles table
ALTER TABLE public.seeking_organization_roles 
ADD COLUMN person_name TEXT NOT NULL DEFAULT '';

-- Update the constraint to ensure person_name is not empty
ALTER TABLE public.seeking_organization_roles 
ADD CONSTRAINT chk_person_name_not_empty 
CHECK (LENGTH(TRIM(person_name)) > 0);

-- Add indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_seeking_org_roles_person_name 
ON public.seeking_organization_roles USING gin(person_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_seeking_org_roles_role_name 
ON public.seeking_organization_roles USING gin(role_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_seeking_org_roles_email 
ON public.seeking_organization_roles USING gin(email_id gin_trgm_ops);

-- Enable trigram extension for fuzzy search if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;
