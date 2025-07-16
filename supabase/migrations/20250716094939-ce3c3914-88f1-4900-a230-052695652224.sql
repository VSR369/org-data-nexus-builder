-- First, let's check and clean up any existing duplicates
-- Remove duplicate "General" entries, keeping only one per engagement model
WITH duplicate_subtypes AS (
  SELECT 
    id,
    name,
    engagement_model_id,
    ROW_NUMBER() OVER (PARTITION BY name, engagement_model_id ORDER BY created_at ASC) as rn
  FROM master_engagement_model_subtypes
  WHERE name = 'General'
)
DELETE FROM master_engagement_model_subtypes 
WHERE id IN (
  SELECT id FROM duplicate_subtypes WHERE rn > 1
);

-- Add unique constraint to prevent future duplicates
ALTER TABLE master_engagement_model_subtypes 
ADD CONSTRAINT unique_subtype_name_per_engagement_model 
UNIQUE (name, engagement_model_id);

-- Add comment for clarity
COMMENT ON CONSTRAINT unique_subtype_name_per_engagement_model 
ON master_engagement_model_subtypes 
IS 'Ensures subtype names are unique within each engagement model';