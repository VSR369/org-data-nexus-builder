-- Populate pricing configurations for all combinations of country, organization type, entity type, and engagement model
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
  -- Marketplace models (Market Place, Aggregator, Market Place & Aggregator)
  platform_fee_percentage,
  -- PaaS models
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
  -- Platform fee percentage for marketplace models
  CASE 
    WHEN em.name IN ('Market Place', 'Aggregator', 'Market Place & Aggregator') THEN
      CASE 
        WHEN ot.name = 'MSME' THEN 5.0
        WHEN ot.name = 'Large Enterprise' THEN 7.5
        ELSE 6.0
      END
    ELSE NULL
  END as platform_fee_percentage,
  -- Quarterly fee for PaaS models
  CASE 
    WHEN em.name = 'Platform as a Service' THEN
      CASE 
        WHEN ot.name = 'MSME' THEN 2500.00
        WHEN ot.name = 'Large Enterprise' THEN 7500.00
        ELSE 5000.00
      END
    ELSE NULL
  END as quarterly_fee,
  -- Half yearly fee for PaaS models
  CASE 
    WHEN em.name = 'Platform as a Service' THEN
      CASE 
        WHEN ot.name = 'MSME' THEN 4500.00
        WHEN ot.name = 'Large Enterprise' THEN 13500.00
        ELSE 9000.00
      END
    ELSE NULL
  END as half_yearly_fee,
  -- Annual fee for PaaS models
  CASE 
    WHEN em.name = 'Platform as a Service' THEN
      CASE 
        WHEN ot.name = 'MSME' THEN 8000.00
        WHEN ot.name = 'Large Enterprise' THEN 24000.00
        ELSE 16000.00
      END
    ELSE NULL
  END as annual_fee,
  -- Currency for PaaS models
  CASE 
    WHEN em.name = 'Platform as a Service' THEN 'INR'
    ELSE NULL
  END as currency,
  -- Discount percentage for members
  CASE 
    WHEN ms.status = 'Member' THEN
      CASE 
        WHEN em.name IN ('Market Place', 'Aggregator', 'Market Place & Aggregator') THEN 1.0
        WHEN em.name = 'Platform as a Service' THEN 10.0
        ELSE 0.0
      END
    ELSE 0.0
  END as discount_percentage,
  -- Internal PaaS pricing structure
  CASE 
    WHEN em.name = 'Platform as a Service' THEN
      jsonb_build_object(
        'basic', jsonb_build_object('monthly', 500, 'annual', 5000),
        'standard', jsonb_build_object('monthly', 1000, 'annual', 10000),
        'premium', jsonb_build_object('monthly', 2000, 'annual', 20000)
      )
    ELSE '[]'::jsonb
  END as internal_paas_pricing
FROM master_countries c
CROSS JOIN master_organization_types ot
CROSS JOIN master_entity_types et
CROSS JOIN master_engagement_models em
CROSS JOIN (VALUES ('Member'), ('Non-Member')) as ms(status)
ORDER BY c.name, ot.name, et.name, em.name, ms.status;