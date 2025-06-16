
import { indexedDBManager } from './IndexedDBManager';
import { userDataManager } from './UserDataManager';

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

      // Check for localStorage data to migrate
      await this.migrateFromLocalStorageIfNeeded();

      // Check for existing data
      const hasExistingData = await this.checkForExistingData();
      console.log(`📊 Existing data found: ${hasExistingData}`);

      // Verify database health
      const healthCheck = await userDataManager.checkDatabaseHealth();
      if (!healthCheck.healthy) {
        throw new Error(`Database health check failed: ${healthCheck.error}`);
      }

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
      // Check for user data
      const users = await userDataManager.getAllUsers();
      if (users.length > 0) {
        console.log(`📊 Found ${users.length} registered users`);
        return true;
      }

      // Check for session data
      const session = await userDataManager.loadSession();
      if (session) {
        console.log('📊 Found session data');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error checking for existing data:', error);
      return false;
    }
  }

  private async migrateFromLocalStorageIfNeeded(): Promise<void> {
    console.log('🔄 === LOCALSTORAGE MIGRATION CHECK START ===');
    
    try {
      // Check if we have localStorage data to migrate
      const localStorageKeys = [
        'registered_users',
        'seeker_session_data'
      ];

      let hasMigrationData = false;
      for (const key of localStorageKeys) {
        if (localStorage.getItem(key)) {
          hasMigrationData = true;
          break;
        }
      }

      if (!hasMigrationData) {
        console.log('⚠️ No localStorage data found to migrate');
        return;
      }

      console.log('🔄 Starting localStorage migration...');

      // Migrate registered users
      const usersData = localStorage.getItem('registered_users');
      if (usersData) {
        try {
          const users = JSON.parse(usersData);
          if (Array.isArray(users) && users.length > 0) {
            console.log(`📦 Migrating ${users.length} users from localStorage`);
            
            // Save each user individually and as a collection
            for (const user of users) {
              await userDataManager.saveUser({
                ...user,
                registrationTimestamp: user.registrationTimestamp || new Date().toISOString()
              });
            }
            
            console.log('✅ Users migrated successfully');
            localStorage.removeItem('registered_users');
          }
        } catch (error) {
          console.error('❌ Error migrating users:', error);
        }
      }

      // Migrate session data
      const sessionData = localStorage.getItem('seeker_session_data');
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          console.log('📦 Migrating session data from localStorage');
          await userDataManager.saveSession(session);
          localStorage.removeItem('seeker_session_data');
          console.log('✅ Session data migrated successfully');
        } catch (error) {
          console.error('❌ Error migrating session data:', error);
        }
      }

      console.log('🔄 === LOCALSTORAGE MIGRATION COMPLETE ===');

    } catch (error) {
      console.error('❌ Migration failed:', error);
      // Don't throw error here, continue with initialization
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
