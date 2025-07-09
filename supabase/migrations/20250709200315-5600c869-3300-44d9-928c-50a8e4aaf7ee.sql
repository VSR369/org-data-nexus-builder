-- Delete hardcoded default configurations
DELETE FROM pricing_configs 
WHERE config_id LIKE 'default-%';