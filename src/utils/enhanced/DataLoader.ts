// Enhanced Data Loading Logic
import { PricingConfig } from '@/types/pricing';
import { PricingDataDiagnostic } from '../pricingDataDiagnostic';
import { PricingDataProtection } from '../pricingDataProtection';

export class DataLoader {
  private static readonly CUSTOM_PRICING_KEY = 'custom_pricing';
  private static readonly MASTER_DATA_KEY = 'master_data_pricing_configs';

  // Fix Data Loading Logic with prioritized custom configurations
  static getAllConfigurations(): PricingConfig[] {
    console.log('🔄 Enhanced: Loading pricing configurations...');
    
    try {
      // Always prioritize custom data in custom-only mode
      const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
      
      if (isCustomMode) {
        return this.loadCustomOnlyConfigurations();
      }
      
      // Mixed mode: still prefer custom data but allow fallbacks
      return this.loadMixedModeConfigurations();
      
    } catch (error) {
      console.error('❌ Enhanced: Error loading configurations:', error);
      return this.handleLoadingError();
    }
  }
  
  private static loadCustomOnlyConfigurations(): PricingConfig[] {
    console.log('🎯 Enhanced: Loading custom-only configurations...');
    
    const validation = PricingDataDiagnostic.validateCustomPricingData();
    
    if (validation.isValid && validation.data.length > 0) {
      console.log('✅ Enhanced: Using validated custom configurations:', validation.data.length);
      return validation.data;
    }
    
    if (validation.issues.length > 0) {
      console.warn('⚠️ Enhanced: Custom data validation issues:', validation.issues);
    }
    
    // Attempt emergency recovery
    console.log('🚨 Enhanced: Attempting emergency recovery...');
    const recoveredData = PricingDataProtection.emergencyRecovery();
    
    if (recoveredData.length > 0) {
      console.log('✅ Enhanced: Emergency recovery successful:', recoveredData.length);
      // Save recovered data
      this.saveConfigurations(recoveredData);
      return recoveredData;
    }
    
    console.log('⚠️ Enhanced: No custom configurations available in custom-only mode');
    return [];
  }
  
  private static loadMixedModeConfigurations(): PricingConfig[] {
    console.log('🔄 Enhanced: Loading mixed-mode configurations...');
    
    // Try custom data first
    const validation = PricingDataDiagnostic.validateCustomPricingData();
    if (validation.isValid && validation.data.length > 0) {
      console.log('✅ Enhanced: Using custom configurations in mixed mode:', validation.data.length);
      return validation.data;
    }
    
    // Fallback to master data
    try {
      const masterData = localStorage.getItem(this.MASTER_DATA_KEY);
      if (masterData) {
        const parsed = JSON.parse(masterData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('✅ Enhanced: Using master data configurations:', parsed.length);
          return parsed;
        }
      }
    } catch (error) {
      console.error('❌ Enhanced: Error loading master data:', error);
    }
    
    console.log('⚠️ Enhanced: No configurations available in mixed mode');
    return [];
  }
  
  private static handleLoadingError(): PricingConfig[] {
    console.log('🚨 Enhanced: Handling loading error with emergency recovery...');
    
    try {
      const recoveredData = PricingDataProtection.emergencyRecovery();
      if (recoveredData.length > 0) {
        console.log('✅ Enhanced: Emergency recovery successful during error handling');
        return recoveredData;
      }
    } catch (error) {
      console.error('❌ Enhanced: Emergency recovery failed:', error);
    }
    
    return [];
  }

  // Prevent Data Corruption with atomic updates
  private static saveConfigurations(configs: PricingConfig[]): boolean {
    console.log('💾 Enhanced: Atomic save operation starting...');
    
    // Create backup before save
    PricingDataProtection.createBackup('before_enhanced_save');
    
    // Atomic save operation
    const success = PricingDataProtection.safeSave(configs, 'enhanced_atomic_save');
    
    if (success) {
      console.log('✅ Enhanced: Atomic save completed successfully');
      return true;
    } else {
      console.error('❌ Enhanced: Atomic save failed');
      return false;
    }
  }
}