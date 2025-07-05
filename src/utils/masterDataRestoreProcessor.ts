// Enhanced Master Data Restore Processor - Comprehensive restoration of all custom data

export class MasterDataRestoreProcessor {
  
  static async restoreAllCustomData() {
    console.log('🔄 === COMPREHENSIVE MASTER DATA RESTORATION START ===');
    
    const masterDataKeys = [
      'master_data_currencies',
      'master_data_countries', 
      'master_data_industry_segments',
      'master_data_organization_types',
      'master_data_entity_types',
      'master_data_departments',
      'master_data_domain_groups',
      'master_data_engagement_models',
      'master_data_seeker_membership_fees',
      'master_data_competency_capabilities',
      'master_data_challenge_statuses',
      'master_data_solution_statuses',
      'master_data_communication_types',
      'master_data_reward_types',
      'master_data_pricing_configurations'
    ];
    
    const restorationResults = {
      customDataFound: [] as string[],
      emptyData: [] as string[],
      restoredData: [] as string[],
      totalCustomConfigurations: 0
    };
    
    // Analyze each master data category
    for (const key of masterDataKeys) {
      const data = localStorage.getItem(key);
      
      if (data && data !== 'null' && data !== 'undefined' && data !== '[]') {
        try {
          const parsed = JSON.parse(data);
          
          if (Array.isArray(parsed) && parsed.length > 0) {
            restorationResults.customDataFound.push(key);
            restorationResults.totalCustomConfigurations += parsed.length;
            console.log(`✅ Custom data found for ${key}: ${parsed.length} items`);
            
            // Log sample of the data
            console.log(`📋 Sample ${key}:`, parsed.slice(0, 2));
            
          } else if (typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            restorationResults.customDataFound.push(key);
            restorationResults.totalCustomConfigurations += Object.keys(parsed).length;
            console.log(`✅ Custom data found for ${key}: ${Object.keys(parsed).length} properties`);
            
          } else {
            restorationResults.emptyData.push(key);
            console.log(`⚠️ Empty data for ${key}`);
          }
        } catch (parseError) {
          console.error(`❌ Error parsing ${key}:`, parseError);
          restorationResults.emptyData.push(key);
        }
      } else {
        restorationResults.emptyData.push(key);
        console.log(`❌ No data found for ${key}`);
      }
    }
    
    // Force refresh of all data managers to use custom data
    this.refreshAllDataManagers();
    
    // Clear any caches that might interfere
    this.clearInterfacingCaches();
    
    console.log('📊 RESTORATION SUMMARY:');
    console.log(`✅ Custom data categories: ${restorationResults.customDataFound.length}`);
    console.log(`📋 Total custom configurations: ${restorationResults.totalCustomConfigurations}`);
    console.log(`⚠️ Empty/missing categories: ${restorationResults.emptyData.length}`);
    
    if (restorationResults.customDataFound.length > 0) {
      console.log('🎯 Custom data categories with configurations:');
      restorationResults.customDataFound.forEach(key => {
        console.log(`  - ${key.replace('master_data_', '')}`);
      });
    }
    
    if (restorationResults.emptyData.length > 0) {
      console.log('⚠️ Categories without custom data (will use defaults):');
      restorationResults.emptyData.forEach(key => {
        console.log(`  - ${key.replace('master_data_', '')}`);
      });
    }
    
    console.log('🔄 === COMPREHENSIVE MASTER DATA RESTORATION END ===');
    
    return restorationResults;
  }
  
  static refreshAllDataManagers() {
    console.log('🔄 Refreshing all data manager caches...');
    
    // Clear component-level caches
    const cacheKeys = Object.keys(localStorage).filter(key => 
      key.includes('_cache') || 
      key.includes('_version') || 
      key.includes('_initialized')
    );
    
    cacheKeys.forEach(key => {
      if (!key.startsWith('master_data_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear session storage
    sessionStorage.clear();
    
    console.log(`🗑️ Cleared ${cacheKeys.length} cache entries`);
  }
  
  static clearInterfacingCaches() {
    console.log('🧹 Clearing interfacing caches...');
    
    // Clear any temporary storage that might interfere
    const tempKeys = Object.keys(localStorage).filter(key =>
      key.includes('temp_') ||
      key.includes('loading_') ||
      key.includes('default_')
    );
    
    tempKeys.forEach(key => localStorage.removeItem(key));
    
    console.log(`🗑️ Cleared ${tempKeys.length} temporary entries`);
  }
  
  static async validateCustomDataIntegrity() {
    console.log('🔍 Validating custom data integrity...');
    
    const results = await this.restoreAllCustomData();
    
    const healthReport = {
      isHealthy: results.customDataFound.length > results.emptyData.length,
      customDataPercentage: Math.round((results.customDataFound.length / (results.customDataFound.length + results.emptyData.length)) * 100),
      totalConfigurations: results.totalCustomConfigurations,
      recommendations: [] as string[]
    };
    
    if (healthReport.customDataPercentage < 50) {
      healthReport.recommendations.push('Consider configuring more master data categories');
    }
    
    if (results.totalCustomConfigurations === 0) {
      healthReport.recommendations.push('No custom configurations found - system will use defaults');
    }
    
    console.log('📊 HEALTH REPORT:', healthReport);
    
    return healthReport;
  }
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).MasterDataRestoreProcessor = MasterDataRestoreProcessor;
}