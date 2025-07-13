-- Add unique constraint using a function-based approach
CREATE UNIQUE INDEX unique_department_per_organization 
ON master_departments (COALESCE(organization_id, ''), name);

-- Add comment for clarity
COMMENT ON INDEX unique_department_per_organization 
IS 'Ensures department names are unique within each organization (including null organization_id)';