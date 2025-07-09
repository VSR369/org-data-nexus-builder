import { PricingConfig } from '@/types/pricing';
import { defaultPricingConfigs } from './pricingDefaults';

// Clean up pricing configurations to ensure proper data structure
export const cleanupPricingConfigurations = (): PricingConfig[] => {
  const cleanConfigs: PricingConfig[] = [];
  
  for (const config of defaultPricingConfigs) {
    const cleanConfig: PricingConfig = {
      ...config,
      // Remove platformFeePercentage from PaaS models
      ...(config.engagementModel === 'Platform as a Service' && {
        platformFeePercentage: undefined
      }),
      // Remove frequency fields from marketplace models
      ...(config.engagementModel !== 'Platform as a Service' && {
        quarterlyFee: undefined,
        halfYearlyFee: undefined,
        annualFee: undefined
      })
    };
    
    cleanConfigs.push(cleanConfig);
  }
  
  return cleanConfigs;
};

// Reset all pricing data to clean defaults
export const resetPricingData = (): void => {
  // Clear existing pricing data
  localStorage.removeItem('master_data_pricing_configs');
  localStorage.removeItem('custom_pricing');
  
  // Set cleaned data
  const cleanConfigs = cleanupPricingConfigurations();
  localStorage.setItem('master_data_pricing_configs', JSON.stringify(cleanConfigs));
  
  console.log('🧹 Pricing data cleaned and reset with proper structure');
  console.log('✅ Clean configurations loaded:', cleanConfigs.length);
};