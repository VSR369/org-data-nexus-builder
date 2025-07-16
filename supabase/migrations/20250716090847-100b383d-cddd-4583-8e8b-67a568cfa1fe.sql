-- Phase 1: Database cleanup for Management and Consulting Fee Setup

-- 1. Add check constraint to ensure only management and consulting fees in pricing parameters
ALTER TABLE master_pricing_parameters 
ADD CONSTRAINT pricing_params_management_consulting_only 
CHECK (
  fee_component_id IN (
    SELECT id FROM master_fee_components 
    WHERE component_type IN ('management_fee', 'consulting_fee')
  )
);

-- 2. Create function to auto-populate currency based on country
CREATE OR REPLACE FUNCTION auto_populate_currency_from_country()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-populate currency based on country selection
  IF NEW.country_id IS NOT NULL THEN
    SELECT id INTO NEW.currency_id
    FROM master_currencies
    WHERE country = (SELECT name FROM master_countries WHERE id = NEW.country_id)
    LIMIT 1;
  END IF;
  
  -- Force rate_type to 'currency' for pricing parameters
  NEW.rate_type := 'currency';
  
  -- Force complexity_applicable to true for pricing parameters
  NEW.complexity_applicable := true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger to auto-populate currency and enforce constraints
CREATE OR REPLACE TRIGGER trigger_auto_populate_currency_pricing_params
  BEFORE INSERT OR UPDATE ON master_pricing_parameters
  FOR EACH ROW
  EXECUTE FUNCTION auto_populate_currency_from_country();

-- 4. Update existing pricing parameters to have correct defaults
UPDATE master_pricing_parameters 
SET 
  rate_type = 'currency',
  complexity_applicable = true,
  currency_id = (
    SELECT mc.id 
    FROM master_currencies mc 
    JOIN master_countries co ON mc.country = co.name 
    WHERE co.id = master_pricing_parameters.country_id
    LIMIT 1
  )
WHERE rate_type IS NULL OR complexity_applicable IS NULL OR currency_id IS NULL;

-- 5. Add constraint to ensure currency matches country
ALTER TABLE master_pricing_parameters 
ADD CONSTRAINT pricing_params_currency_country_match 
CHECK (
  currency_id = (
    SELECT mc.id 
    FROM master_currencies mc 
    JOIN master_countries co ON mc.country = co.name 
    WHERE co.id = country_id
    LIMIT 1
  )
);

-- 6. Create view for simplified pricing parameters with only management/consulting fees
CREATE OR REPLACE VIEW pricing_parameters_management_consulting AS
SELECT 
  pp.*,
  c.name as country_name,
  ot.name as organization_type_name,
  et.name as entity_type_name,
  fc.name as fee_component_name,
  fc.component_type,
  cur.name as currency_name,
  cur.symbol as currency_symbol,
  uom.name as unit_name,
  uom.symbol as unit_symbol
FROM master_pricing_parameters pp
JOIN master_countries c ON pp.country_id = c.id
JOIN master_organization_types ot ON pp.organization_type_id = ot.id
JOIN master_entity_types et ON pp.entity_type_id = et.id
JOIN master_fee_components fc ON pp.fee_component_id = fc.id
JOIN master_currencies cur ON pp.currency_id = cur.id
JOIN master_units_of_measure uom ON pp.unit_of_measure_id = uom.id
WHERE fc.component_type IN ('management_fee', 'consulting_fee')
ORDER BY pp.created_at DESC;