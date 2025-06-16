
import { indexedDBManager } from './IndexedDBManager';

export interface InitializationResult {
  success: boolean;
  error?: string;
  hasExistingData: boolean;
}

export class AppInitializationService {
  private static instance: AppInitializationService;
  private isInitialized = false;
  private initializationPromise: Promise<InitializationResult> | null = null;

  static getInstance(): AppInitializationService {
    if (!AppInitializationService.instance) {
      AppInitializationService.instance = new AppInitializationService();
    }
    return AppInitializationService.instance;
  }

  async initialize(): Promise<InitializationResult> {
    // Return existing promise if initialization is already in progress
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Return success if already initialized
    if (this.isInitialized) {
      return { success: true, hasExistingData: await this.checkForExistingData() };
    }

    console.log('🚀 === APP INITIALIZATION START ===');

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  private async performInitialization(): Promise<InitializationResult> {
    try {
      // Initialize IndexedDB
      await indexedDBManager.initialize();
      console.log('✅ IndexedDB initialization complete');

      // Check for existing data
      const hasExistingData = await this.checkForExistingData();
      console.log(`📊 Existing data found: ${hasExistingData}`);

      this.isInitialized = true;
      console.log('🚀 === APP INITIALIZATION COMPLETE ===');

      return {
        success: true,
        hasExistingData
      };

    } catch (error) {
      console.error('❌ App initialization failed:', error);
      console.log('🚀 === APP INITIALIZATION FAILED ===');

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown initialization error',
        hasExistingData: false
      };
    }
  }

  private async checkForExistingData(): Promise<boolean> {
    try {
      const db = indexedDBManager.getDatabase();
      const stores = ['masterData', 'userProfiles', 'membershipData'];
      
      for (const storeName of stores) {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const count = await new Promise<number>((resolve, reject) => {
          const request = store.count();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        
        if (count > 0) {
          console.log(`📊 Found ${count} items in ${storeName}`);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error checking for existing data:', error);
      return false;
    }
  }

  async migrateFromLocalStorage(): Promise<void> {
    console.log('🔄 === LOCALSTORAGE MIGRATION START ===');
    
    try {
      // Get all localStorage keys that need migration
      const keysToMigrate = [
        'master_data_countries',
        'master_data_organization_types',
        'master_data_industry_segments',
        'master_data_entity_types',
        'registered_users',
        'seeker_session_data',
        'seeker_membership_data'
      ];

      let migratedCount = 0;

      for (const key of keysToMigrate) {
        const localStorageData = localStorage.getItem(key);
        if (localStorageData) {
          try {
            const parsedData = JSON.parse(localStorageData);
            console.log(`📦 Migrating ${key}:`, parsedData);
            
            // Store in IndexedDB with proper structure
            const migrationData = {
              id: key,
              data: parsedData,
              version: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              migratedFrom: 'localStorage'
            };

            const db = indexedDBManager.getDatabase();
            const transaction = db.transaction(['masterData'], 'readwrite');
            const store = transaction.objectStore('masterData');
            
            await new Promise<void>((resolve, reject) => {
              const request = store.put(migrationData);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });

            migratedCount++;
            console.log(`✅ Migrated ${key} successfully`);
            
          } catch (error) {
            console.error(`❌ Failed to migrate ${key}:`, error);
          }
        }
      }

      console.log(`🔄 Migration complete: ${migratedCount} items migrated`);
      console.log('🔄 === LOCALSTORAGE MIGRATION END ===');

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  getInitializationStatus(): boolean {
    return this.isInitialized;
  }

  async reset(): Promise<void> {
    console.log('🔄 Resetting app initialization...');
    await indexedDBManager.clearAllData();
    this.isInitialized = false;
    this.initializationPromise = null;
    console.log('✅ App reset complete');
  }
}

export const appInitializationService = AppInitializationService.getInstance();
