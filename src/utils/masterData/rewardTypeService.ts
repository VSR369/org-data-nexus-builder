export interface RewardType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const emergencyFallbackRewardTypes: RewardType[] = [
  {
    id: '1',
    name: 'Recognition Badge',
    description: 'Digital badge for achievements',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Certificate of Excellence',
    description: 'Official certificate for outstanding performance',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class RewardTypeService {
  static getRewardTypes(): RewardType[] {
    console.log('🔍 Getting reward types...');
    
    // CHECK FOR CUSTOM-ONLY MODE FIRST
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    if (isCustomMode) {
      console.log('🎯 Custom-only mode detected, loading custom reward types...');
      const customData = localStorage.getItem('custom_rewardTypes');
      if (customData !== null) {
        try {
          const parsed = JSON.parse(customData);
          if (Array.isArray(parsed)) {
            console.log('✅ Using custom reward types (including empty array):', parsed.length);
            return parsed; // Return even if empty array - this preserves deletions
          }
        } catch (error) {
          console.error('❌ Failed to parse custom reward types data:', error);
        }
      }
      
      // In custom-only mode, don't fall back to defaults if no custom data
      console.log('🚫 Custom-only mode: No custom reward types found, returning empty array');
      return [];
    }
    
    // FALLBACK: Use raw localStorage storage
    const rawData = localStorage.getItem('master_data_non_monetary_reward_types');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        
        // Handle wrapped format (legacy from MasterDataPersistenceManager)
        if (parsed && typeof parsed === 'object' && parsed.data && Array.isArray(parsed.data)) {
          console.log('⚠️ Found wrapped reward types data, unwrapping...');
          const unwrapped = parsed.data;
          // Store in raw format for future use
          localStorage.setItem('master_data_non_monetary_reward_types', JSON.stringify(unwrapped));
          console.log('✅ Unwrapped and stored reward types in raw format');
          return unwrapped;
        }
        
        // Handle raw array format (preferred)
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('✅ Using raw reward types data:', parsed.length);
          return parsed;
        }
        
        console.log('⚠️ Invalid reward types data structure, using fallback');
      } catch (error) {
        console.error('❌ Failed to parse reward types data:', error);
      }
    }

    // Use emergency fallback only in mixed mode
    console.log('📦 Mixed mode: No valid data found, using emergency fallback reward types');
    localStorage.setItem('master_data_non_monetary_reward_types', JSON.stringify(emergencyFallbackRewardTypes));
    return emergencyFallbackRewardTypes;
  }
  
  static saveRewardTypes(rewardTypes: RewardType[]): void {
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    
    if (isCustomMode) {
      console.log('💾 Custom-only mode: Saving reward types to custom_rewardTypes:', rewardTypes.length);
      localStorage.setItem('custom_rewardTypes', JSON.stringify(rewardTypes));
      
      // Validation: Read back to ensure it was saved correctly
      const readBack = localStorage.getItem('custom_rewardTypes');
      if (readBack !== null) {
        try {
          const parsed = JSON.parse(readBack);
          if (Array.isArray(parsed) && parsed.length === rewardTypes.length) {
            console.log('✅ Custom reward types save validated successfully');
          } else {
            console.error('❌ Custom reward types save validation failed - length mismatch');
          }
        } catch (error) {
          console.error('❌ Custom reward types save validation failed - parse error:', error);
        }
      } else {
        console.error('❌ Custom reward types save validation failed - null readback');
      }
    } else {
      console.log('💾 Mixed mode: Saving reward types to master_data_non_monetary_reward_types:', rewardTypes.length);
      localStorage.setItem('master_data_non_monetary_reward_types', JSON.stringify(rewardTypes));
    }
  }
}