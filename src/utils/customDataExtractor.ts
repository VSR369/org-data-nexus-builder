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

    // For arrays
    if (Array.isArray(data)) {
      return data.some(item => 
        typeof item === 'object' && 
        customIndicators.some(indicator => 
          item.hasOwnProperty(indicator) || 
          JSON.stringify(item).includes(indicator)
        )
      ) || data.length > this.getDefaultDataSize(category);
    }

    // For objects
    if (typeof data === 'object') {
      const dataString = JSON.stringify(data);
      return customIndicators.some(indicator => 
        data.hasOwnProperty(indicator) || 
        dataString.includes(indicator)
      ) || Object.keys(data).length > this.getDefaultDataSize(category);
    }

    return false;
  }

  /**
   * Get expected default data size for each category
   */
  private static getDefaultDataSize(category: string): number {
    const defaultSizes: Record<string, number> = {
      'countries': 10,
      'currencies': 5,
      'industrySegments': 8,
      'organizationTypes': 5,
      'entityTypes': 4,
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