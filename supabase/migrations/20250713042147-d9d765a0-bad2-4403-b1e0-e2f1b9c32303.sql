-- Step 1: Clean up duplicate departments
-- First, update foreign key references to point to the kept records
WITH duplicate_departments AS (
  SELECT 
    id,
    organization_id,
    name,
    ROW_NUMBER() OVER (PARTITION BY COALESCE(organization_id, ''), name ORDER BY created_at) as rn
  FROM master_departments
),
departments_to_keep AS (
  SELECT id as keep_id, organization_id, name
  FROM duplicate_departments 
  WHERE rn = 1
),
departments_to_delete AS (
  SELECT dd.id as delete_id, dtk.keep_id
  FROM duplicate_departments dd
  JOIN departments_to_keep dtk ON COALESCE(dd.organization_id, '') = COALESCE(dtk.organization_id, '') AND dd.name = dtk.name
  WHERE dd.rn > 1
)
-- Update sub_departments to reference the kept department
UPDATE master_sub_departments 
SET department_id = (
  SELECT keep_id 
  FROM departments_to_delete 
  WHERE delete_id = master_sub_departments.department_id
)
WHERE department_id IN (SELECT delete_id FROM departments_to_delete);

-- Step 2: Delete duplicate departments
WITH duplicate_departments AS (
  SELECT 
    id,
    organization_id,
    name,
    ROW_NUMBER() OVER (PARTITION BY COALESCE(organization_id, ''), name ORDER BY created_at) as rn
  FROM master_departments
)
DELETE FROM master_departments 
WHERE id IN (
  SELECT id 
  FROM duplicate_departments 
  WHERE rn > 1
);