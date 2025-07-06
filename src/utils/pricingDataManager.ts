
import { LegacyDataManager } from './core/DataManager';
import { PricingConfig } from '@/types/pricing';
import { PricingDataProtection } from './pricingDataProtection';

// Re-export everything from the refactored modules for backward compatibility
export { defaultPricingConfigs } from './pricing/pricingDefaults';
export { 
  getPricingConfigs, 
  savePricingConfigs, 
  savePricingConfig, 
  deletePricingConfig,
  resetDeletedConfigsTracking 
} from './pricing/pricingCore';
export { normalizeCountryName } from './pricing/pricingUtils';
export { PricingDataManager } from './pricing/PricingDataManager';

// Re-export types for convenience
export type { PricingConfig, CountryPricing } from '@/types/pricing';
