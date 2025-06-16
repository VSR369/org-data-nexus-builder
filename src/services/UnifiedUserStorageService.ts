
import { indexedDBManager } from '@/utils/storage/IndexedDBManager';
import { UserRegistrationService } from './UserRegistrationService';
import { UserAuthenticationService } from './UserAuthenticationService';
import { SessionStorageService } from './SessionStorageService';
import { UserQueryService } from './UserQueryService';
import { DataMigrationService } from './DataMigrationService';
import { UserRecord, SessionData, StorageHealthCheck } from './types';

export class UnifiedUserStorageService {
  private static instance: UnifiedUserStorageService;
  private registrationService: UserRegistrationService;
  private authService: UserAuthenticationService;
  private sessionService: SessionStorageService;
  private queryService: UserQueryService;
  private migrationService: DataMigrationService;
  private isInitialized = false;

  private constructor() {
    this.registrationService = new UserRegistrationService();
    this.authService = new UserAuthenticationService();
    this.sessionService = new SessionStorageService();
    this.queryService = new UserQueryService();
    this.migrationService = new DataMigrationService();
  }

  static getInstance(): UnifiedUserStorageService {
    if (!UnifiedUserStorageService.instance) {
      UnifiedUserStorageService.instance = new UnifiedUserStorageService();
    }
    return UnifiedUserStorageService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    console.log('🔧 Initializing UnifiedUserStorageService...');
    
    // Ensure IndexedDB is ready
    if (!await indexedDBManager.isInitialized()) {
      await indexedDBManager.initialize();
    }
    
    // Perform data migration if needed
    await this.migrationService.migrateLocalStorageData();
    
    this.isInitialized = true;
    console.log('✅ UnifiedUserStorageService initialized');
  }

  async registerUser(userData: Omit<UserRecord, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string; user?: UserRecord }> {
    await this.initialize();
    const result = await this.registrationService.registerUser(userData);
    
    if (result.success) {
      // Update users collection after successful registration
      await this.queryService.updateUsersCollection();
    }
    
    return result;
  }

  async authenticateUser(userId: string, password: string): Promise<{ success: boolean; user?: UserRecord; error?: string }> {
    await this.initialize();
    return await this.authService.authenticateUser(userId, password);
  }

  async findUserById(userId: string): Promise<UserRecord | null> {
    return await this.queryService.findUserById(userId);
  }

  async getAllUsers(): Promise<UserRecord[]> {
    return await this.queryService.getAllUsers();
  }

  async saveSession(sessionData: SessionData): Promise<boolean> {
    return await this.sessionService.saveSession(sessionData);
  }

  async loadSession(): Promise<SessionData | null> {
    return await this.sessionService.loadSession();
  }

  async clearSession(): Promise<void> {
    await this.sessionService.clearSession();
  }

  async checkStorageHealth(): Promise<StorageHealthCheck> {
    console.log('🔧 === STORAGE HEALTH CHECK START ===');
    
    try {
      let indexedDBWorking = false;
      let localStorageWorking = false;
      let migrationNeeded = false;
      let userCount = 0;
      
      // Test IndexedDB
      try {
        await this.initialize();
        const users = await this.getAllUsers();
        userCount = users.length;
        indexedDBWorking = true;
        console.log('✅ IndexedDB working, users found:', userCount);
      } catch (error) {
        console.error('❌ IndexedDB test failed:', error);
      }
      
      // Test localStorage
      try {
        localStorage.setItem('health_test', 'test');
        const retrieved = localStorage.getItem('health_test');
        localStorage.removeItem('health_test');
        localStorageWorking = retrieved === 'test';
        
        // Check if migration is needed
        const localUsers = localStorage.getItem('registered_users');
        migrationNeeded = !!localUsers && !indexedDBWorking;
        
        console.log('✅ localStorage working:', localStorageWorking);
        console.log('📊 Migration needed:', migrationNeeded);
      } catch (error) {
        console.error('❌ localStorage test failed:', error);
      }
      
      const healthy = indexedDBWorking || localStorageWorking;
      
      console.log('🔧 === STORAGE HEALTH CHECK END ===');
      
      return {
        healthy,
        indexedDBWorking,
        localStorageWorking,
        migrationNeeded,
        userCount
      };
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return {
        healthy: false,
        indexedDBWorking: false,
        localStorageWorking: false,
        migrationNeeded: false,
        userCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const unifiedUserStorageService = UnifiedUserStorageService.getInstance();

// Re-export types for convenience
export type { UserRecord, SessionData, StorageHealthCheck };
