// PricingDataManager Class - Updated to use template-based system
import { PricingConfig } from '@/types/pricing';
import { NewPricingDataManager } from './NewPricingDataManager';
import { normalizeCountryName } from './pricingUtils';

export class PricingDataManager {
  private static cachedConfigs: PricingConfig[] = [];
  private static isLoading = false;

  static getAllConfigurations(): PricingConfig[] {
    console.log('⚠️ getAllConfigurations (sync) is deprecated. Use getAllConfigurationsAsync() instead.');
    return this.cachedConfigs;
  }

  static async getAllConfigurationsAsync(): Promise<PricingConfig[]> {
    await this.loadConfigurationsAsync();
    return this.cachedConfigs;
  }

  private static async loadConfigurationsAsync(): Promise<void> {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      console.log('✅ Loading pricing configurations using new template system...');
      
      // Use the new template-based system to generate all configurations
      this.cachedConfigs = await NewPricingDataManager.generateAllConfigurations();
      
      console.log('✅ Pricing configurations loaded from templates:', this.cachedConfigs.length);
    } catch (error) {
      console.error('❌ Error loading pricing configurations:', error);
      this.cachedConfigs = [];
    }
    this.isLoading = false;
  }

  static async saveConfigurations(configs: PricingConfig[]): Promise<void> {
    console.log('✅ Template-based system: Saving configurations is no longer needed');
    console.log('💡 Use the Master Data Portal to manage pricing templates and rules instead');
    
    // Refresh the cache to get the latest calculated configurations
    await this.loadConfigurationsAsync();
  }

  static getPricingForCountryOrgTypeAndEngagement(country: string, orgType: string, engagement: string): PricingConfig | null {
    const configs = this.cachedConfigs;
    const normalizedCountry = normalizeCountryName(country);
    
    console.log(`🔍 Looking for pricing config - Country: "${normalizedCountry}", OrgType: "${orgType}", Engagement: "${engagement}"`);
    
    // First try exact match with normalized country
    let foundConfig = configs.find(c => 
      normalizeCountryName(c.country || '') === normalizedCountry &&
      c.organizationType === orgType &&
      c.engagementModel === engagement
    );
    
    if (foundConfig) {
      console.log('✅ Found exact country match:', foundConfig);
      return foundConfig;
    }
    
    console.log('❌ No pricing config found for the specified criteria');
    return null;
  }

  static getConfigurationByOrgTypeAndEngagement(orgType: string, engagementModel: string): PricingConfig | null {
    const configs = this.cachedConfigs;
    
    console.log(`🔍 Looking for config by OrgType: "${orgType}", EngagementModel: "${engagementModel}"`);
    
    const foundConfig = configs.find(c => 
      c.organizationType === orgType &&
      c.engagementModel === engagementModel
    );
    
    console.log(foundConfig ? '✅ Found config by org type and engagement' : '❌ No config found by org type and engagement');
    return foundConfig || null;
  }

  // Method to refresh pricing configurations
  static async refreshCache(): Promise<void> {
    await NewPricingDataManager.refreshCache();
    await this.loadConfigurationsAsync();
  }

  // Legacy methods for backward compatibility
  static getPricingForEngagementModel(engagementModel: string): PricingConfig | null {
    const configs = this.cachedConfigs;
    return configs.find(c => c.engagementModel === engagementModel) || null;
  }

  static getPricingForCountry(country: string, organizationType?: string, entityType?: string): PricingConfig[] {
    const configs = this.cachedConfigs;
    const normalizedCountry = normalizeCountryName(country);
    
    return configs.filter(c => {
      const configCountry = normalizeCountryName(c.country || '');
      const countryMatch = configCountry === normalizedCountry;
      
      let orgTypeMatch = true;
      let entityTypeMatch = true;
      
      if (organizationType) {
        orgTypeMatch = c.organizationType === organizationType;
      }
      
      if (entityType) {
        entityTypeMatch = c.entityType === entityType;
      }
      
      return countryMatch && orgTypeMatch && entityTypeMatch;
    });
  }

  // Remove deduplication method as it's no longer needed
  static resetDeletedConfigsTracking(): void {
    console.log('💡 Deleted configs tracking is no longer applicable with template-based system');
  }
}