
import { DomainGroupsData } from '@/types/domainGroups';

export class DomainGroupsMigrationUtils {
  static migrateFromOldKeys(): DomainGroupsData | null {
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

  static getOldKeysToCleanup(): string[] {
    return [
      'domainGroupsData',
      'master_data_domain_groups_hierarchy',
      'domain_groups_data'
    ];
  }
}
