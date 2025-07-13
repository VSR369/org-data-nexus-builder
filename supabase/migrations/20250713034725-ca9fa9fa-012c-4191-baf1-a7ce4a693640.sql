-- Restructure master_departments to match domain groups pattern
-- Drop the parent_id approach and use JSON hierarchy like domain groups
ALTER TABLE public.master_departments 
DROP COLUMN IF EXISTS parent_id,
DROP COLUMN IF EXISTS level,
DROP COLUMN IF EXISTS hierarchy_path;

-- Drop the constraint and function
DROP TRIGGER IF EXISTS trigger_update_hierarchy_path ON public.master_departments;
DROP FUNCTION IF EXISTS update_department_hierarchy_path();
ALTER TABLE public.master_departments DROP CONSTRAINT IF EXISTS check_hierarchy_level;

-- Add fields to match domain groups structure
ALTER TABLE public.master_departments 
ADD COLUMN organization_id TEXT,
ADD COLUMN hierarchy JSONB DEFAULT '{"categories": []}'::jsonb,
ADD COLUMN description TEXT,
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Update existing records to have empty hierarchy
UPDATE public.master_departments 
SET hierarchy = '{"categories": []}'::jsonb 
WHERE hierarchy IS NULL;

-- Drop the indexes that are no longer needed
DROP INDEX IF EXISTS idx_master_departments_parent_id;
DROP INDEX IF EXISTS idx_master_departments_level;

-- Create index for organization_id for better performance
CREATE INDEX IF NOT EXISTS idx_master_departments_organization_id ON public.master_departments(organization_id);

-- Add comment to table
COMMENT ON TABLE public.master_departments IS 'Hierarchical master data for organizational departments structure: Department > Sub Department > Team/Unit (matches domain groups pattern)';
COMMENT ON COLUMN public.master_departments.organization_id IS 'Optional organization identifier for scoping departments';
COMMENT ON COLUMN public.master_departments.hierarchy IS 'JSON structure containing departments > sub-departments > teams/units hierarchy';
COMMENT ON COLUMN public.master_departments.is_active IS 'Whether this department configuration is active';