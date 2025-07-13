-- Complete removal of pricing configuration system
-- Drop the pricing_configs table
DROP TABLE IF EXISTS pricing_configs CASCADE;

-- Drop all pricing-related functions
DROP FUNCTION IF EXISTS validate_pricing_config_fees() CASCADE;
DROP FUNCTION IF EXISTS get_membership_fees_for_organization(uuid, uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS get_pricing_configs_for_organization(uuid, uuid, uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS update_pricing_updated_at() CASCADE;