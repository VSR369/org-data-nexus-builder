// Engagement Model Mapping and Lookup
import { PricingConfig } from '@/types/pricing';

export class EngagementModelMapper {
  // Fix Platform as a Service Lookup with proper name mapping
  private static readonly ENGAGEMENT_MODEL_MAPPINGS = {
    'Market Place': ['Market Place', 'marketplace', 'Marketplace'],
    'Aggregator': ['Aggregator', 'aggregator'],
    'Market Place & Aggregator': ['Market Place & Aggregator', 'marketplace-aggregator', 'Marketplace & Aggregator'],
    'Platform as a Service': ['Platform as a Service', 'platform-service', 'PaaS', 'Platform Service']
  };

  // Enhanced lookup with proper model name matching
  static getPricingForEngagementModel(
    configs: PricingConfig[], 
    engagementModel: string, 
    membershipStatus?: string
  ): PricingConfig | null {
    console.log(`🔍 Enhanced: Looking for pricing - Model: "${engagementModel}", Membership: "${membershipStatus || 'any'}"`);
    
    // Use mapping to find the correct configuration
    const possibleNames = this.getPossibleModelNames(engagementModel);
    console.log(`🔍 Enhanced: Checking possible names:`, possibleNames);
    
    // First try exact match with membership status
    if (membershipStatus) {
      for (const name of possibleNames) {
        const exactMatch = configs.find(config => 
          this.normalizeModelName(config.engagementModel) === this.normalizeModelName(name) &&
          config.membershipStatus === membershipStatus
        );
        
        if (exactMatch) {
          console.log(`✅ Enhanced: Found exact match for "${name}" with membership "${membershipStatus}"`);
          return exactMatch;
        }
      }
    }
    
    // Then try without membership status constraint
    for (const name of possibleNames) {
      const match = configs.find(config => 
        this.normalizeModelName(config.engagementModel) === this.normalizeModelName(name)
      );
      
      if (match) {
        console.log(`✅ Enhanced: Found match for "${name}"`);
        return match;
      }
    }
    
    console.log(`❌ Enhanced: No pricing found for "${engagementModel}"`);
    console.log('📋 Enhanced: Available configurations:', configs.map(c => ({
      engagementModel: c.engagementModel,
      membershipStatus: c.membershipStatus,
      country: c.country
    })));
    
    return null;
  }
  
  private static getPossibleModelNames(modelName: string): string[] {
    // Find all possible variations of the model name
    for (const [key, variations] of Object.entries(this.ENGAGEMENT_MODEL_MAPPINGS)) {
      if (variations.some(variation => 
        this.normalizeModelName(variation) === this.normalizeModelName(modelName)
      )) {
        return [key, ...variations];
      }
    }
    
    return [modelName];
  }
  
  private static normalizeModelName(name: string): string {
    if (!name) return '';
    return name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  }
}