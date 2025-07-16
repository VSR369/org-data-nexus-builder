-- Grant necessary permissions to authenticated role for master data tables
-- This fixes the issue where users can't edit fee components and other master data

-- Grant all necessary permissions on master_fee_components
GRANT SELECT, INSERT, UPDATE, DELETE ON master_fee_components TO authenticated;

-- Grant permissions on other master data tables for consistency
GRANT SELECT, INSERT, UPDATE, DELETE ON master_pricing_parameters TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_pricing_tiers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_engagement_model_subtypes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_platform_fee_formulas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_advance_payment_types TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_system_configurations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON tier_engagement_model_restrictions TO authenticated;

-- Grant permissions on other master tables that users might need to edit
GRANT SELECT, INSERT, UPDATE, DELETE ON master_countries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_currencies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_organization_types TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_entity_types TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_units_of_measure TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_engagement_models TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_billing_frequencies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON master_membership_statuses TO authenticated;

-- Grant permissions on the sequences for these tables
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;