// Configuration Data Validation and Sanitization
import { PricingConfig } from '@/types/pricing';

export class ConfigurationValidator {
  
  // Strengthen Data Validation
  static validateConfigurationData(config: PricingConfig): PricingConfig | null {
    if (!config) return null;
    
    // Check required fields
    if (!config.id || !config.engagementModel) {
      console.warn('⚠️ Enhanced: Invalid configuration - missing required fields:', config);
      return null;
    }
    
    // Check if this is a marketplace model
    const isMarketplaceModel = ['Market Place', 'Aggregator', 'Market Place & Aggregator'].includes(config.engagementModel);
    
    if (isMarketplaceModel) {
      // Validate platform fee percentage for marketplace models
      if (typeof config.platformFeePercentage !== 'number' || config.platformFeePercentage <= 0) {
        console.warn('⚠️ Enhanced: Invalid marketplace configuration - missing platform fee percentage:', config);
        return null;
      }
    } else {
      // Validate pricing values for PaaS models
      const hasValidPricing = (
        typeof config.quarterlyFee === 'number' && config.quarterlyFee >= 0
      ) || (
        typeof config.halfYearlyFee === 'number' && config.halfYearlyFee >= 0  
      ) || (
        typeof config.annualFee === 'number' && config.annualFee >= 0
      );
      
      if (!hasValidPricing) {
        console.warn('⚠️ Enhanced: Invalid PaaS configuration - no valid pricing data:', config);
        return null;
      }
    }
    
    // Sanitize undefined values to prevent runtime errors
    return {
      ...config,
      quarterlyFee: config.quarterlyFee || 0,
      halfYearlyFee: config.halfYearlyFee || 0,
      annualFee: config.annualFee || 0,
      discountPercentage: config.discountPercentage || 0,
      platformFeePercentage: config.platformFeePercentage || 0
    };
  }

  static validateConfigurationsArray(configs: PricingConfig[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(configs)) {
      errors.push('Configurations must be an array');
      return { isValid: false, errors };
    }
    
    if (configs.length === 0) {
      errors.push('Cannot save empty configurations array');
      return { isValid: false, errors };
    }
    
    // Validate each configuration
    configs.forEach((config, index) => {
      if (!config.id) errors.push(`Config ${index}: Missing ID`);
      if (!config.engagementModel) errors.push(`Config ${index}: Missing engagement model`);
      if (!config.organizationType) errors.push(`Config ${index}: Missing organization type`);
      
      const isMarketplaceModel = ['Market Place', 'Aggregator', 'Market Place & Aggregator'].includes(config.engagementModel);
      
      if (isMarketplaceModel) {
        // Validate platform fee percentage for marketplace models
        if (typeof config.platformFeePercentage !== 'number' || config.platformFeePercentage <= 0) {
          errors.push(`Config ${index}: Missing or invalid platform fee percentage`);
        }
      } else {
        // Check that at least one pricing value is valid for PaaS models
        const hasValidPricing = [config.quarterlyFee, config.halfYearlyFee, config.annualFee]
          .some(fee => typeof fee === 'number' && fee >= 0);
        
        if (!hasValidPricing) {
          errors.push(`Config ${index}: No valid pricing data`);
        }
      }
    });
    
    return { isValid: errors.length === 0, errors };
  }
}