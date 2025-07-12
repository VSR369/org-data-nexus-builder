// Main Enhanced Pricing Data Manager Interface
// Maintains backward compatibility while using focused modules

import { PricingConfig } from '@/types/pricing';
import { DataLoader } from './enhanced/DataLoader';
import { EngagementModelMapper } from './enhanced/EngagementModelMapper';
import { ConfigurationValidator } from './enhanced/ConfigurationValidator';
import { HealthChecker } from './enhanced/HealthChecker';
import { ErrorHandling } from './enhanced/ErrorHandling';
import { PricingDataProtection } from './pricingDataProtection';

export class EnhancedPricingDataManager {
  // Re-export data loading methods
  static getAllConfigurations = DataLoader.getAllConfigurations.bind(DataLoader);

  // Re-export engagement model lookup methods  
  static getPricingForEngagementModel(
    engagementModel: string, 
    country: string,
    organizationType: string,
    membershipStatus?: string
  ): PricingConfig | null {
    const configs = DataLoader.getAllConfigurations();
    const pricing = EngagementModelMapper.getPricingForEngagementModel(configs, engagementModel, country, organizationType, membershipStatus);
    return pricing ? ConfigurationValidator.validateConfigurationData(pricing) : null;
  }

  // Re-export save operations with validation
  static saveConfigurations(configs: PricingConfig[]): boolean {
    console.log('💾 Enhanced: Atomic save operation starting...');
    
    // Validate before saving
    const validation = ConfigurationValidator.validateConfigurationsArray(configs);
    if (!validation.isValid) {
      console.error('❌ Enhanced: Save blocked due to validation errors:', validation.errors);
      return false;
    }
    
    // Create backup and perform atomic save
    PricingDataProtection.createBackup('before_enhanced_save');
    const success = PricingDataProtection.safeSave(configs, 'enhanced_atomic_save');
    
    if (success) {
      console.log('✅ Enhanced: Atomic save completed successfully');
      return true;
    } else {
      console.error('❌ Enhanced: Atomic save failed');
      return false;
    }
  }

  // Re-export error handling methods
  static getPricingWithErrorHandling = ErrorHandling.getPricingWithErrorHandling.bind(ErrorHandling);

  // Re-export health check methods
  static performHealthCheck = HealthChecker.performHealthCheck.bind(HealthChecker);
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).EnhancedPricingDataManager = EnhancedPricingDataManager;
}