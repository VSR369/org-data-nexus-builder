// Enhanced Pricing Data Manager - Steps 2-6 Implementation
// Fixes data loading logic, validation, Platform as a Service lookup, prevents corruption, and adds error handling

import { PricingConfig } from '@/types/pricing';
import { PricingDataProtection } from './pricingDataProtection';
import { PricingDataDiagnostic } from './pricingDataDiagnostic';

export class EnhancedPricingDataManager {
  private static readonly CUSTOM_PRICING_KEY = 'custom_pricing';
  private static readonly MASTER_DATA_KEY = 'master_data_pricing_configs';
  
  // Step 4: Fix Platform as a Service Lookup with proper name mapping
  private static readonly ENGAGEMENT_MODEL_MAPPINGS = {
    'Market Place': ['Market Place', 'marketplace', 'Marketplace'],
    'Aggregator': ['Aggregator', 'aggregator'],
    'Market Place & Aggregator': ['Market Place & Aggregator', 'marketplace-aggregator', 'Marketplace & Aggregator'],
    'Platform as a Service': ['Platform as a Service', 'platform-service', 'PaaS', 'Platform Service']
  };

  // Step 2: Fix Data Loading Logic with prioritized custom configurations
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

  // Step 2 & 4: Enhanced lookup with proper model name matching
  static getPricingForEngagementModel(engagementModel: string, membershipStatus?: string): PricingConfig | null {
    console.log(`🔍 Enhanced: Looking for pricing - Model: "${engagementModel}", Membership: "${membershipStatus || 'any'}"`);
    
    const configs = this.getAllConfigurations();
    
    // Step 4: Use mapping to find the correct configuration
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
          return this.validateConfigurationData(exactMatch);
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
        return this.validateConfigurationData(match);
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
  
  // Step 3: Strengthen Data Validation
  private static validateConfigurationData(config: PricingConfig): PricingConfig | null {
    if (!config) return null;
    
    // Check required fields
    if (!config.id || !config.engagementModel) {
      console.warn('⚠️ Enhanced: Invalid configuration - missing required fields:', config);
      return null;
    }
    
    // Validate pricing values
    const hasValidPricing = (
      typeof config.quarterlyFee === 'number' && config.quarterlyFee >= 0
    ) || (
      typeof config.halfYearlyFee === 'number' && config.halfYearlyFee >= 0  
    ) || (
      typeof config.annualFee === 'number' && config.annualFee >= 0
    );
    
    if (!hasValidPricing) {
      console.warn('⚠️ Enhanced: Invalid configuration - no valid pricing data:', config);
      return null;
    }
    
    // Sanitize undefined values to prevent runtime errors
    return {
      ...config,
      quarterlyFee: config.quarterlyFee || 0,
      halfYearlyFee: config.halfYearlyFee || 0,
      annualFee: config.annualFee || 0,
      discountPercentage: config.discountPercentage || 0
    };
  }

  // Step 5: Prevent Data Corruption with atomic updates
  static saveConfigurations(configs: PricingConfig[]): boolean {
    console.log('💾 Enhanced: Atomic save operation starting...');
    
    // Step 3: Validate before saving
    const validation = this.validateConfigurationsArray(configs);
    if (!validation.isValid) {
      console.error('❌ Enhanced: Save blocked due to validation errors:', validation.errors);
      return false;
    }
    
    // Step 5: Create backup before save
    PricingDataProtection.createBackup('before_enhanced_save');
    
    // Step 5: Atomic save operation
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    const success = PricingDataProtection.safeSave(configs, 'enhanced_atomic_save');
    
    if (success) {
      console.log('✅ Enhanced: Atomic save completed successfully');
      return true;
    } else {
      console.error('❌ Enhanced: Atomic save failed');
      return false;
    }
  }
  
  private static validateConfigurationsArray(configs: PricingConfig[]): { isValid: boolean; errors: string[] } {
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
      
      // Check that at least one pricing value is valid
      const hasValidPricing = [config.quarterlyFee, config.halfYearlyFee, config.annualFee]
        .some(fee => typeof fee === 'number' && fee >= 0);
      
      if (!hasValidPricing) {
        errors.push(`Config ${index}: No valid pricing data`);
      }
    });
    
    return { isValid: errors.length === 0, errors };
  }

  // Step 6: Enhanced Error Handling with graceful degradation
  static getPricingWithErrorHandling(
    engagementModel: string, 
    membershipStatus?: string
  ): { 
    pricing: PricingConfig | null; 
    error: string | null; 
    fallbackUsed: boolean 
  } {
    try {
      const pricing = this.getPricingForEngagementModel(engagementModel, membershipStatus);
      
      if (pricing) {
        return { pricing, error: null, fallbackUsed: false };
      }
      
      // Try fallback without membership status
      if (membershipStatus) {
        const fallbackPricing = this.getPricingForEngagementModel(engagementModel);
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

  // Utility method for comprehensive health check
  static performHealthCheck(): { 
    healthy: boolean; 
    issues: string[]; 
    configCount: number; 
    recommendations: string[] 
  } {
    console.log('🏥 Enhanced: Performing comprehensive health check...');
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Run diagnostic audit
    PricingDataDiagnostic.auditAllPricingData();
    
    // Validate custom data
    const validation = PricingDataDiagnostic.validateCustomPricingData();
    if (!validation.isValid) {
      issues.push(...validation.issues);
      recommendations.push('Fix custom pricing data validation issues');
    }
    
    // Check engagement model matching
    const configs = this.getAllConfigurations();
    const configCount = configs.length;
    
    if (configCount === 0) {
      issues.push('No pricing configurations available');
      recommendations.push('Create pricing configurations for your engagement models');
    }
    
    // Check for Platform as a Service specifically
    const paasConfig = this.getPricingForEngagementModel('Platform as a Service');
    if (!paasConfig) {
      issues.push('No Platform as a Service pricing configuration found');
      recommendations.push('Add Platform as a Service pricing configuration');
    }
    
    // Run protection system health check
    const protectionHealth = PricingDataProtection.healthCheck();
    if (!protectionHealth.healthy) {
      issues.push(...protectionHealth.issues);
      recommendations.push('Address data protection issues');
    }
    
    const healthy = issues.length === 0;
    
    console.log(`🏥 Enhanced: Health check ${healthy ? 'PASSED' : 'FAILED'}`);
    if (issues.length > 0) {
      console.warn('⚠️ Enhanced: Health issues found:', issues);
    }
    
    return { healthy, issues, configCount, recommendations };
  }
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).EnhancedPricingDataManager = EnhancedPricingDataManager;
}