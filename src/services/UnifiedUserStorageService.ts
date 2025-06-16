
import { indexedDBManager } from '@/utils/storage/IndexedDBManager';
import { IndexedDBService } from '@/utils/storage/IndexedDBService';

export interface UserRecord {
  id: string; // This will be the userId
  userId: string;
  password: string;
  organizationName: string;
  organizationType: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  industrySegment: string;
  organizationId: string;
  registrationTimestamp: string;
  lastLoginTimestamp?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface SessionData {
  userId: string;
  organizationName: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  loginTimestamp: string;
}

export interface StorageHealthCheck {
  healthy: boolean;
  indexedDBWorking: boolean;
  localStorageWorking: boolean;
  migrationNeeded: boolean;
  userCount: number;
  error?: string;
}

export class UnifiedUserStorageService {
  private static instance: UnifiedUserStorageService;
  private userService: IndexedDBService<UserRecord>;
  private sessionService: IndexedDBService<any>;
  private isInitialized = false;

  private constructor() {
    this.userService = new IndexedDBService<UserRecord>({
      storeName: 'userProfiles'
    });
    this.sessionService = new IndexedDBService<any>({
      storeName: 'userProfiles'
    });
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
    await this.migrateLocalStorageData();
    
    this.isInitialized = true;
    console.log('✅ UnifiedUserStorageService initialized');
  }

  async registerUser(userData: Omit<UserRecord, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string; user?: UserRecord }> {
    console.log('📝 === USER REGISTRATION START ===');
    console.log('📝 Registering user:', userData.userId);
    
    try {
      await this.initialize();
      
      // Check if user already exists
      const existingUser = await this.findUserById(userData.userId);
      if (existingUser) {
        console.log('❌ User already exists:', userData.userId);
        return {
          success: false,
          error: `User ID "${userData.userId}" already exists. Please choose a different User ID.`
        };
      }
      
      // Create user record
      const userRecord: UserRecord = {
        id: userData.userId, // Use userId as the primary key
        ...userData,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to IndexedDB
      await this.userService.put(userRecord);
      console.log('✅ User saved to IndexedDB:', userRecord.userId);
      
      // Verify the save by immediately retrieving
      const verification = await this.findUserById(userData.userId);
      if (!verification) {
        throw new Error('Failed to verify user save - user not found after registration');
      }
      
      // Also update the users collection for easier querying
      await this.updateUsersCollection();
      
      console.log('✅ Registration completed and verified:', userData.userId);
      console.log('📝 === USER REGISTRATION END ===');
      
      return { success: true, user: userRecord };
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      console.log('📝 === USER REGISTRATION FAILED ===');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown registration error'
      };
    }
  }

  async authenticateUser(userId: string, password: string): Promise<{ success: boolean; user?: UserRecord; error?: string }> {
    console.log('🔐 === USER LOGIN START ===');
    console.log('🔐 Authenticating user:', userId);
    
    try {
      await this.initialize();
      
      // Find user by ID
      const user = await this.findUserById(userId);
      if (!user) {
        console.log('❌ User not found:', userId);
        
        // Check if there are any users at all
        const allUsers = await this.getAllUsers();
        if (allUsers.length === 0) {
          return {
            success: false,
            error: 'No registered users found. Please register first by clicking the "Register here" link below.'
          };
        }
        
        return {
          success: false,
          error: `User ID "${userId}" not found. Please check your User ID or register first.`
        };
      }
      
      // Verify password
      if (user.password !== password) {
        console.log('❌ Invalid password for user:', userId);
        return {
          success: false,
          error: 'User ID exists but password is incorrect. Please check your password.'
        };
      }
      
      // Update last login timestamp
      const updatedUser: UserRecord = {
        ...user,
        lastLoginTimestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await this.userService.put(updatedUser);
      
      console.log('✅ Authentication successful:', userId);
      console.log('🔐 === USER LOGIN END ===');
      
      return { success: true, user: updatedUser };
      
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      console.log('🔐 === USER LOGIN FAILED ===');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown authentication error'
      };
    }
  }

