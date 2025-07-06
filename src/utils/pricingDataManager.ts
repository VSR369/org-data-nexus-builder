
import { LegacyDataManager } from './core/DataManager';
import { PricingConfig } from '@/types/pricing';

// Default pricing configurations to ensure we have data for all engagement models
const defaultPricingConfigs: PricingConfig[] = [
  // Market Place - Member Configuration
  {
    id: 'marketplace-member-config',
    configName: 'Market Place Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Market Place',
    membershipStatus: 'member',
    quarterlyFee: 12, // 12% for Members
    halfYearlyFee: 20, // 20% for Members  
    annualFee: 32, // 32% for Members
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Market Place - Not a Member Configuration
  {
    id: 'marketplace-not-member-config',
    configName: 'Market Place Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Market Place',
    membershipStatus: 'not-a-member',
    quarterlyFee: 15, // 15% for Not a Member
    halfYearlyFee: 25, // 25% for Not a Member
    annualFee: 40, // 40% for Not a Member
    discountPercentage: 0,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Aggregator - Member Configuration
  {
    id: 'aggregator-member-config',
    configName: 'Aggregator Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Aggregator',
    membershipStatus: 'member',
    quarterlyFee: 10, // 10% for Members
    halfYearlyFee: 18, // 18% for Members
    annualFee: 28, // 28% for Members
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Aggregator - Not a Member Configuration
  {
    id: 'aggregator-not-member-config',
    configName: 'Aggregator Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Aggregator',
    membershipStatus: 'not-a-member',
    quarterlyFee: 13, // 13% for Not a Member
    halfYearlyFee: 22, // 22% for Not a Member
    annualFee: 35, // 35% for Not a Member
    discountPercentage: 0,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Market Place & Aggregator - Member Configuration
  {
    id: 'marketplace-aggregator-member-config',
    configName: 'Market Place & Aggregator Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Market Place & Aggregator',
    membershipStatus: 'member',
    quarterlyFee: 15, // 15% for Members
    halfYearlyFee: 25, // 25% for Members
    annualFee: 40, // 40% for Members
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Market Place & Aggregator - Not a Member Configuration
  {
    id: 'marketplace-aggregator-not-member-config',
    configName: 'Market Place & Aggregator Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Market Place & Aggregator',
    membershipStatus: 'not-a-member',
    quarterlyFee: 18, // 18% for Not a Member
    halfYearlyFee: 30, // 30% for Not a Member
    annualFee: 45, // 45% for Not a Member
    discountPercentage: 0,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Platform as a Service - Member Configuration (Fixed pricing in INR)
  {
    id: 'platform-service-member-config',
    configName: 'Platform as a Service Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Platform as a Service',
    membershipStatus: 'member',
    quarterlyFee: 25000, // INR 25,000 for Members
    halfYearlyFee: 45000, // INR 45,000 for Members
    annualFee: 80000, // INR 80,000 for Members
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Platform as a Service - Not a Member Configuration (Fixed pricing in INR)
  {
    id: 'platform-service-not-member-config',
    configName: 'Platform as a Service Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Platform as a Service',
    membershipStatus: 'not-a-member',
    quarterlyFee: 30000, // INR 30,000 for Not a Member
    halfYearlyFee: 55000, // INR 55,000 for Not a Member
    annualFee: 100000, // INR 1,00,000 for Not a Member
    discountPercentage: 0,
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
  console.log('🔍 Getting pricing configurations...');
  
  // CHECK FOR CUSTOM-ONLY MODE FIRST
  const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
  if (isCustomMode) {
    console.log('🎯 Custom-only mode detected, loading custom pricing configs...');
    
    // Try loading from the actual master data configurations first
    try {
      const configs = pricingDataManager.loadData();
      console.log('📊 Loaded configs from master data manager:', configs?.length || 0);
      console.log('🔍 Individual master data configs:', configs?.map((config: any) => ({
        id: config.id,
        engagementModel: config.engagementModel,
        membershipStatus: config.membershipStatus,
        quarterly: config.quarterlyFee,
        halfYearly: config.halfYearlyFee,
        annual: config.annualFee
      })));
      
      if (Array.isArray(configs) && configs.length > 0) {
        console.log('✅ Using master data pricing configs:', configs.length);
        return configs;
      }
    } catch (error) {
      console.error('❌ Error loading from master data manager:', error);
    }
    
    // Fallback to custom_pricing from localStorage
    const customData = localStorage.getItem('custom_pricing');
    console.log('📄 Raw custom_pricing data:', customData);
    if (customData !== null) {
      try {
        const parsed = JSON.parse(customData);
        console.log('🔍 Parsed custom pricing data:', parsed);
        console.log('🔍 Individual configs:', parsed.map((config: any) => ({
          id: config.id,
          engagementModel: config.engagementModel,
          membershipStatus: config.membershipStatus,
          quarterly: config.quarterlyFee,
          halfYearly: config.halfYearlyFee,
          annual: config.annualFee
        })));
        if (Array.isArray(parsed)) {
          console.log('✅ Using custom pricing configs (including empty array):', parsed.length);
          return parsed; // Return even if empty array - this preserves deletions
        }
      } catch (error) {
        console.error('❌ Failed to parse custom pricing data:', error);
      }
    }
    
    // In custom-only mode, don't fall back to defaults if no custom data
    console.log('🚫 Custom-only mode: No custom pricing configs found, returning empty array');
    return [];
  }
  
  // Mixed mode: use existing logic with fallback
  try {
    const configs = pricingDataManager.loadData();
    const deletedConfigIds = deletedConfigsManager.loadData();
    
    console.log('🔄 Mixed mode: Loading pricing configurations:', configs?.length || 0);
    console.log('🗑️ Deleted config IDs:', deletedConfigIds);
    console.log('📊 All loaded pricing configs:', configs);
    
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

export const savePricingConfigs = (configs: PricingConfig[]): void => {
  const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
  
  if (isCustomMode) {
    console.log('💾 Custom-only mode: Saving pricing configs to custom_pricing:', configs.length);
    localStorage.setItem('custom_pricing', JSON.stringify(configs));
    
    // Validation: Read back to ensure it was saved correctly
    const readBack = localStorage.getItem('custom_pricing');
    if (readBack !== null) {
      try {
        const parsed = JSON.parse(readBack);
        if (Array.isArray(parsed) && parsed.length === configs.length) {
          console.log('✅ Custom pricing configs save validated successfully');
        } else {
          console.error('❌ Custom pricing configs save validation failed - length mismatch');
        }
      } catch (error) {
        console.error('❌ Custom pricing configs save validation failed - parse error:', error);
      }
    } else {
      console.error('❌ Custom pricing configs save validation failed - null readback');
    }
  } else {
    console.log('💾 Mixed mode: Saving pricing configs to master_data_pricing_configs:', configs.length);
    pricingDataManager.saveData(configs);
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
  
  savePricingConfigs(configs);
};

export const deletePricingConfig = (id: string): void => {
  const configs = getPricingConfigs();
  const filteredConfigs = configs.filter(c => c.id !== id);
  
  const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
  
  if (!isCustomMode) {
    // Track deleted configuration ID to prevent auto-recreation in mixed mode
    const deletedConfigIds = deletedConfigsManager.loadData();
    if (!deletedConfigIds.includes(id)) {
      deletedConfigIds.push(id);
      deletedConfigsManager.saveData(deletedConfigIds);
      console.log('🗑️ Marked config as deleted:', id);
    }
  }
  
  savePricingConfigs(filteredConfigs);
};

// Helper function to normalize country names for comparison
const normalizeCountryName = (country: string): string => {
  if (!country) return '';
  
  // Handle common variations
  const normalizedCountry = country.trim();
  
  // India variations
  if (['India', 'IN', 'IND'].includes(normalizedCountry)) {
    return 'India';
  }
  
  // UAE variations
  if (['UAE', 'AE', 'United Arab Emirates'].includes(normalizedCountry)) {
    return 'United Arab Emirates';
  }
  
  // USA variations  
  if (['USA', 'US', 'United States', 'United States of America'].includes(normalizedCountry)) {
    return 'United States of America';
  }
  
  return normalizedCountry;
};

// Export PricingDataManager class for backward compatibility
export class PricingDataManager {
  static getAllConfigurations(): PricingConfig[] {
    return getPricingConfigs();
  }

  static saveConfigurations(configs: PricingConfig[]): void {
    savePricingConfigs(configs);
  }

  static getPricingForCountryOrgTypeAndEngagement(country: string, orgType: string, engagement: string): PricingConfig | null {
    const configs = getPricingConfigs();
    const normalizedCountry = normalizeCountryName(country);
    
    console.log(`🔍 Looking for pricing config - Country: "${normalizedCountry}", OrgType: "${orgType}", Engagement: "${engagement}"`);
    console.log('📋 Available configs:', configs.map(c => ({
      id: c.id,
      country: c.country,
      normalizedCountry: normalizeCountryName(c.country || ''),
      orgType: c.organizationType,
      engagement: c.engagementModel,
      quarterlyFee: c.quarterlyFee,
      halfYearlyFee: c.halfYearlyFee,
      annualFee: c.annualFee
    })));
    
    // First try exact match with normalized country
    let foundConfig = configs.find(c => 
      normalizeCountryName(c.country || '') === normalizedCountry &&
      (c.organizationType === orgType || c.organizationType === 'All') &&
      (c.engagementModel === engagement || c.engagementModel?.toLowerCase() === engagement.toLowerCase())
    );
    
    if (foundConfig) {
      console.log('✅ Found exact country match:', foundConfig);
      return foundConfig;
    }
    
    // Try without country restriction (Global configs)
    foundConfig = configs.find(c => 
      (!c.country || c.country === 'Global' || c.country === 'All') &&
      (c.organizationType === orgType || c.organizationType === 'All') &&
      (c.engagementModel === engagement || c.engagementModel?.toLowerCase() === engagement.toLowerCase())
    );
    
    if (foundConfig) {
      console.log('✅ Found global config:', foundConfig);
      return foundConfig;
    }
    
    console.log('❌ No pricing config found for the specified criteria');
    return null;
  }

  static getConfigurationByOrgTypeAndEngagement(orgType: string, engagementModel: string): PricingConfig | null {
    const configs = getPricingConfigs();
    
    console.log(`🔍 Looking for config by OrgType: "${orgType}", EngagementModel: "${engagementModel}"`);
    
    const foundConfig = configs.find(c => 
      (c.organizationType === orgType || c.organizationType === 'All') &&
      (c.engagementModel === engagementModel || c.engagementModel?.toLowerCase() === engagementModel.toLowerCase())
    );
    
    console.log(foundConfig ? '✅ Found config by org type and engagement' : '❌ No config found by org type and engagement');
    return foundConfig || null;
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

  // New method to get pricing by country specifically
  static getPricingForCountry(country: string, organizationType?: string, entityType?: string): PricingConfig[] {
    const configs = getPricingConfigs();
    const normalizedCountry = normalizeCountryName(country);
    
    console.log(`🔍 Looking for pricing configs for country: "${normalizedCountry}"`);
    
    const matchingConfigs = configs.filter(c => {
      const configCountry = normalizeCountryName(c.country || '');
      const countryMatch = configCountry === normalizedCountry || configCountry === 'Global' || configCountry === 'All' || !configCountry;
      
      let orgTypeMatch = true;
      let entityTypeMatch = true;
      
      if (organizationType) {
        orgTypeMatch = c.organizationType === organizationType || c.organizationType === 'All';
      }
      
      if (entityType) {
        entityTypeMatch = c.entityType === entityType || c.entityType === 'All';
      }
      
      return countryMatch && orgTypeMatch && entityTypeMatch;
    });
    
    console.log(`✅ Found ${matchingConfigs.length} pricing configs for "${normalizedCountry}"`);
    return matchingConfigs;
  }

  // Method to reset deleted configurations tracking (for admin use)
  static resetDeletedConfigsTracking(): void {
    deletedConfigsManager.saveData([]);
    console.log('🔄 Reset deleted configurations tracking');
  }
}

// Re-export types for convenience
export type { PricingConfig, CountryPricing } from '@/types/pricing';
