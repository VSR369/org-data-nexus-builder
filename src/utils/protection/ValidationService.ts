// Data Validation Service
import { PricingConfig } from '@/types/pricing';

export class ValidationService {
  
  // Validate pricing configurations
  static validateConfigurations(configs: PricingConfig[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(configs)) {
      errors.push('Configurations must be an array');
      return { isValid: false, errors };
    }
    
    configs.forEach((config, index) => {
      if (!config.id) errors.push(`Config ${index}: Missing ID`);
      if (!config.engagementModel) errors.push(`Config ${index}: Missing engagement model`);
      if (!config.organizationType) errors.push(`Config ${index}: Missing organization type`);
      if (typeof config.quarterlyFee !== 'number') errors.push(`Config ${index}: Invalid quarterly fee`);
      if (typeof config.halfYearlyFee !== 'number') errors.push(`Config ${index}: Invalid half-yearly fee`);
      if (typeof config.annualFee !== 'number') errors.push(`Config ${index}: Invalid annual fee`);
    });
    
    return { isValid: errors.length === 0, errors };
  }

  // Health check - verifies data integrity
  static healthCheck(): { healthy: boolean; issues: string[]; configCount: number } {
    const issues: string[] = [];
    
    try {
      const customConfigs = this.getCurrentCustomData();
      const masterConfigs = this.getCurrentMasterData();
      const totalConfigs = customConfigs.length + masterConfigs.length;
      
      if (totalConfigs === 0) {
        issues.push('No pricing configurations found in any storage location');
      }
      
      // Check for data corruption
      const validation = this.validateConfigurations([...customConfigs, ...masterConfigs]);
      if (!validation.isValid) {
        issues.push(`Data validation errors: ${validation.errors.join(', ')}`);
      }
      
      const healthy = issues.length === 0;
      
      console.log(`🏥 Pricing data health check: ${healthy ? 'HEALTHY' : 'ISSUES FOUND'}`);
      if (issues.length > 0) {
        console.warn('⚠️ Health check issues:', issues);
      }
      
      return { healthy, issues, configCount: totalConfigs };
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { healthy: false, issues: [`Health check error: ${error.message}`], configCount: 0 };
    }
  }

  private static getCurrentCustomData(): PricingConfig[] {
    try {
      const customData = localStorage.getItem('custom_pricing');
      if (customData) {
        const parsed = JSON.parse(customData);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error getting custom data:', error);
    }
    return [];
  }

  private static getCurrentMasterData(): PricingConfig[] {
    try {
      const masterData = localStorage.getItem('master_data_pricing_configs');
      if (masterData) {
        const parsed = JSON.parse(masterData);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error getting master data:', error);
    }
    return [];
  }
}