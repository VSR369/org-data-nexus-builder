-- Clear existing pricing configurations and repopulate
TRUNCATE TABLE pricing_configs;

-- Populate pricing configurations for all combinations
INSERT INTO pricing_configs (
  config_id,
  country,
  country_id,
  organization_type,
  organization_type_id,
  entity_type,
  entity_type_id,
  engagement_model,
  engagement_model_id,
  membership_status,
  platform_fee_percentage,
  quarterly_fee,
  half_yearly_fee,
  annual_fee,
  currency,
  discount_percentage,
  internal_paas_pricing
)
SELECT 
  CONCAT(c.code, '-', ot.name, '-', et.name, '-', em.name, '-', ms.status) as config_id,
  c.name as country,
  c.id as country_id,
  ot.name as organization_type,
  ot.id as organization_type_id,
  et.name as entity_type,
  et.id as entity_type_id,
  em.name as engagement_model,
  em.id as engagement_model_id,
  ms.status as membership_status,
  -- Platform fee for marketplace models
  CASE 
    WHEN em.name IN ('Market Place', 'Aggregator', 'Market Place & Aggregator') THEN
      CASE 
        WHEN ot.name = 'MSME' THEN 5.0
        ELSE 7.5
      END
    ELSE NULL
  END as platform_fee_percentage,
  -- PaaS quarterly fee
  CASE 
    WHEN em.name = 'Platform as a Service' THEN
      CASE 
        WHEN ot.name = 'MSME' THEN 2500.00
        ELSE 7500.00
      END
    ELSE NULL
  END as quarterly_fee,
  -- PaaS half yearly fee  
  CASE 
    WHEN em.name = 'Platform as a Service' THEN
      CASE 
        WHEN ot.name = 'MSME' THEN 4500.00
        ELSE 13500.00
      END
    ELSE NULL
  END as half_yearly_fee,
  -- PaaS annual fee
  CASE 
    WHEN em.name = 'Platform as a Service' THEN
      CASE 
        WHEN ot.name = 'MSME' THEN 8000.00
        ELSE 24000.00
      END
    ELSE NULL
  END as annual_fee,
  -- Currency
  CASE 
    WHEN em.name = 'Platform as a Service' THEN 'INR'
    ELSE NULL
  END as currency,
  -- Member discount
  CASE 
    WHEN ms.status = 'Member' THEN 10.0
    ELSE 0.0
  END as discount_percentage,
  -- PaaS pricing tiers
  CASE 
    WHEN em.name = 'Platform as a Service' THEN
      '{"basic": {"monthly": 500, "annual": 5000}, "standard": {"monthly": 1000, "annual": 10000}, "premium": {"monthly": 2000, "annual": 20000}}'::jsonb
    ELSE '[]'::jsonb
  END as internal_paas_pricing
FROM master_countries c
CROSS JOIN master_organization_types ot
CROSS JOIN master_entity_types et
CROSS JOIN master_engagement_models em
CROSS JOIN (VALUES ('Member'), ('Non-Member')) as ms(status);