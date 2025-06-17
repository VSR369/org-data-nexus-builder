
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
    quarterlyFee: 500,
    halfYearlyFee: 900,
    annualFee: 1600,
    discountPercentage: 20,
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
    quarterlyFee: 750,
    halfYearlyFee: 1350,
    annualFee: 2400,
    discountPercentage: 20,
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
    quarterlyFee: 600,
    halfYearlyFee: 1080,
    annualFee: 1920,
    discountPercentage: 20,
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
    quarterlyFee: 1000,
    halfYearlyFee: 1800,
    annualFee: 3200,
    discountPercentage: 20,
    version: 1,
    createdAt: new Date().toISOString()
  }
];

const pricingDataManager = new LegacyDataManager<PricingConfig[]>({
  key: 'master_data_pricing_configs',
  defaultData: defaultPricingConfigs,
  version: 2 // Increment version to force refresh with default data
});

export const getPricingConfigs = (): PricingConfig[] => {
  try {
    const configs = pricingDataManager.loadData();
    console.log('🔄 Loading pricing configurations:', configs?.length || 0);
    
    // Ensure we have valid array
    if (!Array.isArray(configs) || configs.length === 0) {
      console.log('📝 No pricing configs found, initializing with defaults');
      pricingDataManager.saveData(defaultPricingConfigs);
      return defaultPricingConfigs;
    }
    
    // Ensure we have pricing for all engagement models
    const engagementModels = ['Market Place', 'Market Place & Aggregator', 'Aggregator', 'Platform as a Service'];
    const missingModels = engagementModels.filter(model => 
      !configs.some(config => config.engagementModel === model)
    );
    
    if (missingModels.length > 0) {
      console.log('📝 Missing pricing configs for models:', missingModels);
      const updatedConfigs = [...configs];
      
      // Add default configs for missing models
      missingModels.forEach(model => {
        const defaultConfig = defaultPricingConfigs.find(config => config.engagementModel === model);
        if (defaultConfig) {
          updatedConfigs.push(defaultConfig);
        }
      });
      
      pricingDataManager.saveData(updatedConfigs);
      return updatedConfigs;
    }
    
    return configs;
  } catch (error) {
    console.error('❌ Error loading pricing configs:', error);
    pricingDataManager.saveData(defaultPricingConfigs);
    return defaultPricingConfigs;
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
}

// Re-export types for convenience
export type { PricingConfig, CountryPricing } from '@/types/pricing';
