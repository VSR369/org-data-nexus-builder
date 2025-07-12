-- Clean up erroneous record with config_id '1752081046782'
-- This record has null platform_fee_percentage and appears to be from an incomplete configuration
DELETE FROM pricing_configs WHERE config_id = '1752081046782';