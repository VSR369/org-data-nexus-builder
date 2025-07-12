-- Update existing marketplace/aggregator records to move platform fee from quarterly_fee to platform_fee_percentage
UPDATE pricing_configs 
SET platform_fee_percentage = quarterly_fee,
    quarterly_fee = NULL
WHERE engagement_model IN ('Market Place', 'Market Place & Aggregator', 'Aggregator');