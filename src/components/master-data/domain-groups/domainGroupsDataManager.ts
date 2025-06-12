
import { DomainGroupsData } from '@/types/domainGroups';
import { EnhancedDataManager } from './enhancedDataManager';
import { DomainGroupsMigrationUtils } from './migrationUtils';
import { DomainGroupsRecoveryUtils } from './recoveryUtils';

// Default data
const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

// Enhanced domain groups manager with better persistence
class EnhancedDomainGroupsManager extends EnhancedDataManager<DomainGroupsData> {
  constructor() {
    super({
      key: 'master_data_domain_groups',
      defaultData: defaultDomainGroupsData,
      version: 2 // Increment version to trigger proper migration
    });
  }

  // Override data structure validation for domain groups
  protected validateDataStructure(data: any): boolean {
    console.log(`🔍 Validating data structure for domain groups:`, data);
    const isValid = data && typeof data === 'object' && 
           Array.isArray(data.domainGroups) && 
           Array.isArray(data.categories) && 
           Array.isArray(data.subCategories);
    console.log(`✅ Validation result: ${isValid}`);
    return isValid;
  }

  // Override migration logic
  protected migrateFromOldKeys(): DomainGroupsData | null {
    console.log(`🔄 Attempting migration from old keys...`);
    return DomainGroupsMigrationUtils.migrateFromOldKeys();
  }

  // Override recovery logic
  protected tryRecovery(): DomainGroupsData | null {
    console.log(`🔄 Attempting data recovery...`);
    return DomainGroupsRecoveryUtils.tryRecovery();
  }

  // Override cleanup logic - only clean specific old keys
  protected cleanupOldKeys(): void {
    const oldKeys = DomainGroupsMigrationUtils.getOldKeysToCleanup();
    
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ Cleaning up old key: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }

  // Override content validation - even empty arrays are valid user data
  protected hasValidContent(data: DomainGroupsData): boolean {
    // Empty arrays are valid - user might have cleared all data intentionally
    return data && 
           Array.isArray(data.domainGroups) && 
           Array.isArray(data.categories) && 
           Array.isArray(data.subCategories);
  }

  // Add method to force refresh data
  refreshData(): DomainGroupsData {
    console.log(`🔄 Force refreshing domain groups data...`);
    const data = this.loadData();
    console.log(`✅ Refreshed data:`, data);
    return data;
  }
}

// Export singleton instance
export const domainGroupsDataManager = new EnhancedDomainGroupsManager();
