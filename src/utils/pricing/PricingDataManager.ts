// PricingDataManager Class - Main interface for pricing operations
import { PricingConfig } from '@/types/pricing';
import { getPricingConfigs, savePricingConfigs, resetDeletedConfigsTracking } from './pricingCore';
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
      // Clear any localStorage fallbacks first to ensure clean state
      const { GlobalCacheManager } = await import('../core/GlobalCacheManager');
      GlobalCacheManager.clearAllCache();
      
      console.log('✅ CRUD TEST - Loading pricing configurations from Supabase (single source of truth)');
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('pricing_configs')
        .select('*')
        .order('country, organization_type, engagement_model');

      if (error) throw error;

      const configs: PricingConfig[] = data?.map(config => ({
        id: config.id,
        country: config.country,
        currency: config.currency,
        organizationType: config.organization_type,
        entityType: config.entity_type,
        engagementModel: config.engagement_model,
        membershipStatus: (config.membership_status as "member" | "not-a-member") || "not-a-member",
        quarterlyFee: config.quarterly_fee,
        halfYearlyFee: config.half_yearly_fee,
        annualFee: config.annual_fee,
        platformFeePercentage: config.platform_fee_percentage,
        discountPercentage: config.discount_percentage,
        version: config.version || 1,
        internalPaasPricing: Array.isArray(config.internal_paas_pricing) ? config.internal_paas_pricing.map((item: any) => item) : [],
        createdAt: config.created_at || new Date().toISOString(),
        updatedAt: config.updated_at || new Date().toISOString()
      })) || [];

      this.cachedConfigs = configs;
      console.log('✅ CRUD TEST - Pricing configurations loaded:', configs.length);
    } catch (error) {
      console.error('❌ Error loading pricing configurations from Supabase:', error);
      // No fallbacks - Supabase is single source of truth
      this.cachedConfigs = [];
    }
    this.isLoading = false;
  }

  static async saveConfigurations(configs: PricingConfig[]): Promise<void> {
    console.log('✅ CRUD TEST - Saving pricing configurations to Supabase:', configs.length);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      for (const config of configs) {
        const { error } = await supabase
          .from('pricing_configs')
          .upsert({
            config_id: config.id,
            country: config.country,
            currency: config.currency,
            organization_type: config.organizationType,
            entity_type: config.entityType,
            engagement_model: config.engagementModel,
            membership_status: config.membershipStatus,
            quarterly_fee: config.quarterlyFee,
            half_yearly_fee: config.halfYearlyFee,
            annual_fee: config.annualFee,
            platform_fee_percentage: config.platformFeePercentage,
            discount_percentage: config.discountPercentage,
            internal_paas_pricing: JSON.stringify(Array.isArray(config.internalPaasPricing) ? config.internalPaasPricing : []),
            version: config.version || 1,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
      
      this.cachedConfigs = configs;
      console.log('✅ CRUD TEST - Pricing configurations saved to Supabase successfully');
    } catch (error) {
      console.error('❌ Error saving pricing configurations to Supabase:', error);
      // No fallbacks - Supabase is single source of truth
      throw error;
    }
  }

  static getPricingForCountryOrgTypeAndEngagement(country: string, orgType: string, engagement: string): PricingConfig | null {
    const configs = this.cachedConfigs;
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
    const configs = this.cachedConfigs;
    
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
    const configs = this.cachedConfigs;
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