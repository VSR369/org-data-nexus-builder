
import { DataManager } from '@/utils/dataManager';
import { DomainGroupsData } from '@/types/domainGroups';

// Default data
const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

// Enhanced data manager with better persistence
class EnhancedDomainGroupsManager extends DataManager<DomainGroupsData> {
  constructor() {
    super({
      key: 'master_data_domain_groups',
      defaultData: defaultDomainGroupsData,
      version: 1 // Fixed stable version
    });
  }

  // Override loadData to be more forgiving and persistent
  loadData(): DomainGroupsData {
    console.log('=== Enhanced DomainGroupsManager.loadData() START ===');
    
    try {
      // First try to load from the main key
      const stored = localStorage.getItem(this.config.key);
      console.log('📦 Raw stored data:', stored);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('✅ Successfully loaded domain groups data:', parsed);
        
        // Validate the structure
        if (parsed && typeof parsed === 'object' && 
            Array.isArray(parsed.domainGroups) && 
            Array.isArray(parsed.categories) && 
            Array.isArray(parsed.subCategories)) {
          
          // Mark as initialized without version checking to prevent clearing
          this.markAsInitialized();
          
          console.log('=== Enhanced DomainGroupsManager.loadData() END - Success ===');
          return parsed;
        }
      }

      // If no valid data, try to migrate from old keys
      const migrated = this.migrateFromOldKeys();
      if (migrated) {
        console.log('✅ Migrated data from old keys:', migrated);
        this.saveData(migrated);
        return migrated;
      }

      // Only use defaults if absolutely no data exists
      console.log('⚠️ No data found, using defaults');
      this.markAsInitialized();
      console.log('=== Enhanced DomainGroupsManager.loadData() END - Defaults ===');
      return this.config.defaultData;
      
    } catch (error) {
      console.error('❌ Error loading domain groups data:', error);
      // Don't clear on error, try to recover
      const recovered = this.tryRecovery();
      return recovered || this.config.defaultData;
    }
  }

  private migrateFromOldKeys(): DomainGroupsData | null {
    console.log('🔄 Attempting migration from old keys...');
    
    // Try various old key combinations
    const oldKeys = [
      'domainGroupsData',
      'master_data_domain_groups_hierarchy',
      'domain_groups_data'
    ];

    for (const key of oldKeys) {
      try {
        const oldData = localStorage.getItem(key);
        if (oldData) {
          const parsed = JSON.parse(oldData);
          console.log(`📦 Found data in old key ${key}:`, parsed);
          
          // Handle different old data formats
          if (Array.isArray(parsed)) {
            // Old format was just an array of domain groups
            return {
              domainGroups: parsed,
              categories: [],
              subCategories: []
            };
          } else if (parsed && typeof parsed === 'object') {
            // New format
            return {
              domainGroups: parsed.domainGroups || [],
              categories: parsed.categories || [],
              subCategories: parsed.subCategories || []
            };
          }
        }
      } catch (error) {
        console.log(`❌ Error migrating from ${key}:`, error);
      }
    }
    
    return null;
  }

  private tryRecovery(): DomainGroupsData | null {
    console.log('🔧 Attempting data recovery...');
    
    // Try to recover from any remaining localStorage data
    const allKeys = Object.keys(localStorage);
    const domainKeys = allKeys.filter(key => 
      key.includes('domain') || key.includes('Domain') || 
      key.includes('hierarchy') || key.includes('life_sciences')
    );

    for (const key of domainKeys) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed && (Array.isArray(parsed) || (parsed.domainGroups && Array.isArray(parsed.domainGroups)))) {
            console.log(`🔧 Recovered data from ${key}:`, parsed);
            return Array.isArray(parsed) ? { domainGroups: parsed, categories: [], subCategories: [] } : parsed;
          }
        }
      } catch (error) {
        // Skip invalid data
      }
    }
    
    return null;
  }

  private markAsInitialized(): void {
    const initKey = `${this.config.key}_initialized`;
    const versionKey = `${this.config.key}_version`;
    localStorage.setItem(initKey, 'true');
    localStorage.setItem(versionKey, this.config.version.toString());
  }

  // Enhanced save that also cleans up old keys
  saveData(data: DomainGroupsData): void {
    try {
      console.log('=== Enhanced DomainGroupsManager.saveData() START ===');
      console.log('💾 Saving data:', data);
      
      const jsonString = JSON.stringify(data);
      localStorage.setItem(this.config.key, jsonString);
      this.markAsInitialized();
      
      // Clean up old keys to prevent confusion
      const oldKeys = [
        'domainGroupsData',
        'master_data_domain_groups_hierarchy',
        'domain_groups_data'
      ];
      
      oldKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          console.log(`🗑️ Cleaning up old key: ${key}`);
          localStorage.removeItem(key);
        }
      });
      
      console.log('✅ Enhanced save completed successfully');
      console.log('=== Enhanced DomainGroupsManager.saveData() END ===');
    } catch (error) {
      console.error('❌ Error saving domain groups data:', error);
    }
  }

  // Method to check if data exists without clearing it
  hasData(): boolean {
    try {
      const stored = localStorage.getItem(this.config.key);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed && parsed.domainGroups && parsed.domainGroups.length > 0;
      }
      
      // Check old keys too
      const migrated = this.migrateFromOldKeys();
      return migrated && migrated.domainGroups && migrated.domainGroups.length > 0;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const domainGroupsDataManager = new EnhancedDomainGroupsManager();
