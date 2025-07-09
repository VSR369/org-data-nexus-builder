// PricingDataManager Class - Main interface for pricing operations
import { PricingConfig } from '@/types/pricing';
import { getPricingConfigs, savePricingConfigs, resetDeletedConfigsTracking } from './pricingCore';
import { normalizeCountryName } from './pricingUtils';

export class PricingDataManager {
  static getAllConfigurations(): PricingConfig[] {
    const configs = getPricingConfigs();
    
    // Clean up data: ensure marketplace models only have platformFeePercentage
    // and PaaS models only have frequency fees
    return configs.map(config => {
      const isMarketplace = ['Market Place', 'Aggregator', 'Market Place & Aggregator'].includes(config.engagementModel);
      const isPaaS = config.engagementModel === 'Platform as a Service';
      
      if (isMarketplace) {
        // Remove frequency fields from marketplace models
        const { quarterlyFee, halfYearlyFee, annualFee, ...cleanConfig } = config;
        return cleanConfig;
      }
      
      if (isPaaS) {
        // Remove platformFeePercentage from PaaS models
        const { platformFeePercentage, ...cleanConfig } = config;
        return cleanConfig;
      }
      
      return config;
    });
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
    const { EnhancedPricingDataManager } = eval('require')('../enhancedPricingDataManager');
    return EnhancedPricingDataManager.getPricingForEngagementModel(engagementModel);
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
    resetDeletedConfigsTracking();
  }
}