
import { LegacyDataManager } from './core/DataManager';

export interface PricingConfig {
  id: string;
  configName: string;
  country: string;
  currency: string;
  engagementModel: string;
  generalConfig: {
    marketPlaceFee: number;
    aggregatorFee: number;
    platformUsageFee: number;
    transactionFee: number;
  };
  paasPricing: {
    basicTier: number;
    standardTier: number;
    premiumTier: number;
    enterpriseTier: number;
  };
  discounts: {
    earlyBird: number;
    bulk: number;
    loyalty: number;
  };
  createdAt: string;
  updatedAt: string;
}

const pricingDataManager = new LegacyDataManager<PricingConfig[]>({
  key: 'master_data_pricing_configs',
  defaultData: [],
  version: 1
});

export const getPricingConfigs = (): PricingConfig[] => {
  return pricingDataManager.loadData();
};

export const savePricingConfig = (config: PricingConfig): void => {
  const configs = pricingDataManager.loadData();
  const existingIndex = configs.findIndex(c => c.id === config.id);
  
  if (existingIndex >= 0) {
    configs[existingIndex] = config;
  } else {
    configs.push(config);
  }
  
  pricingDataManager.saveData(configs);
};

export const deletePricingConfig = (id: string): void => {
  const configs = pricingDataManager.loadData();
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
      c.country === country && 
      c.engagementModel === engagement
    ) || null;
  }

  static getConfigurationByOrgTypeAndEngagement(orgType: string, engagementModel: string): PricingConfig | null {
    const configs = getPricingConfigs();
    return configs.find(c => c.engagementModel === engagementModel) || null;
  }
}
