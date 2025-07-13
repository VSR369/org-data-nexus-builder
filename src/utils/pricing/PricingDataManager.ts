// PricingDataManager Class - Restored to original simple approach
import { PricingConfig } from '@/types/pricing';
import { normalizeCountryName } from './pricingUtils';
import { supabase } from '@/integrations/supabase/client';

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
      console.log('✅ Loading pricing configurations from Supabase...');
      
      // Load directly from pricing_configs table
      const { data, error } = await supabase
        .from('pricing_configs')
        .select('*');
      
      if (error) {
        console.error('❌ Error loading pricing configs:', error);
        this.cachedConfigs = [];
      } else {
        // Convert database records to PricingConfig format  
        this.cachedConfigs = (data || []).map(config => {
          const pricingConfig: PricingConfig = {
            id: config.id,
            country: config.country,
            organizationType: config.organization_type,
            entityType: config.entity_type,
            engagementModel: config.engagement_model,
            membershipStatus: (config.membership_status === 'member' ? 'member' : 'not-a-member') as 'member' | 'not-a-member',
            quarterlyFee: config.quarterly_fee,
            halfYearlyFee: config.half_yearly_fee,
            annualFee: config.annual_fee,
            currency: config.currency,
            platformFeePercentage: config.platform_fee_percentage,
            discountPercentage: config.discount_percentage,
            internalPaasPricing: [],
            version: config.version || 1,
            createdAt: config.created_at || new Date().toISOString()
          };
          
          // Handle internalPaasPricing conversion
          if (Array.isArray(config.internal_paas_pricing)) {
            try {
              pricingConfig.internalPaasPricing = config.internal_paas_pricing.map((item: any) => ({
                id: item.id || `country-${Date.now()}`,
                country: item.country || '',
                currency: item.currency || 'USD',
                quarterlyPrice: item.quarterlyPrice || 0,
                halfYearlyPrice: item.halfYearlyPrice || 0,
                annualPrice: item.annualPrice || 0,
                membershipStatus: item.membershipStatus || 'not-a-member',
                discountPercentage: item.discountPercentage || 0
              }));
            } catch (error) {
              console.warn('Error converting internal paas pricing:', error);
              pricingConfig.internalPaasPricing = [];
            }
          }
          
          return pricingConfig;
        });
        
        console.log('✅ Pricing configurations loaded from Supabase:', this.cachedConfigs.length);
      }
    } catch (error) {
      console.error('❌ Error loading pricing configurations:', error);
      this.cachedConfigs = [];
    }
    this.isLoading = false;
  }

  static async saveConfigurations(configs: PricingConfig[]): Promise<void> {
    console.log('✅ Saving pricing configurations to Supabase...');
    
    try {
      // Clear existing configs
      await supabase.from('pricing_configs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert new configs
      for (const config of configs) {
        const dbConfig = {
          country: config.country,
          organization_type: config.organizationType,
          entity_type: config.entityType,
          engagement_model: config.engagementModel,
          membership_status: config.membershipStatus,
          quarterly_fee: config.quarterlyFee,
          half_yearly_fee: config.halfYearlyFee,
          annual_fee: config.annualFee,
          currency: config.currency,
          platform_fee_percentage: config.platformFeePercentage,
          discount_percentage: config.discountPercentage,
          internal_paas_pricing: JSON.parse(JSON.stringify(config.internalPaasPricing || [])),
          config_id: config.id || `config-${Date.now()}`,
          country_id: '00000000-0000-0000-0000-000000000000', // Placeholder
          organization_type_id: '00000000-0000-0000-0000-000000000000', // Placeholder
          entity_type_id: '00000000-0000-0000-0000-000000000000', // Placeholder
          engagement_model_id: '00000000-0000-0000-0000-000000000000' // Placeholder
        };
        
        const { error } = await supabase
          .from('pricing_configs')
          .insert([dbConfig]);
        
        if (error) {
          console.error('❌ Error saving pricing config:', error);
        }
      }
      
      if (configs.length > 0) {
        console.log('✅ Pricing configurations saved successfully');
      } else {
        console.log('✅ No configurations to save');
      }
      // Refresh cache
      await this.loadConfigurationsAsync();
    } catch (error) {
      console.error('❌ Error saving pricing configurations:', error);
    }
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
    this.cachedConfigs = [];
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

  static resetDeletedConfigsTracking(): void {
    console.log('💡 Reset tracking - no longer needed in simplified system');
  }
}