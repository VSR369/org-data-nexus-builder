// Enhanced Error Handling with Graceful Degradation
import { PricingConfig } from '@/types/pricing';
import { DataLoader } from './DataLoader';
import { EngagementModelMapper } from './EngagementModelMapper';

export class ErrorHandling {
  
  // Enhanced Error Handling with graceful degradation
  static getPricingWithErrorHandling(
    engagementModel: string, 
    country: string,
    organizationType: string,
    membershipStatus?: string
  ): { 
    pricing: PricingConfig | null; 
    error: string | null; 
    fallbackUsed: boolean 
  } {
    try {
      const configs = DataLoader.getAllConfigurations();
      const pricing = EngagementModelMapper.getPricingForEngagementModel(configs, engagementModel, country, organizationType, membershipStatus);
      
      if (pricing) {
        return { pricing, error: null, fallbackUsed: false };
      }
      
      // Try fallback without membership status
      if (membershipStatus) {
        const fallbackPricing = EngagementModelMapper.getPricingForEngagementModel(configs, engagementModel, country, organizationType);
        if (fallbackPricing) {
          return { 
            pricing: fallbackPricing, 
            error: `No pricing for membership status "${membershipStatus}", using default`, 
            fallbackUsed: true 
          };
        }
      }
      
      return { 
        pricing: null, 
        error: `No pricing configuration found for "${engagementModel}"`, 
        fallbackUsed: false 
      };
      
    } catch (error) {
      console.error('❌ Enhanced: Error in getPricingWithErrorHandling:', error);
      return { 
        pricing: null, 
        error: `Error loading pricing: ${error.message}`, 
        fallbackUsed: false 
      };
    }
  }
}