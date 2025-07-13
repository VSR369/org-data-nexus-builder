-- Drop the complex pricing system tables and restore simple pricing_configs
DROP TABLE IF EXISTS pricing_overrides CASCADE;
DROP TABLE IF EXISTS pricing_rules CASCADE; 
DROP TABLE IF EXISTS pricing_templates CASCADE;

-- Clean pricing_configs table of hardcoded data but keep the structure
TRUNCATE TABLE pricing_configs;

-- Drop the unique constraint that was added
ALTER TABLE pricing_configs DROP CONSTRAINT IF EXISTS pricing_configs_country_id_organization_type_id_entity_type__key;