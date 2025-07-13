-- Update master_departments table structure to support hierarchical department data
ALTER TABLE public.master_departments 
DROP COLUMN IF EXISTS name;

ALTER TABLE public.master_departments 
ADD COLUMN department_name TEXT NOT NULL DEFAULT '',
ADD COLUMN sub_department_name TEXT,
ADD COLUMN team_unit_name TEXT;

-- Update existing records to have empty department_name if they exist
UPDATE public.master_departments 
SET department_name = '' 
WHERE department_name IS NULL;

-- Add comment to table
COMMENT ON TABLE public.master_departments IS 'Master data for organizational departments with hierarchical structure: Department > Sub Department > Team/Unit';