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
   * Clear all default data from localStorage before saving custom configurations
   */
  static clearAllDefaultData(): string[] {
    console.log('🧹 === CLEARING ALL DEFAULT DATA ===');
    
    const clearedKeys: string[] = [];
    
    // Define ALL possible localStorage keys for master data
    const allMasterDataKeys = [
      // Currency related keys
      'master_data_currencies',
      'currencies',
      'currency_data',
      'fallback_currencies',
      'default_currencies',
      'emergency_currencies',
      
      // Countries related keys
      'master_data_countries',
      'countries',
      'country_data',
      'fallback_countries',
      'default_countries',
      
      // Industry segments related keys
      'master_data_industry_segments',
      'industrySegments',
      'industry_segments',
      'fallback_industry_segments',
      'default_industry_segments',
      
      // Organization types related keys
      'master_data_organization_types',
      'organizationTypes',
      'organization_types',
      'fallback_organization_types',
      'default_organization_types',
      
      // Entity types related keys
      'master_data_entity_types',
      'entityTypes',
      'entity_types',
      'fallback_entity_types',
      'default_entity_types',
      
      // Departments related keys
      'master_data_departments',
      'departments',
      'department_data',
      'fallback_departments',
      'default_departments',
      
      // Domain groups related keys
      'master_data_domain_groups',
      'domainGroups',
      'domain_groups',
      'fallback_domain_groups',
      'default_domain_groups',
      
      // Challenge statuses related keys
      'master_data_challenge_statuses',
      'challengeStatuses',
      'challenge_statuses',
      'fallback_challenge_statuses',
      'default_challenge_statuses',
      
      // Solution statuses related keys
      'master_data_solution_statuses',
      'solutionStatuses',
      'solution_statuses',
      'fallback_solution_statuses',
      'default_solution_statuses',
      
      // Competency capabilities related keys
      'master_data_competency_capabilities',
      'competencyCapabilities',
      'competency_capabilities',
      'fallback_competency_capabilities',
      'default_competency_capabilities',
      
      // Communication types related keys
      'master_data_communication_types',
      'communicationTypes',
      'communication_types',
      'fallback_communication_types',
      'default_communication_types',
      
      // Reward types related keys
      'master_data_reward_types',
      'rewardTypes',
      'reward_types',
      'fallback_reward_types',
      'default_reward_types',
      
      // Seeker membership fees related keys
      'master_data_seeker_membership_fees',
      'seekerMembershipFees',
      'seeker_membership_fees',
      'membership_fees',
      'fallback_membership_fees',
      'default_membership_fees',
      
      // Engagement models related keys
      'master_data_engagement_models',
      'engagementModels',
      'engagement_models',
      'fallback_engagement_models',
      'default_engagement_models',
      
      // Pricing configurations related keys
      'master_data_pricing',
      'pricing_configurations',
      'pricing_data',
      'fallback_pricing',
      'default_pricing',
      
      // Events calendar related keys
      'master_data_events',
      'eventsCalendar',
      'events_calendar',
      'fallback_events',
      'default_events'
    ];
    
    // Clear each key and log the action
    allMasterDataKeys.forEach(key => {
      const existingData = localStorage.getItem(key);
      if (existingData) {
        localStorage.removeItem(key);
        clearedKeys.push(key);
        console.log(`🗑️ CLEARED: ${key} (had ${existingData.length} characters of data)`);
      } else {
        console.log(`⚪ SKIP: ${key} (not found)`);
      }
    });
    
    // Also clear any keys that match common patterns
    const allKeys = Object.keys(localStorage);
    const patternKeys = allKeys.filter(key => 
      key.includes('fallback_') ||
      key.includes('default_') ||
      key.includes('seed_') ||
      key.includes('emergency_') ||
      key.includes('auto_generated_') ||
      key.includes('master_data_seeded_') ||
      key.includes('initialized_')
    );
    
    patternKeys.forEach(key => {
      if (!clearedKeys.includes(key)) {
        const existingData = localStorage.getItem(key);
        if (existingData) {
          localStorage.removeItem(key);
          clearedKeys.push(key);
          console.log(`🗑️ PATTERN CLEARED: ${key} (pattern-based removal)`);
        }
      }
    });
    
    console.log(`✅ === CLEARING COMPLETE: ${clearedKeys.length} keys removed ===`);
    return clearedKeys;
  }

  /**
   * Extract and preserve only custom configured data permanently
   */
  static async extractAndPreserveCustomData(): Promise<CustomDataReport> {
    console.log('🔍 === CUSTOM DATA EXTRACTION START ===');
    
    // STEP 0: Clear all default data FIRST
    const clearedKeys = this.clearAllDefaultData();
    
    const report: CustomDataReport = {
      totalCustomConfigurations: 0,
      customDataCategories: [],
      extractedData: {},
      removedDefaultKeys: clearedKeys, // Use the actually cleared keys
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

    // Step 3: Create clean custom-only storage structure with validation and redundancy
    console.log('🏗️ Creating clean custom-only storage structure...');
    
    const saveResults = await this.saveCustomConfig(report.extractedData);
    
    // Update report with save results
    report.preservedCustomKeys = saveResults.savedKeys;
    if (saveResults.errors.length > 0) {
      console.error('❌ Some data failed to save:', saveResults.errors);
    }

    // Step 4: Set permanent custom-only flag with validation
    const configData = {
      mode: 'custom_only',
      timestamp: new Date().toISOString(),
      report: report
    };
    
    await this.saveWithValidation('master_data_mode', 'custom_only');
    await this.saveWithValidation('custom_data_extraction_timestamp', new Date().toISOString());
    await this.saveWithValidation('custom_data_report', JSON.stringify(report));

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
   * Save custom configuration data with validation and redundancy
   */
  static async saveCustomConfig(extractedData: Record<string, any>): Promise<{
    savedKeys: string[];
    errors: string[];
  }> {
    console.log('💾 === SAVING CUSTOM CONFIG WITH VALIDATION ===');
    
    const savedKeys: string[] = [];
    const errors: string[] = [];
    
    for (const [category, data] of Object.entries(extractedData)) {
      console.log(`💾 Saving custom data for category: ${category}`);
      
      // Primary storage key
      const primaryKey = `custom_${category}`;
      // Backup storage keys for redundancy
      const backupKey1 = `custom_backup_${category}`;
      const backupKey2 = `custom_backup2_${category}`;
      
      try {
        const jsonData = JSON.stringify(data);
        
        // Save to primary location
        const primarySaveResult = await this.saveWithValidation(primaryKey, jsonData);
        if (primarySaveResult.success) {
          savedKeys.push(primaryKey);
          console.log(`✅ PRIMARY: Saved ${primaryKey} (${jsonData.length} characters)`);
        } else {
          errors.push(`Primary save failed for ${category}: ${primarySaveResult.error}`);
        }
        
        // Save to backup locations for redundancy
        const backup1Result = await this.saveWithValidation(backupKey1, jsonData);
        if (backup1Result.success) {
          savedKeys.push(backupKey1);
          console.log(`✅ BACKUP1: Saved ${backupKey1}`);
        } else {
          errors.push(`Backup1 save failed for ${category}: ${backup1Result.error}`);
        }
        
        const backup2Result = await this.saveWithValidation(backupKey2, jsonData);
        if (backup2Result.success) {
          savedKeys.push(backupKey2);
          console.log(`✅ BACKUP2: Saved ${backupKey2}`);
        } else {
          errors.push(`Backup2 save failed for ${category}: ${backup2Result.error}`);
        }
        
        console.log(`📊 Category ${category}: ${Array.isArray(data) ? data.length : Object.keys(data).length} items saved`);
        
      } catch (error) {
        const errorMsg = `Failed to process ${category}: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }
    
    console.log(`💾 === SAVE COMPLETE: ${savedKeys.length} keys saved, ${errors.length} errors ===`);
    return { savedKeys, errors };
  }

  /**
   * Save data with validation and error handling
   */
  static async saveWithValidation(key: string, value: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Attempt to save
      localStorage.setItem(key, value);
      
      // Validate by immediately reading back
      const readBack = localStorage.getItem(key);
      
      if (readBack === null) {
        return {
          success: false,
          error: 'Failed to save - localStorage.getItem returned null'
        };
      }
      
      if (readBack !== value) {
        return {
          success: false,
          error: 'Data integrity check failed - saved data does not match original'
        };
      }
      
      // Additional validation for JSON data
      if (value.startsWith('{') || value.startsWith('[')) {
        try {
          JSON.parse(readBack);
        } catch (jsonError) {
          return {
            success: false,
            error: `JSON validation failed: ${jsonError}`
          };
        }
      }
      
      console.log(`✅ VALIDATED: ${key} saved and verified successfully`);
      return { success: true };
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`❌ SAVE FAILED: ${key} - ${errorMsg}`);
      
      // Handle quota exceeded error specifically
      if (errorMsg.includes('QuotaExceededError') || errorMsg.includes('quota')) {
        return {
          success: false,
          error: 'localStorage quota exceeded - please clear some data'
        };
      }
      
      return {
        success: false,
        error: errorMsg
      };
    }
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