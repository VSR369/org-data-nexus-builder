export class MasterDataAutoInitService {
  private static readonly MASTER_DATA_KEYS = [
    'master_data_currencies',
    'master_data_industry_segments', 
    'master_data_seeker_membership_fees',
    'master_data_pricing_configs',
    'master_data_non_monetary_reward_types',
    'master_data_communication_channels',
    'master_data_entity_types',
    'master_data_organization_types'
  ];

  private static readonly CUSTOM_KEY_MAP = {
    'master_data_currencies': 'custom_currencies',
    'master_data_industry_segments': 'custom_industrySegments', 
    'master_data_seeker_membership_fees': 'custom_seekerMembershipFees',
    'master_data_pricing_configs': 'custom_pricingConfigs',
    'master_data_non_monetary_reward_types': 'custom_rewardTypes',
    'master_data_communication_channels': 'custom_communicationTypes',
    'master_data_entity_types': 'custom_entityTypes',
    'master_data_organization_types': 'custom_organizationTypes'
  };

  static async initialize(): Promise<void> {
    console.log('🚀 Initializing MasterData Auto-Init Service...');
    
    // Check if already in custom mode
    const currentMode = localStorage.getItem('master_data_mode');
    if (currentMode === 'custom_only') {
      console.log('✅ Already in custom-only mode, skipping initialization');
      return;
    }

    let hasExistingData = false;
    const migrationLog: string[] = [];

    // Check each master data key for existing user data
    for (const key of this.MASTER_DATA_KEYS) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          let actualData = parsed;

          // Handle wrapped format
          if (parsed && typeof parsed === 'object' && parsed.data && Array.isArray(parsed.data)) {
            actualData = parsed.data;
          }

          // If we have meaningful data (array with items or non-empty array)
          if (Array.isArray(actualData) && actualData.length > 0) {
            hasExistingData = true;
            const customKey = this.CUSTOM_KEY_MAP[key as keyof typeof this.CUSTOM_KEY_MAP];
            
            // Migrate to custom storage
            localStorage.setItem(customKey, JSON.stringify(actualData));
            migrationLog.push(`✅ Migrated ${key} -> ${customKey} (${actualData.length} items)`);
          }
        } catch (error) {
          console.error(`❌ Failed to parse data for ${key}:`, error);
        }
      }
    }

    // If we found existing data, switch to custom-only mode
    if (hasExistingData) {
      localStorage.setItem('master_data_mode', 'custom_only');
      console.log('🎯 Switched to custom-only mode due to existing data');
      migrationLog.forEach(log => console.log(log));
      
      // Show success message
      console.log('✅ Master data migration completed successfully');
    } else {
      console.log('📭 No existing master data found, staying in mixed mode');
    }
  }

  static validateDataIntegrity(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    const mode = localStorage.getItem('master_data_mode');
    
    if (mode === 'custom_only') {
      // Validate that custom data exists
      Object.values(this.CUSTOM_KEY_MAP).forEach(customKey => {
        const data = localStorage.getItem(customKey);
        if (!data) {
          issues.push(`Missing custom data for ${customKey}`);
        }
      });
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  static resetToDefaults(): void {
    console.log('🔄 Resetting master data to defaults...');
    
    // Clear all master data
    this.MASTER_DATA_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear all custom data
    Object.values(this.CUSTOM_KEY_MAP).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Reset mode
    localStorage.removeItem('master_data_mode');
    
    console.log('✅ Master data reset completed');
  }
}