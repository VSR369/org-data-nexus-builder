// Comprehensive Pricing Data Diagnostic and Debugging Tool
// Step 1: Debug and Audit Current Data State

export class PricingDataDiagnostic {
  
  static auditAllPricingData(): void {
    console.log('🔍 === PRICING DATA AUDIT ===');
    
    // Check all pricing-related localStorage keys
    const pricingKeys = Object.keys(localStorage).filter(key => 
      key.toLowerCase().includes('pricing') || 
      key.toLowerCase().includes('engagement') ||
      key.toLowerCase().includes('master_data')
    );
    
    console.log('📋 All pricing-related localStorage keys:', pricingKeys);
    
    pricingKeys.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            console.log(`🔍 ${key}: ${parsed.length} items`);
            parsed.forEach((item, index) => {
              if (item.engagementModel) {
                console.log(`  ${index + 1}. ${item.engagementModel} (${item.membershipStatus || 'N/A'}) - ${item.country}/${item.currency}`);
                console.log(`     Fees: Q:${item.quarterlyFee}, H:${item.halfYearlyFee}, A:${item.annualFee}`);
              }
            });
          } else {
            console.log(`🔍 ${key}:`, typeof parsed, parsed);
          }
        }
      } catch (error) {
        console.error(`❌ Error parsing ${key}:`, error);
      }
    });
    
    console.log('🔍 === END PRICING DATA AUDIT ===');
  }
  
  static validateCustomPricingData(): { isValid: boolean; issues: string[]; data: any[] } {
    const issues: string[] = [];
    let data: any[] = [];
    
    try {
      const customData = localStorage.getItem('custom_pricing');
      if (!customData) {
        issues.push('No custom_pricing data found');
        return { isValid: false, issues, data };
      }
      
      data = JSON.parse(customData);
      
      if (!Array.isArray(data)) {
        issues.push('Custom pricing data is not an array');
        return { isValid: false, issues, data: [] };
      }
      
      // Validate each configuration
      data.forEach((config, index) => {
        if (!config.id) issues.push(`Config ${index}: Missing ID`);
        if (!config.engagementModel) issues.push(`Config ${index}: Missing engagement model`);
        if (typeof config.quarterlyFee !== 'number') issues.push(`Config ${index}: Invalid quarterly fee (${config.quarterlyFee})`);
        if (typeof config.halfYearlyFee !== 'number') issues.push(`Config ${index}: Invalid half-yearly fee (${config.halfYearlyFee})`);
        if (typeof config.annualFee !== 'number') issues.push(`Config ${index}: Invalid annual fee (${config.annualFee})`);
        if (!config.country) issues.push(`Config ${index}: Missing country`);
        if (!config.currency) issues.push(`Config ${index}: Missing currency`);
        if (!config.organizationType) issues.push(`Config ${index}: Missing organization type`);
      });
      
    } catch (error) {
      issues.push(`Error parsing custom pricing data: ${error.message}`);
    }
    
    return { isValid: issues.length === 0, issues, data };
  }
  
  static debugEngagementModelMatching(): void {
    console.log('🔍 === ENGAGEMENT MODEL MATCHING DEBUG ===');
    
    // Load engagement models
    const engagementModelsData = localStorage.getItem('master_data_engagement_models');
    let engagementModels: any[] = [];
    
    if (engagementModelsData) {
      try {
        engagementModels = JSON.parse(engagementModelsData);
        console.log('📋 Engagement Models:', engagementModels.map(m => ({ id: m.id, name: m.name })));
      } catch (error) {
        console.error('❌ Error parsing engagement models:', error);
      }
    }
    
    // Load pricing configs
    const validation = this.validateCustomPricingData();
    console.log('📋 Pricing Configurations:', validation.data.map(p => ({ 
      id: p.id, 
      engagementModel: p.engagementModel,
      membershipStatus: p.membershipStatus,
      country: p.country,
      currency: p.currency
    })));
    
    // Check matching
    engagementModels.forEach(model => {
      const matchingConfigs = validation.data.filter(config => 
        config.engagementModel === model.name ||
        config.engagementModel.toLowerCase() === model.name.toLowerCase()
      );
      
      console.log(`🔗 "${model.name}" matches:`, matchingConfigs.length, 'configurations');
      if (matchingConfigs.length === 0) {
        console.warn(`⚠️ No pricing configurations found for "${model.name}"`);
      }
    });
    
    console.log('🔍 === END ENGAGEMENT MODEL MATCHING DEBUG ===');
  }
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).PricingDataDiagnostic = PricingDataDiagnostic;
}