
import { indexedDBManager } from './IndexedDBManager';
import { DataManager } from '../core/DataManager';

export class MigrationService {
  private static instance: MigrationService;
  private migrationStatus = new Map<string, boolean>();

  static getInstance(): MigrationService {
    if (!MigrationService.instance) {
      MigrationService.instance = new MigrationService();
    }
    return MigrationService.instance;
  }

  async migrateAllLocalStorageData(): Promise<void> {
    console.log('🔄 === FULL MIGRATION START ===');
    
    try {
      // Ensure IndexedDB is initialized
      if (!await indexedDBManager.isInitialized()) {
        await indexedDBManager.initialize();
      }

      // Define all known localStorage keys to migrate
      const keysToMigrate = [
        'master_data_countries',
        'master_data_organization_types',
        'master_data_entity_types',
        'master_data_industry_segments',
        'master_data_domain_groups_hierarchy',
        'master_data_capability_levels',
        'engagement_models',
        'pricing_configurations',
        'registered_users',
        'seeker_session_data',
        'seeker_membership_data',
        'solution-provider-enrollment-draft',
        'enrolled-providers'
      ];

      let migratedCount = 0;
      const db = indexedDBManager.getDatabase();

      for (const key of keysToMigrate) {
        if (!this.migrationStatus.get(key)) {
          const success = await this.migrateKey(key, db);
          if (success) {
            migratedCount++;
            this.migrationStatus.set(key, true);
          }
        }
      }

      // Mark migration as complete
      localStorage.setItem('indexeddb_migration_complete', 'true');
      
      console.log(`✅ Migration complete: ${migratedCount} keys migrated`);
      console.log('🔄 === FULL MIGRATION END ===');

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  private async migrateKey(key: string, db: IDBDatabase): Promise<boolean> {
    try {
      const localStorageData = localStorage.getItem(key);
      if (!localStorageData) {
        return false;
      }

      const parsedData = JSON.parse(localStorageData);
      console.log(`📦 Migrating ${key}:`, parsedData);

      // Determine the appropriate store
      const storeName = this.getStoreForKey(key);
      
      const migrationData = {
        id: key,
        data: parsedData,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        migratedFrom: 'localStorage'
      };

      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(migrationData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log(`✅ Migrated ${key} successfully`);
      
      // Clean up localStorage after successful migration
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_version`);
      localStorage.removeItem(`${key}_initialized`);
      localStorage.removeItem(`${key}_backup`);
      localStorage.removeItem(`${key}_integrity`);

      return true;
    } catch (error) {
      console.error(`❌ Failed to migrate ${key}:`, error);
      return false;
    }
  }

  private getStoreForKey(key: string): string {
    if (key.includes('user') || key.includes('seeker_session') || key.includes('enrollment')) {
      return 'userProfiles';
    }
    if (key.includes('membership')) {
      return 'membershipData';
    }
    if (key.includes('competency')) {
      return 'competencyData';
    }
    if (key.includes('pricing')) {
      return 'pricingConfigs';
    }
    return 'masterData';
  }

  isMigrationComplete(): boolean {
    return localStorage.getItem('indexeddb_migration_complete') === 'true';
  }

  async forceMigration(): Promise<void> {
    localStorage.removeItem('indexeddb_migration_complete');
    this.migrationStatus.clear();
    await this.migrateAllLocalStorageData();
  }
}

export const migrationService = MigrationService.getInstance();
