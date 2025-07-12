// Force Custom Pricing Mode - Ensures only user's custom pricing configurations are shown
// This utility specifically addresses the issue where default Global/USD configs override custom INR/MSME configs

export class ForceCustomPricingMode {
  
  static enableCustomPricingMode(): void {
    console.log('🎯 === FORCING CUSTOM PRICING MODE ===');
    
    // Set to custom-only mode
    localStorage.setItem('master_data_mode', 'custom_only');
    console.log('✅ Set master data mode to: custom_only');
    
    // Clear any cached default pricing data that might interfere
    const keysToRemove = [
      'master_data_pricing_configs', // Remove any cached default configs
      'pricing_backup_default',       // Remove default backup
      'temp_pricing_configs',         // Remove temporary configs
      'fallback_pricing_data'         // Remove fallback data
    ];
    
    keysToRemove.forEach(key => {
      const existingData = localStorage.getItem(key);
      if (existingData) {
        localStorage.removeItem(key);
        console.log(`🗑️ Cleared interfering pricing data: ${key}`);
      }
    });
    
    // Verify custom pricing data exists
    const customPricing = localStorage.getItem('custom_pricing');
    if (customPricing) {
      try {
        const parsed = JSON.parse(customPricing);
        console.log(`✅ Custom pricing data verified: ${parsed.length} configurations`);
        console.log('📋 Custom configurations found:');
        parsed.forEach((config: any, index: number) => {
          console.log(`  ${index + 1}. ${config.engagementModel} (${config.membershipStatus}) - ${config.country}/${config.currency}`);
        });
      } catch (error) {
        console.warn('⚠️ Error parsing custom pricing data:', error);
      }
    } else {
      console.log('⚠️ No custom_pricing data found in localStorage');
      console.log('📋 Available pricing-related keys:', 
        Object.keys(localStorage).filter(k => k.toLowerCase().includes('pricing'))
      );
    }
    
    console.log('🎯 === CUSTOM PRICING MODE ENABLED ===');
  }
  
  static validateCustomMode(): boolean {
    const mode = localStorage.getItem('master_data_mode');
    const customData = localStorage.getItem('custom_pricing');
    
    console.log('🔍 Validation Results:');
    console.log(`  - Mode: ${mode}`);
    console.log(`  - Custom Data: ${customData ? 'EXISTS' : 'MISSING'}`);
    
    return mode === 'custom_only' && customData !== null;
  }
  
  static logCurrentPricingState(): void {
    console.log('📊 === CURRENT PRICING STATE ===');
    console.log('Mode:', localStorage.getItem('master_data_mode'));
    
    const customPricing = localStorage.getItem('custom_pricing');
    if (customPricing) {
      try {
        const parsed = JSON.parse(customPricing);
        console.log('Custom Pricing Configurations:', parsed.length);
        parsed.forEach((config: any) => {
          console.log(`  - ${config.engagementModel} (${config.membershipStatus}): ${config.quarterlyFee}/${config.halfYearlyFee}/${config.annualFee}`);
        });
      } catch (error) {
        console.error('Error parsing custom pricing:', error);
      }
    } else {
      console.log('No custom pricing data found');
    }
    
    console.log('📊 === END PRICING STATE ===');
  }
}

// Auto-execute to ensure custom mode is enabled
ForceCustomPricingMode.enableCustomPricingMode();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).ForceCustomPricingMode = ForceCustomPricingMode;
}