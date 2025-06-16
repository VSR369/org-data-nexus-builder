
import { indexedDBManager } from './IndexedDBManager';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';

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

      // Initialize unified user storage service (includes migration)
      await unifiedUserStorageService.initialize();
      console.log('✅ Unified user storage initialization complete');

      // Check for existing data
      const hasExistingData = await this.checkForExistingData();
      console.log(`📊 Existing data found: ${hasExistingData}`);

      // Verify storage health
      const healthCheck = await unifiedUserStorageService.checkStorageHealth();
      if (!healthCheck.healthy) {
        throw new Error(`Storage health check failed: ${healthCheck.error || 'Unknown storage error'}`);
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
      // Check for user data using unified service
      const users = await unifiedUserStorageService.getAllUsers();
      if (users.length > 0) {
        console.log(`📊 Found ${users.length} registered users`);
        return true;
      }

      // Check for session data
      const session = await unifiedUserStorageService.loadSession();
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
