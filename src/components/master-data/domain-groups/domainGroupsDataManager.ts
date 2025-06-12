
import { DomainGroupsData } from '@/types/domainGroups';
import { EnhancedDataManager } from './enhancedDataManager';
import { DomainGroupsMigrationUtils } from './migrationUtils';
import { DomainGroupsRecoveryUtils } from './recoveryUtils';

// Default data structure
const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

// Enhanced domain groups manager with robust persistence
class EnhancedDomainGroupsManager extends EnhancedDataManager<DomainGroupsData> {
  constructor() {
    super({
      key: 'master_data_domain_groups',
      defaultData: defaultDomainGroupsData,
      version: 3 // Increment version for better data handling
    });
  }

  // Override data structure validation
  protected validateDataStructure(data: any): boolean {
    console.log(`🔍 Validating data structure for domain groups:`, data);
    const isValid = data && 
                   typeof data === 'object' && 
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

  // Override cleanup logic
  protected cleanupOldKeys(): void {
    const oldKeys = DomainGroupsMigrationUtils.getOldKeysToCleanup();
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ Cleaning up old key: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }

  // Override content validation
  protected hasValidContent(data: DomainGroupsData): boolean {
    return data && 
           Array.isArray(data.domainGroups) && 
           Array.isArray(data.categories) && 
           Array.isArray(data.subCategories);
  }

  // Enhanced save method with better error handling
  saveData(data: DomainGroupsData): void {
    console.log(`💾 Enhanced saveData called for domain groups:`, data);
    
    // Validate data before saving
    if (!this.validateDataStructure(data)) {
      console.error('❌ Invalid data structure, cannot save:', data);
      throw new Error('Invalid data structure for domain groups');
    }
    
    // Call parent save method
    super.saveData(data);
    console.log(`✅ Domain groups data saved successfully`);
  }

  // Add method to force refresh data
  refreshData(): DomainGroupsData {
    console.log(`🔄 Force refreshing domain groups data...`);
    const data = this.loadData();
    console.log(`✅ Refreshed data contains:`, {
      domainGroups: data.domainGroups.length,
      categories: data.categories.length,
      subCategories: data.subCategories.length
    });
    return data;
  }

  // Add method to get data statistics
  getDataStats(): { domainGroups: number; categories: number; subCategories: number } {
    const data = this.loadData();
    return {
      domainGroups: data.domainGroups.length,
      categories: data.categories.length,
      subCategories: data.subCategories.length
    };
  }
}

// Export singleton instance
export const domainGroupsDataManager = new EnhancedDomainGroupsManager();