  async findUserById(userId: string): Promise<UserRecord | null> {
    try {
      console.log('🔍 Looking for user:', userId);
      
      // Try direct lookup first
      const user = await this.userService.getById(userId);
      if (user && user.userId) {
        console.log('✅ User found via direct lookup');
        return user;
      }
      
      // Fallback: search through all users
      const allUsers = await this.getAllUsers();
      const foundUser = allUsers.find(u => u.userId.toLowerCase() === userId.toLowerCase());
      
      if (foundUser) {
        console.log('✅ User found via collection search');
        return foundUser;
      }
      
      console.log('❌ User not found:', userId);
      return null;
      
    } catch (error) {
      console.error('❌ Error finding user:', error);
      return null;
    }
  }

  async getAllUsers(): Promise<UserRecord[]> {
    try {
      // Get all user records, filtering out non-user entries
      const allRecords = await this.userService.getAll();
      const userRecords = allRecords.filter(record => 
        record.userId && 
        record.password && 
        record.id !== 'registered_users' && 
        record.id !== 'seeker_session_data'
      );
      
      console.log(`📊 Retrieved ${userRecords.length} users from storage`);
      return userRecords;
      
    } catch (error) {
      console.error('❌ Error getting all users:', error);
      return [];
    }
  }

  async saveSession(sessionData: SessionData): Promise<boolean> {
    try {
      console.log('💾 Saving session data:', sessionData);
      
      const sessionRecord = {
        id: 'seeker_session_data',
        ...sessionData,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await this.sessionService.put(sessionRecord);
      console.log('✅ Session saved successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error saving session:', error);
      return false;
    }
  }

  async loadSession(): Promise<SessionData | null> {
    try {
      const sessionRecord = await this.sessionService.getById('seeker_session_data');
      if (sessionRecord) {
        console.log('✅ Session loaded from storage');
        return sessionRecord;
      }
      return null;
    } catch (error) {
      console.error('❌ Error loading session:', error);
      return null;
    }
  }

  async clearSession(): Promise<void> {
    try {
      await this.sessionService.delete('seeker_session_data');
      console.log('✅ Session cleared');
    } catch (error) {
      console.error('❌ Error clearing session:', error);
    }
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

  private async migrateLocalStorageData(): Promise<void> {
    console.log('🔄 === MIGRATION CHECK START ===');
    
    try {
      // Check if migration has already been completed
      const migrationFlag = localStorage.getItem('unified_storage_migration_complete');
      if (migrationFlag === 'true') {
        console.log('✅ Migration already completed');
        return;
      }
      
      // Check for localStorage data to migrate
      const localUsers = localStorage.getItem('registered_users');
      if (!localUsers) {
        console.log('📊 No localStorage users to migrate');
        localStorage.setItem('unified_storage_migration_complete', 'true');
        return;
      }
      
      const users = JSON.parse(localUsers);
      if (!Array.isArray(users) || users.length === 0) {
        console.log('📊 No valid users in localStorage');
        localStorage.setItem('unified_storage_migration_complete', 'true');
        return;
      }
      
      console.log(`🔄 Migrating ${users.length} users from localStorage...`);
      
      // Migrate each user
      for (const user of users) {
        try {
          const userRecord: UserRecord = {
            id: user.userId,
            userId: user.userId,
            password: user.password,
            organizationName: user.organizationName,
            organizationType: user.organizationType || user.organizationType,
            entityType: user.entityType,
            country: user.country,
            email: user.email,
            contactPersonName: user.contactPersonName,
            industrySegment: user.industrySegment || '',
            organizationId: user.organizationId || `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            registrationTimestamp: user.registrationTimestamp || new Date().toISOString(),
            version: 1,
            createdAt: user.registrationTimestamp || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          await this.userService.put(userRecord);
          console.log(`✅ Migrated user: ${user.userId}`);
          
        } catch (error) {
          console.error(`❌ Failed to migrate user ${user.userId}:`, error);
        }
      }
      
      // Update users collection
      await this.updateUsersCollection();
      
      // Mark migration as complete
      localStorage.setItem('unified_storage_migration_complete', 'true');
      
      console.log('✅ Migration completed successfully');
      console.log('🔄 === MIGRATION END ===');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
    }
  }

  private async updateUsersCollection(): Promise<void> {
    try {
      const allUsers = await this.getAllUsers();
      const usersCollectionRecord = {
        id: 'registered_users',
        data: allUsers,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await this.userService.put(usersCollectionRecord);
      console.log('✅ Users collection updated');
      
    } catch (error) {
      console.error('❌ Error updating users collection:', error);
    }
  }
}

export const unifiedUserStorageService = UnifiedUserStorageService.getInstance();
