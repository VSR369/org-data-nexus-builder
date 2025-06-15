
interface MasterDataItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isUserCreated: boolean;
}

interface StorageConfig {
  key: string;
  version: number;
  preserveUserData: boolean;
}

export class MasterDataPersistenceManager {
  private static readonly USER_DATA_PREFIX = 'user_created_';
  private static readonly BACKUP_PREFIX = 'backup_';
  
  static saveUserData<T extends MasterDataItem[]>(
    config: StorageConfig, 
    data: T, 
    userId?: string
  ): void {
    console.log(`💾 Saving user data for ${config.key}:`, data.length, 'items');
    
    try {
      // Mark all items as user-created
      const userMarkedData = data.map(item => ({
        ...item,
        isUserCreated: true,
        updatedAt: new Date().toISOString(),
        createdBy: userId || 'unknown'
      }));

      const storageData = {
        data: userMarkedData,
        version: config.version,
        timestamp: new Date().toISOString(),
        isUserData: true
      };

      // Primary storage
      localStorage.setItem(config.key, JSON.stringify(storageData));
      
      // Backup storage
      localStorage.setItem(
        this.BACKUP_PREFIX + config.key, 
        JSON.stringify(storageData)
      );
      
      // User data flag
      localStorage.setItem(
        this.USER_DATA_PREFIX + config.key, 
        'true'
      );

      console.log(`✅ User data saved successfully for ${config.key}`);
    } catch (error) {
      console.error(`❌ Failed to save user data for ${config.key}:`, error);
      throw error;
    }
  }

  static loadUserData<T extends MasterDataItem[]>(
    config: StorageConfig
  ): T | null {
    console.log(`🔍 Loading user data for ${config.key}...`);
    
    try {
      // Check if user data exists
      const hasUserData = localStorage.getItem(this.USER_DATA_PREFIX + config.key);
      if (!hasUserData) {
        console.log(`📭 No user data found for ${config.key}`);
        return null;
      }

      // Try primary storage first
      let stored = localStorage.getItem(config.key);
      
      // Try backup if primary fails
      if (!stored) {
        console.log(`⚠️ Primary storage empty, trying backup for ${config.key}`);
        stored = localStorage.getItem(this.BACKUP_PREFIX + config.key);
      }

      if (!stored) {
        console.log(`❌ No stored data found for ${config.key}`);
        return null;
      }

      const parsedData = JSON.parse(stored);
      
      // Validate data structure
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        console.log(`❌ Invalid data structure for ${config.key}`);
        return null;
      }

      // Version check
      if (parsedData.version !== config.version) {
        console.log(`⚠️ Version mismatch for ${config.key}: stored=${parsedData.version}, expected=${config.version}`);
        // For user data, we preserve it even with version mismatch
      }

      console.log(`✅ Loaded ${parsedData.data.length} user items for ${config.key}`);
      return parsedData.data as T;
      
    } catch (error) {
      console.error(`❌ Failed to load user data for ${config.key}:`, error);
      return null;
    }
  }

  static hasUserData(config: StorageConfig): boolean {
    const hasFlag = localStorage.getItem(this.USER_DATA_PREFIX + config.key);
    const hasData = localStorage.getItem(config.key);
    return !!(hasFlag && hasData);
  }

  static clearUserData(config: StorageConfig): void {
    console.log(`🗑️ Clearing user data for ${config.key}`);
    localStorage.removeItem(config.key);
    localStorage.removeItem(this.BACKUP_PREFIX + config.key);
    localStorage.removeItem(this.USER_DATA_PREFIX + config.key);
  }

  static validateDataIntegrity<T extends MasterDataItem[]>(
    config: StorageConfig
  ): { isValid: boolean; issues: string[]; hasUserData: boolean } {
    const issues: string[] = [];
    const hasUserData = this.hasUserData(config);
    
    if (!hasUserData) {
      return { isValid: false, issues: ['No user data found'], hasUserData: false };
    }

    try {
      const data = this.loadUserData<T>(config);
      if (!data) {
        issues.push('Failed to load user data');
      } else if (data.length === 0) {
        issues.push('User data is empty');
      } else {
        // Validate each item
        data.forEach((item, index) => {
          if (!item.id) issues.push(`Item ${index} missing ID`);
          if (!item.isUserCreated) issues.push(`Item ${index} not marked as user-created`);
        });
      }
    } catch (error) {
      issues.push(`Data corruption: ${error}`);
    }

    return {
      isValid: issues.length === 0,
      issues,
      hasUserData: true
    };
  }
}
