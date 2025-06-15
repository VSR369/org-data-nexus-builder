
import { DataManager } from './dataManager';
import { PricingConfig } from '@/components/master-data/pricing/types';

// Default pricing configurations
const defaultPricingConfigs: PricingConfig[] = [
  {
    id: '1',
    country: 'India',
    currency: 'INR',
    organizationType: 'All Organizations',
    entityType: 'Commercial',
    engagementModel: 'Market Place',
    engagementModelFee: 30,
    membershipStatus: 'not-a-member',
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString().split('T')[0],
  }
];

// Data manager for pricing configurations
export const pricingConfigDataManager = new DataManager<PricingConfig[]>({
  key: 'master_data_pricing_configs',
  defaultData: defaultPricingConfigs,
  version: 1
});

export class PricingDataManager {
  // Load all pricing configurations
  static getAllConfigurations(): PricingConfig[] {
    console.log('📊 Loading all pricing configurations...');
    const configs = pricingConfigDataManager.loadData();
    console.log('📊 Loaded pricing configurations:', configs.length);
    return configs;
  }

  // Save pricing configurations
  static saveConfigurations(configs: PricingConfig[]): void {
    console.log('💾 Saving pricing configurations:', configs.length);
    pricingConfigDataManager.saveData(configs);
    console.log('✅ Pricing configurations saved successfully');
  }

  // Get configuration by organization type and engagement model
  static getConfigurationByOrgTypeAndEngagement(organizationType: string, engagementModel: string): PricingConfig | null {
    const configs = this.getAllConfigurations();
    const config = configs.find(c => c.organizationType === organizationType && c.engagementModel === engagementModel);
    console.log(`🔍 Found config for ${organizationType} - ${engagementModel}:`, !!config);
    return config || null;
  }

  // Add or update configuration
  static saveConfiguration(config: PricingConfig): void {
    console.log('💾 Saving single pricing configuration:', config.organizationType);
    const configs = this.getAllConfigurations();
    
    const existingIndex = configs.findIndex(c => c.id === config.id);
    if (existingIndex >= 0) {
      configs[existingIndex] = config;
    } else {
      configs.push(config);
    }
    
    this.saveConfigurations(configs);
  }

  // Delete configuration
  static deleteConfiguration(configId: string): void {
    console.log('🗑️ Deleting pricing configuration:', configId);
    const configs = this.getAllConfigurations();
    const filtered = configs.filter(c => c.id !== configId);
    this.saveConfigurations(filtered);
  }

  // Get pricing for specific country, organization type, and engagement model
  static getPricingForCountryOrgTypeAndEngagement(country: string, organizationType: string, engagementModel: string) {
    console.log(`🔍 Looking for pricing: ${organizationType} - ${engagementModel} in ${country}`);
    
    const config = this.getConfigurationByOrgTypeAndEngagement(organizationType, engagementModel);
    if (!config) {
      console.log('❌ No configuration found for organization type and engagement model');
      return null;
    }

    const countryPricing = config.internalPaasPricing.find(p => p.country === country);
    if (!countryPricing) {
      console.log('❌ No pricing found for country');
      return null;
    }

    console.log('✅ Found pricing:', countryPricing);
    return {
      config,
      countryPricing
    };
  }

  // Reset to defaults (for testing)
  static resetToDefaults(): PricingConfig[] {
    console.log('🔄 Resetting pricing configurations to defaults...');
    const resetData = pricingConfigDataManager.resetToDefault();
    console.log('🔄 Reset complete, configurations count:', resetData.length);
    return resetData;
  }

  // Validate data integrity
  static validateDataIntegrity(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    try {
      const configs = this.getAllConfigurations();
      
      if (!Array.isArray(configs)) {
        issues.push('Pricing configurations is not an array');
      }

      configs.forEach((config, index) => {
        if (!config.id) issues.push(`Configuration ${index} missing ID`);
        if (!config.organizationType) issues.push(`Configuration ${index} missing organization type`);
        if (!config.engagementModel) issues.push(`Configuration ${index} missing engagement model`);
        if (typeof config.engagementModelFee !== 'number') issues.push(`Configuration ${index} invalid engagement model fee`);
      });

    } catch (error) {
      issues.push(`Error loading pricing configurations: ${error}`);
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}
