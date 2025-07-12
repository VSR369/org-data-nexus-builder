// Engagement Model Mapping and Lookup
import { PricingConfig } from '@/types/pricing';
import { normalizeCountryName } from '@/utils/pricing/pricingUtils';

export class EngagementModelMapper {
  // Fix Platform as a Service Lookup with proper name mapping
  private static readonly ENGAGEMENT_MODEL_MAPPINGS = {
    'Market Place': ['Market Place', 'marketplace', 'Marketplace'],
    'Aggregator': ['Aggregator', 'aggregator'],
    'Market Place & Aggregator': ['Market Place & Aggregator', 'marketplace-aggregator', 'Marketplace & Aggregator'],
    'Platform as a Service': ['Platform as a Service', 'platform-service', 'PaaS', 'Platform Service']
  };

  // Membership status mapping - handle both database and pricing config formats
  private static readonly MEMBERSHIP_STATUS_MAPPINGS = {
    'not-a-member': ['not-a-member', 'inactive', 'non-member'],
    'member': ['member', 'member_paid', 'active']
  };

  // Enhanced lookup with proper model name, country and membership status matching
  static getPricingForEngagementModel(
    configs: PricingConfig[], 
    engagementModel: string, 
    country: string,
    organizationType: string,
    membershipStatus?: string
  ): PricingConfig | null {
    console.log(`🔍 Enhanced: Looking for pricing - Model: "${engagementModel}", Country: "${country}", OrgType: "${organizationType}", Membership: "${membershipStatus || 'any'}"`);
    
    // Normalize inputs
    const normalizedCountry = normalizeCountryName(country);
    const possibleModelNames = this.getPossibleModelNames(engagementModel);
    const possibleMembershipStatuses = membershipStatus ? this.getPossibleMembershipStatuses(membershipStatus) : [];
    
    console.log(`🔍 Enhanced: Normalized country: "${normalizedCountry}"`);
    console.log(`🔍 Enhanced: Possible model names:`, possibleModelNames);
    console.log(`🔍 Enhanced: Possible membership statuses:`, possibleMembershipStatuses);
    
    // First try exact match with all criteria
    if (membershipStatus) {
      for (const modelName of possibleModelNames) {
        for (const membershipVariant of possibleMembershipStatuses) {
          const exactMatch = configs.find(config => 
            this.normalizeModelName(config.engagementModel) === this.normalizeModelName(modelName) &&
            normalizeCountryName(config.country || '') === normalizedCountry &&
            config.organizationType === organizationType &&
            config.membershipStatus === membershipVariant
          );
          
          if (exactMatch) {
            console.log(`✅ Enhanced: Found exact match for "${modelName}" with membership "${membershipVariant}"`);
            return exactMatch;
          }
        }
      }
    }
    
    // Then try without membership status constraint but with country and org type
    for (const modelName of possibleModelNames) {
      const match = configs.find(config => 
        this.normalizeModelName(config.engagementModel) === this.normalizeModelName(modelName) &&
        normalizeCountryName(config.country || '') === normalizedCountry &&
        config.organizationType === organizationType
      );
      
      if (match) {
        console.log(`✅ Enhanced: Found match for "${modelName}" without membership constraint`);
        return match;
      }
    }
    
    console.log(`❌ Enhanced: No pricing found for "${engagementModel}"`);
    console.log('📋 Enhanced: Available configurations:', configs.map(c => ({
      engagementModel: c.engagementModel,
      membershipStatus: c.membershipStatus,
      country: c.country,
      organizationType: c.organizationType
    })));
    
    return null;
  }

  private static getPossibleMembershipStatuses(membershipStatus: string): string[] {
    // Find all possible variations of the membership status
    for (const [key, variations] of Object.entries(this.MEMBERSHIP_STATUS_MAPPINGS)) {
      if (variations.includes(membershipStatus)) {
        return [key, ...variations];
      }
    }
    return [membershipStatus];
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