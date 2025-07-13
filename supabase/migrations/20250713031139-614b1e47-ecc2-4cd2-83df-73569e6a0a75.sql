-- Add hierarchy column to master_domain_groups table to store categories and sub-categories
ALTER TABLE master_domain_groups 
ADD COLUMN hierarchy JSONB DEFAULT '{"categories": []}'::jsonb;

-- Add index for better query performance on hierarchy field
CREATE INDEX idx_master_domain_groups_hierarchy ON master_domain_groups USING GIN (hierarchy);

-- Add a comment to explain the hierarchy structure
COMMENT ON COLUMN master_domain_groups.hierarchy IS 'JSONB structure: {"categories": [{"id": "uuid", "name": "string", "description": "string", "subCategories": [{"id": "uuid", "name": "string", "description": "string"}]}]}';