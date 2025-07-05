/**
 * Custom Data Extractor - Retrieves and permanently keeps only custom configured master data
 * Removes all default/fallback data and preserves only user-configured data
 */

interface CustomDataReport {
  totalCustomConfigurations: number;
  customDataCategories: string[];
  extractedData: Record<string, any>;
  removedDefaultKeys: string[];
  preservedCustomKeys: string[];
}

export class CustomDataExtractor {
  
  /**
   * Extract and preserve only custom configured data permanently
   */
  static async extractAndPreserveCustomData(): Promise<CustomDataReport> {
    console.log('🔍 === CUSTOM DATA EXTRACTION START ===');
    
    const report: CustomDataReport = {
      totalCustomConfigurations: 0,
      customDataCategories: [],
      extractedData: {},
      removedDefaultKeys: [],
      preservedCustomKeys: []
    };

    // Define master data categories and their storage keys
    const masterDataCategories = {
      'countries': ['countries', 'master_data_countries'],
      'currencies': ['currencies', 'master_data_currencies'],
      'industrySegments': ['industrySegments', 'master_data_industry_segments'],
      'organizationTypes': ['organizationTypes', 'master_data_organization_types'],
      'entityTypes': ['entityTypes', 'master_data_entity_types'],
      'departments': ['departments', 'master_data_departments'],
      'domainGroups': ['domainGroups', 'master_data_domain_groups'],
      'challengeStatuses': ['challengeStatuses', 'master_data_challenge_statuses'],
      'solutionStatuses': ['solutionStatuses', 'master_data_solution_statuses'],
      'competencyCapabilities': ['competencyCapabilities', 'master_data_competency_capabilities'],
      'communicationTypes': ['communicationTypes', 'master_data_communication_types'],
      'rewardTypes': ['rewardTypes', 'master_data_reward_types'],
      'seekerMembershipFees': ['seekerMembershipFees', 'master_data_seeker_membership_fees'],
      'engagementModels': ['engagementModels', 'master_data_engagement_models'],
      'pricingConfigurations': ['pricing_configurations', 'master_data_pricing'],
      'eventsCalendar': ['eventsCalendar', 'master_data_events']
    };

    // Step 1: Identify custom configured data
    console.log('📋 Scanning for custom configured data...');
    
    for (const [category, storageKeys] of Object.entries(masterDataCategories)) {
      for (const key of storageKeys) {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            
            // Check if this is custom data (has modifications, user-created entries, or custom configurations)
            if (this.isCustomData(parsedData, category)) {
              console.log(`✅ Found custom data in category: ${category} (key: ${key})`);
              report.customDataCategories.push(category);
              report.extractedData[category] = parsedData;
              report.totalCustomConfigurations += Array.isArray(parsedData) ? parsedData.length : Object.keys(parsedData).length;
              report.preservedCustomKeys.push(key);
            }
          } catch (error) {
            console.warn(`⚠️ Error parsing data for ${key}:`, error);
          }
        }
      }
    }

    // Step 2: Remove all default/fallback data
    console.log('🧹 Removing default and fallback data...');
    
    const allKeys = Object.keys(localStorage);
    const defaultDataPatterns = [
      'fallback_',
      'default_',
      'seed_',
      'master_data_seeded_',
      'initialized_',
      'auto_generated_'
    ];

    // Remove default data keys
    allKeys.forEach(key => {
      const isDefaultData = defaultDataPatterns.some(pattern => key.includes(pattern));
      const isMasterDataKey = Object.values(masterDataCategories).flat().includes(key);
      
      if (isDefaultData || (isMasterDataKey && !report.preservedCustomKeys.includes(key))) {
        // Check if we have custom version of this data
        const hasCustomVersion = report.preservedCustomKeys.some(customKey => 
          key.includes(customKey.replace('master_data_', '')) || 
          customKey.includes(key.replace('master_data_', ''))
        );
        
        if (!hasCustomVersion) {
          localStorage.removeItem(key);
          report.removedDefaultKeys.push(key);
          console.log(`🗑️ Removed default data key: ${key}`);
        }
      }
    });

    // Step 3: Create clean custom-only storage structure
    console.log('🏗️ Creating clean custom-only storage structure...');
    
    // Clear and recreate with only custom data
    const customOnlyPrefix = 'custom_';
    Object.keys(report.extractedData).forEach(category => {
      const cleanKey = `${customOnlyPrefix}${category}`;
      localStorage.setItem(cleanKey, JSON.stringify(report.extractedData[category]));
      console.log(`✅ Preserved custom data: ${cleanKey}`);
    });

    // Step 4: Set permanent custom-only flag
    localStorage.setItem('master_data_mode', 'custom_only');
    localStorage.setItem('custom_data_extraction_timestamp', new Date().toISOString());
    localStorage.setItem('custom_data_report', JSON.stringify(report));

    console.log('✅ === CUSTOM DATA EXTRACTION COMPLETE ===');
    console.log(`📊 Summary: ${report.totalCustomConfigurations} custom configurations across ${report.customDataCategories.length} categories`);
    
    return report;
  }

  /**
   * Check if data is custom (not default/generated)
   */
  private static isCustomData(data: any, category: string): boolean {
    if (!data) return false;

    console.log(`🔍 Checking if ${category} is custom data:`, data);

    // SPECIAL HANDLING FOR CURRENCIES (user's issue)
    if (category === 'currencies') {
      if (Array.isArray(data)) {
        // If user has exactly 3 currencies (INR, USD, AED) as they mentioned, this is custom
        if (data.length === 3) {
          const currencies = data.map(c => c.code).sort();
          console.log(`💰 Found 3 currencies: ${currencies.join(', ')}`);
          // Check if it matches user's configuration
          if (currencies.includes('INR') && currencies.includes('USD') && currencies.includes('AED')) {
            console.log(`✅ CUSTOM: User's specific 3-currency configuration detected`);
            return true;
          }
        }
        
        // If more than 2 (emergency fallback size), it's likely custom
        if (data.length > 2) {
          console.log(`✅ CUSTOM: Currency array has ${data.length} items (> 2 emergency fallback)`);
          return true;
        }
        
        // Check if any currency has user identifiers or custom properties
        const hasUserData = data.some(currency => 
          currency && (
            currency.isUserCreated === true ||
            currency.isCustom === true ||
            (currency.id && !currency.id.toString().startsWith('fallback_')) ||
            (currency.createdAt && !currency.id?.toString().startsWith('fallback_'))
          )
        );
        
        if (hasUserData) {
          console.log(`✅ CUSTOM: Currency has user-created indicators`);
          return true;
        }
      }
    }

    // SPECIAL HANDLING FOR COUNTRIES (similar logic)
    if (category === 'countries') {
      if (Array.isArray(data) && data.length > 3) { // More than 3 default countries
        console.log(`✅ CUSTOM: Countries array has ${data.length} items (> 3 defaults)`);
        return true;
      }
    }

    // Check for custom indicators
    const customIndicators = [
      'isCustom',
      'userCreated', 
      'customConfiguration',
      'modifiedBy',
      'lastModified',
      'custom_',
      'user_'
    ];

    // For industry segments - check nested structure
    if (category === 'industrySegments' && data.industrySegments && Array.isArray(data.industrySegments)) {
      const hasCustomData = data.industrySegments.length > this.getDefaultDataSize(category) ||
        data.industrySegments.some((item: any) => 
          typeof item === 'object' && 
          (customIndicators.some(indicator => 
            item.hasOwnProperty(indicator) || 
            JSON.stringify(item).includes(indicator)
          ) || (item.id && !item.id.toString().match(/^[1-3]$/))) // Not just default IDs 1,2,3
        );
      console.log(`✅ Industry segments custom check result: ${hasCustomData}`);
      return hasCustomData;
    }

    // For arrays
    if (Array.isArray(data)) {
      const hasCustomData = data.some(item => 
        typeof item === 'object' && 
        customIndicators.some(indicator => 
          item.hasOwnProperty(indicator) || 
          JSON.stringify(item).includes(indicator)
        )
      ) || data.length > this.getDefaultDataSize(category);
      console.log(`✅ Array custom check result for ${category}: ${hasCustomData}`);
      return hasCustomData;
    }

    // For objects
    if (typeof data === 'object') {
      const dataString = JSON.stringify(data);
      const hasCustomData = customIndicators.some(indicator => 
        data.hasOwnProperty(indicator) || 
        dataString.includes(indicator)
      ) || Object.keys(data).length > this.getDefaultDataSize(category);
      console.log(`✅ Object custom check result for ${category}: ${hasCustomData}`);
      return hasCustomData;
    }

    return false;
  }

  /**
   * Get expected default data size for each category
   */
  private static getDefaultDataSize(category: string): number {
    const defaultSizes: Record<string, number> = {
      'countries': 3,        // Reduced - only 3 defaults
      'currencies': 2,       // Reduced - only 2 defaults  
      'industrySegments': 3, // Reduced - only 3 defaults
      'organizationTypes': 5,
      'entityTypes': 2,      // Reduced - only 2 defaults
      'departments': 6,
      'domainGroups': 0,
      'challengeStatuses': 4,
      'solutionStatuses': 4,
      'competencyCapabilities': 0,
      'communicationTypes': 5,
      'rewardTypes': 4,
      'seekerMembershipFees': 0,
      'engagementModels': 0,
      'pricingConfigurations': 0,
      'eventsCalendar': 0
    };
    
    return defaultSizes[category] || 0;
  }

  /**
   * Load custom-only data into the application
   */
  static loadCustomOnlyData(): Record<string, any> {
    console.log('📖 Loading custom-only data...');
    
    const customData: Record<string, any> = {};
    const customOnlyPrefix = 'custom_';
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(customOnlyPrefix)) {
        try {
          const category = key.replace(customOnlyPrefix, '');
          customData[category] = JSON.parse(localStorage.getItem(key) || '{}');
          console.log(`✅ Loaded custom data for: ${category}`);
        } catch (error) {
          console.warn(`⚠️ Error loading custom data for ${key}:`, error);
        }
      }
    });
    
    return customData;
  }

  /**
   * Get custom data for specific category with fallback support
   */
  static getCustomDataForCategory(category: string): any | null {
    const isCustomMode = this.isCustomOnlyMode();
    if (!isCustomMode) {
      return null;
    }
    
    const customKey = `custom_${category}`;
    const customData = localStorage.getItem(customKey);
    
    if (customData) {
      try {
        return JSON.parse(customData);
      } catch (error) {
        console.error(`❌ Failed to parse custom data for ${category}:`, error);
      }
    }
    
    return null;
  }

  /**
   * Debug function to show current data status
   */
  static debugDataStatus(): void {
    console.log('🔍 === CUSTOM DATA DEBUG STATUS ===');
    console.log('Custom-only mode:', this.isCustomOnlyMode());
    
    const customKeys = Object.keys(localStorage).filter(key => key.startsWith('custom_'));
    console.log('Custom data keys found:', customKeys.length);
    
    customKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          const count = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
          console.log(`  - ${key}: ${count} items`);
        } catch (error) {
          console.log(`  - ${key}: Invalid JSON`);
        }
      }
    });
    
    console.log('=== END DEBUG STATUS ===');
  }

  /**
   * Get extraction report
   */
  static getExtractionReport(): CustomDataReport | null {
    const reportData = localStorage.getItem('custom_data_report');
    return reportData ? JSON.parse(reportData) : null;
  }

  /**
   * Check if system is in custom-only mode
   */
  static isCustomOnlyMode(): boolean {
    return localStorage.getItem('master_data_mode') === 'custom_only';
  }
}

// Auto-export for global access
if (typeof window !== 'undefined') {
  (window as any).CustomDataExtractor = CustomDataExtractor;
}