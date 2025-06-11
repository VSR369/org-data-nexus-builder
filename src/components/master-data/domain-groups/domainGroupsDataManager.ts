
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
      version: 1 // Stable version to prevent clearing
    });
  }

  // Override data structure validation for domain groups
  protected validateDataStructure(data: any): boolean {
    return data && typeof data === 'object' && 
           Array.isArray(data.domainGroups) && 
           Array.isArray(data.categories) && 
           Array.isArray(data.subCategories);
  }

  // Override migration logic
  protected migrateFromOldKeys(): DomainGroupsData | null {
    return DomainGroupsMigrationUtils.migrateFromOldKeys();
  }

  // Override recovery logic
  protected tryRecovery(): DomainGroupsData | null {
    return DomainGroupsRecoveryUtils.tryRecovery();
  }

  // Override cleanup logic - only clean specific old keys
  protected cleanupOldKeys(): void {
    const oldKeys = [
      'domainGroupsData', // Old key that might conflict
      'domain_groups_data' // Another old key
    ];
    
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ Cleaning up old key: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }

  // Override content validation
  protected hasValidContent(data: DomainGroupsData): boolean {
    return data && data.domainGroups && data.domainGroups.length > 0;
  }
}

// Export singleton instance
export const domainGroupsDataManager = new EnhancedDomainGroupsManager();
