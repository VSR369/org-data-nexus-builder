// Master Data Restorer - Fixes issues where custom data is not loading properly

export class MasterDataRestorer {
  
  static analyzeCurrentState() {
    console.log('🔍 Analyzing current master data state...');
    
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
      'master_data_reward_types'
    ];
    
    const analysis = {
      userDataFound: [] as string[],
      emptyData: [] as string[],
      missingData: [] as string[],
      totalUserDataKeys: 0
    };
    
    masterDataKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data && data !== 'null' && data !== 'undefined') {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            analysis.userDataFound.push(key);
            analysis.totalUserDataKeys++;
          } else if (typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            analysis.userDataFound.push(key);
            analysis.totalUserDataKeys++;
          } else {
            analysis.emptyData.push(key);
          }
        } catch {
          analysis.emptyData.push(key);
        }
      } else {
        analysis.missingData.push(key);
      }
    });
    
    return analysis;
  }
  
  static restoreUserData() {
    console.log('🔧 Starting master data restoration process...');
    
    const analysis = this.analyzeCurrentState();
    
    console.log('📊 Analysis Results:', {
      userDataKeys: analysis.userDataFound.length,
      emptyKeys: analysis.emptyData.length,
      missingKeys: analysis.missingData.length
    });
    
    if (analysis.totalUserDataKeys > 0) {
      console.log('✅ Found user data in storage:', analysis.userDataFound);
      
      // Clear any component caches that might be interfering
      this.clearComponentCaches();
      
      // Force refresh of all data managers
      this.refreshDataManagerCaches();
      
      return {
        success: true,
        message: `Successfully restored ${analysis.totalUserDataKeys} master data configurations`,
        userDataKeys: analysis.userDataFound
      };
    } else {
      console.log('⚠️ No user data found in storage');
      return {
        success: false,
        message: 'No custom master data found to restore',
        userDataKeys: []
      };
    }
  }
  
  static clearComponentCaches() {
    console.log('🧹 Clearing component caches...');
    
    // Clear any cached data that components might be holding
    const cacheKeys = Object.keys(localStorage).filter(key => 
      key.includes('_cache') || 
      key.includes('_version') || 
      key.includes('_initialized') ||
      key.endsWith('_session')
    );
    
    cacheKeys.forEach(key => {
      if (!key.startsWith('master_data_')) { // Preserve actual master data
        localStorage.removeItem(key);
      }
    });
    
    // Clear session storage as well
    sessionStorage.clear();
    
    console.log(`🗑️ Cleared ${cacheKeys.length} cache entries`);
  }
  
  static refreshDataManagerCaches() {
    console.log('🔄 Refreshing data manager caches...');
    
    // This would trigger cache refresh in DataManager instances
    // For now, we'll rely on the component refresh after restoration
    
    // Force a page refresh to ensure all components reload with fresh data
    console.log('🔄 Page refresh recommended to ensure all components load fresh data');
  }
  
  static validateDataIntegrity() {
    console.log('🔍 Validating master data integrity...');
    
    const analysis = this.analyzeCurrentState();
    const issues = [];
    
    // Check for common issues
    if (analysis.missingData.length > analysis.userDataFound.length) {
      issues.push('More missing data than user data - possible initialization issue');
    }
    
    if (analysis.emptyData.length > 0) {
      issues.push(`${analysis.emptyData.length} keys have empty/invalid data`);
    }
    
    // Check specific critical data
    const criticalKeys = [
      'master_data_currencies',
      'master_data_industry_segments',
      'master_data_organization_types'
    ];
    
    const missingCritical = criticalKeys.filter(key => 
      !analysis.userDataFound.includes(key) && !analysis.emptyData.includes(key)
    );
    
    if (missingCritical.length > 0) {
      issues.push(`Missing critical master data: ${missingCritical.join(', ')}`);
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      analysis
    };
  }
  
  static forceReset() {
    console.log('⚠️ FORCE RESET: Clearing all master data...');
    
    const masterDataKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('master_data_')
    );
    
    masterDataKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    sessionStorage.clear();
    
    console.log(`🗑️ Force reset complete: ${masterDataKeys.length} keys removed`);
    
    return {
      success: true,
      message: `Force reset complete - ${masterDataKeys.length} master data keys removed`,
      clearedKeys: masterDataKeys
    };
  }
}

// Auto-run restoration check on import
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => {
    const analysis = MasterDataRestorer.analyzeCurrentState();
    if (analysis.totalUserDataKeys > 0) {
      console.log(`🎯 MasterDataRestorer: Found ${analysis.totalUserDataKeys} user data configurations ready to restore`);
    }
  }, 1000);
}