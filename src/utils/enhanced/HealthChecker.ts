// Comprehensive Health Check System
import { PricingDataDiagnostic } from '../pricingDataDiagnostic';
import { PricingDataProtection } from '../pricingDataProtection';
import { DataLoader } from './DataLoader';
import { EngagementModelMapper } from './EngagementModelMapper';

export class HealthChecker {
  
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
    const configs = DataLoader.getAllConfigurations();
    const configCount = configs.length;
    
    if (configCount === 0) {
      issues.push('No pricing configurations available');
      recommendations.push('Create pricing configurations for your engagement models');
    }
    
    // Check for Platform as a Service specifically
    const paasConfig = EngagementModelMapper.getPricingForEngagementModel(configs, 'Platform as a Service');
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