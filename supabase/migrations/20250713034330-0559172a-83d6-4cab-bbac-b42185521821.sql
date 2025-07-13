-- Restructure master_departments table for proper hierarchy
-- Drop existing columns
ALTER TABLE public.master_departments 
DROP COLUMN IF EXISTS department_name,
DROP COLUMN IF EXISTS sub_department_name,
DROP COLUMN IF EXISTS team_unit_name;

-- Add new structure for hierarchical data
ALTER TABLE public.master_departments 
ADD COLUMN name TEXT NOT NULL DEFAULT '',
ADD COLUMN parent_id UUID REFERENCES public.master_departments(id),
ADD COLUMN level INTEGER NOT NULL DEFAULT 1,
ADD COLUMN hierarchy_path TEXT;

-- Create index for better performance on hierarchy queries
CREATE INDEX IF NOT EXISTS idx_master_departments_parent_id ON public.master_departments(parent_id);
CREATE INDEX IF NOT EXISTS idx_master_departments_level ON public.master_departments(level);

-- Add constraint to ensure valid hierarchy levels (1=Department, 2=Sub-Department, 3=Team/Unit)
ALTER TABLE public.master_departments 
ADD CONSTRAINT check_hierarchy_level CHECK (level IN (1, 2, 3));

-- Function to update hierarchy path automatically
CREATE OR REPLACE FUNCTION update_department_hierarchy_path()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    -- Top level department
    NEW.hierarchy_path = NEW.name;
    NEW.level = 1;
  ELSE
    -- Get parent's hierarchy path and level
    SELECT 
      COALESCE(hierarchy_path, name) || ' > ' || NEW.name,
      level + 1
    INTO NEW.hierarchy_path, NEW.level
    FROM master_departments 
    WHERE id = NEW.parent_id;
    
    -- Ensure we don't exceed 3 levels
    IF NEW.level > 3 THEN
      RAISE EXCEPTION 'Maximum hierarchy depth of 3 levels exceeded (Department > Sub-Department > Team/Unit)';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update hierarchy path
DROP TRIGGER IF EXISTS trigger_update_hierarchy_path ON public.master_departments;
CREATE TRIGGER trigger_update_hierarchy_path
  BEFORE INSERT OR UPDATE ON public.master_departments
  FOR EACH ROW
  EXECUTE FUNCTION update_department_hierarchy_path();

-- Add comment to table
COMMENT ON TABLE public.master_departments IS 'Hierarchical master data for organizational structure: Department (level 1) > Sub Department (level 2) > Team/Unit (level 3)';
COMMENT ON COLUMN public.master_departments.level IS '1=Department, 2=Sub-Department, 3=Team/Unit';
COMMENT ON COLUMN public.master_departments.parent_id IS 'References parent department/sub-department for hierarchy';
COMMENT ON COLUMN public.master_departments.hierarchy_path IS 'Full path from root department to current item (auto-generated)';