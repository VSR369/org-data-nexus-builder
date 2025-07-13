-- Insert default pricing configurations into pricing_configs table
INSERT INTO pricing_configs (config_id, country, currency, organization_type, entity_type, engagement_model, membership_status, platform_fee_percentage, discount_percentage, quarterly_fee, half_yearly_fee, annual_fee, version) VALUES

-- Market Place - Member Configuration
('marketplace-member-config', 'India', 'INR', 'MSME', 'Commercial', 'Market Place', 'member', 12, 20, NULL, NULL, NULL, 1),

-- Market Place - Not a Member Configuration  
('marketplace-not-member-config', 'India', 'INR', 'MSME', 'Commercial', 'Market Place', 'not-a-member', 15, 0, NULL, NULL, NULL, 1),

-- Aggregator - Member Configuration
('aggregator-member-config', 'India', 'INR', 'MSME', 'Commercial', 'Aggregator', 'member', 10, 20, NULL, NULL, NULL, 1),

-- Aggregator - Not a Member Configuration
('aggregator-not-member-config', 'India', 'INR', 'MSME', 'Commercial', 'Aggregator', 'not-a-member', 13, 0, NULL, NULL, NULL, 1),

-- Market Place & Aggregator - Member Configuration
('marketplace-aggregator-member-config', 'India', 'INR', 'MSME', 'Commercial', 'Market Place & Aggregator', 'member', 15, 20, NULL, NULL, NULL, 1),

-- Market Place & Aggregator - Not a Member Configuration
('marketplace-aggregator-not-member-config', 'India', 'INR', 'MSME', 'Commercial', 'Market Place & Aggregator', 'not-a-member', 18, 0, NULL, NULL, NULL, 1),

-- Platform as a Service - Member Configuration
('platform-service-member-config', 'India', 'INR', 'MSME', 'Commercial', 'Platform as a Service', 'member', NULL, 20, 25000, 45000, 80000, 1),

-- Platform as a Service - Not a Member Configuration
('platform-service-not-member-config', 'India', 'INR', 'MSME', 'Commercial', 'Platform as a Service', 'not-a-member', NULL, 0, 30000, 55000, 100000, 1);