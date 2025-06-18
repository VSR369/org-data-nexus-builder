
import { LegacyDataManager } from './core/DataManager';
import { PricingConfig } from '@/types/pricing';

// Default pricing configurations to ensure we have data for all engagement models
const defaultPricingConfigs: PricingConfig[] = [
  {
    id: 'marketplace-config',
    configName: 'Market Place Configuration',
    country: 'Global',
    currency: 'USD',
    organizationType: 'All',
    entityType: 'All',
    engagementModel: 'Market Place',
    engagementModelFee: 5, // 5% of solution fee
    quarterlyFee: 500,
    halfYearlyFee: 900,
    annualFee: 1600,
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'marketplace-aggregator-config',
    configName: 'Market Place & Aggregator Configuration',
    country: 'Global',
    currency: 'USD',
    organizationType: 'All',
    entityType: 'All',
    engagementModel: 'Market Place & Aggregator',
    engagementModelFee: 8, // 8% of solution fee
    quarterlyFee: 750,
    halfYearlyFee: 1350,
    annualFee: 2400,
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'aggregator-config',
    configName: 'Aggregator Configuration',
    country: 'Global',
    currency: 'USD',
    organizationType: 'All',
    entityType: 'All',
    engagementModel: 'Aggregator',
    engagementModelFee: 6, // 6% of solution fee
    quarterlyFee: 600,
    halfYearlyFee: 1080,
    annualFee: 1920,
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'platform-service-config',
    configName: 'Platform as a Service Configuration',
    country: 'Global',
    currency: 'USD',
    organizationType: 'All',
    entityType: 'All',
    engagementModel: 'Platform as a Service',
    engagementModelFee: 0, // Not percentage-based, uses fixed pricing
    quarterlyFee: 1000,
    halfYearlyFee: 1800,
    annualFee: 3200,
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  }
];

const pricingDataManager = new LegacyDataManager<PricingConfig[]>({
  key: 'master_data_pricing_configs',
  defaultData: [],
  version: 4 // Increment version to respect user deletions
});

// Track deleted configurations to prevent auto-recreation
const deletedConfigsManager = new LegacyDataManager<string[]>({
  key: 'master_data_pricing_deleted_configs',
  defaultData: [],
  version: 1
});

export const getPricingConfigs = (): PricingConfig[] => {
  try {
    const configs = pricingDataManager.loadData();
    const deletedConfigIds = deletedConfigsManager.loadData();
    
    console.log('🔄 Loading pricing configurations:', configs?.length || 0);
    console.log('🗑️ Deleted config IDs:', deletedConfigIds);
    
    // If no configs exist and no defaults have been explicitly deleted, initialize with defaults
    if (!Array.isArray(configs) || configs.length === 0) {
      if (!deletedConfigIds || deletedConfigIds.length === 0) {
        console.log('📝 No pricing configs found and none deleted, initializing with defaults');
        pricingDataManager.saveData(defaultPricingConfigs);
        return defaultPricingConfigs;
      } else {
        console.log('📝 No pricing configs found but some were deleted, returning empty array');
        return [];
      }
    }
    
    return configs;
  } catch (error) {
    console.error('❌ Error loading pricing configs:', error);
    return [];
  }
};

export const savePricingConfig = (config: PricingConfig): void => {
  const configs = getPricingConfigs();
  const existingIndex = configs.findIndex(c => c.id === config.id);
  
  if (existingIndex >= 0) {
    configs[existingIndex] = config;
  } else {
    configs.push(config);
  }
  
  pricingDataManager.saveData(configs);
};

export const deletePricingConfig = (id: string): void => {
  const configs = getPricingConfigs();
  const filteredConfigs = configs.filter(c => c.id !== id);
  
  // Track deleted configuration ID to prevent auto-recreation
  const deletedConfigIds = deletedConfigsManager.loadData();
  if (!deletedConfigIds.includes(id)) {
    deletedConfigIds.push(id);
    deletedConfigsManager.saveData(deletedConfigIds);
    console.log('🗑️ Marked config as deleted:', id);
  }
  
  pricingDataManager.saveData(filteredConfigs);
};

// Export PricingDataManager class for backward compatibility
export class PricingDataManager {
  static getAllConfigurations(): PricingConfig[] {
    return getPricingConfigs();
  }

  static saveConfigurations(configs: PricingConfig[]): void {
    pricingDataManager.saveData(configs);
  }

  static getPricingForCountryOrgTypeAndEngagement(country: string, orgType: string, engagement: string): PricingConfig | null {
    const configs = getPricingConfigs();
    return configs.find(c => 
      c.engagementModel === engagement ||
      c.engagementModel?.toLowerCase() === engagement.toLowerCase()
    ) || null;
  }

  static getConfigurationByOrgTypeAndEngagement(orgType: string, engagementModel: string): PricingConfig | null {
    const configs = getPricingConfigs();
    return configs.find(c => 
      c.engagementModel === engagementModel ||
      c.engagementModel?.toLowerCase() === engagementModel.toLowerCase()
    ) || null;
  }

  static getPricingForEngagementModel(engagementModel: string): PricingConfig | null {
    const configs = getPricingConfigs();
    const foundConfig = configs.find(c => 
      c.engagementModel === engagementModel ||
      c.engagementModel?.toLowerCase() === engagementModel.toLowerCase()
    );
    
    console.log(`💰 Looking for pricing config for "${engagementModel}":`, foundConfig ? 'Found' : 'Not found');
    return foundConfig || null;
  }

  // Method to reset deleted configurations tracking (for admin use)
  static resetDeletedConfigsTracking(): void {
    deletedConfigsManager.saveData([]);
    console.log('🔄 Reset deleted configurations tracking');
  }
}

// Re-export types for convenience
export type { PricingConfig, CountryPricing } from '@/types/pricing';
