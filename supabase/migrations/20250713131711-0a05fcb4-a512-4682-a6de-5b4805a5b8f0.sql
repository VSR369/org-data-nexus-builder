-- Update the pricing config validation function to handle model-specific requirements
CREATE OR REPLACE FUNCTION validate_pricing_config_fees()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if engagement model is marketplace-related
  IF NEW.engagement_model IN ('Market Place', 'Market Place & Aggregator', 'Aggregator') THEN
    -- For marketplace models: require platform_fee_percentage, allow frequency fees to be NULL
    IF NEW.platform_fee_percentage IS NULL THEN
      RAISE EXCEPTION 'Platform fee percentage is required for marketplace engagement models';
    END IF;
    
    -- Frequency fees and currency should be NULL for marketplace models
    IF NEW.annual_fee IS NOT NULL OR NEW.half_yearly_fee IS NOT NULL OR NEW.quarterly_fee IS NOT NULL THEN
      RAISE EXCEPTION 'Frequency fees are not applicable for marketplace engagement models';
    END IF;
    
  ELSIF NEW.engagement_model = 'Platform as a Service' THEN
    -- For PaaS models: require ALL three frequency fees and currency
    IF NEW.quarterly_fee IS NULL OR NEW.half_yearly_fee IS NULL OR NEW.annual_fee IS NULL THEN
      RAISE EXCEPTION 'All frequency fees (quarterly, half-yearly, and annual) are required for Platform as a Service model';
    END IF;
    
    IF NEW.currency IS NULL THEN
      RAISE EXCEPTION 'Currency is required for Platform as a Service model';
    END IF;
    
    -- Platform fee percentage should be NULL for PaaS models
    IF NEW.platform_fee_percentage IS NOT NULL THEN
      RAISE EXCEPTION 'Platform fee percentage is not applicable for Platform as a Service model';
    END IF;
    
  ELSE
    -- For unknown engagement models, provide a helpful error
    RAISE EXCEPTION 'Unknown engagement model: %. Valid models are: Market Place, Market Place & Aggregator, Aggregator, Platform as a Service', NEW.engagement_model;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;