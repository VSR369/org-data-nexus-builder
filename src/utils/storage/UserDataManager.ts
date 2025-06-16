
import { IndexedDBService } from './IndexedDBService';

interface UserData {
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
}

interface SessionData {
  seekerOrganizationName: string;
  seekerEntityType: string;
  seekerCountry: string;
  seekerUserId: string;
}

export class UserDataManager {
  private static instance: UserDataManager;
  private userService: IndexedDBService<any>;
  private sessionService: IndexedDBService<any>;

  private constructor() {
    this.userService = new IndexedDBService<any>({
      storeName: 'userProfiles'
    });
    this.sessionService = new IndexedDBService<any>({
      storeName: 'userProfiles'
    });
  }

  static getInstance(): UserDataManager {
    if (!UserDataManager.instance) {
      UserDataManager.instance = new UserDataManager();
    }
    return UserDataManager.instance;
  }

  async saveUser(userData: UserData): Promise<boolean> {
    try {
      console.log('💾 Saving user data to IndexedDB:', userData);
      
      // Validate required fields
      const required = ['userId', 'password', 'organizationName', 'organizationType', 'entityType', 'country', 'email', 'contactPersonName'];
      for (const field of required) {
        if (!userData[field as keyof UserData] || userData[field as keyof UserData].toString().trim() === '') {
          console.log(`❌ Missing required field: ${field}`);
          return false;
        }
      }

      // Save individual user record
      const userRecord = {
        id: userData.userId,
        ...userData,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.userService.put(userRecord);
      
      // Also maintain a users collection for easier querying
      const allUsers = await this.getAllUsers();
      const updatedUsers = allUsers.filter(u => u.userId !== userData.userId);
      updatedUsers.push(userData);
      
      const usersCollectionRecord = {
        id: 'registered_users',
        data: updatedUsers,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.userService.put(usersCollectionRecord);

      console.log('✅ User data saved successfully to IndexedDB');
      return true;
    } catch (error) {
      console.error('❌ Error saving user data to IndexedDB:', error);
      return false;
    }
  }

  async findUser(userId: string, password: string): Promise<UserData | null> {
    try {
      console.log('🔍 Searching for user in IndexedDB:', userId);
      
      // Try to get individual user record first
      try {
        const userRecord = await this.userService.getById(userId);
        if (userRecord && userRecord.password === password) {
          console.log('✅ User found via individual record');
          return userRecord;
        }
      } catch (error) {
        console.log('⚠️ Individual user record not found, checking collection');
      }

      // Fallback to users collection
      const allUsers = await this.getAllUsers();
      const user = allUsers.find(u => 
        u.userId.toLowerCase() === userId.toLowerCase() && u.password === password
      );

      if (user) {
        console.log('✅ User found in IndexedDB collection');
        return user;
      }

      console.log('❌ User not found in IndexedDB');
      return null;
    } catch (error) {
      console.error('❌ Error finding user in IndexedDB:', error);
      return null;
    }
  }

  async getAllUsers(): Promise<UserData[]> {
    try {
      // Try to get from users collection first
      const usersRecord = await this.userService.getById('registered_users');
      if (usersRecord) {
        const users = usersRecord.data || usersRecord;
        if (Array.isArray(users)) {
          console.log(`✅ Retrieved ${users.length} users from collection`);
          return users;
        }
      }

      // Fallback: get all individual user records
      console.log('⚠️ Collection not found, scanning individual records');
      const allRecords = await this.userService.getAll();
      const userRecords = allRecords.filter(record => 
        record.id !== 'registered_users' && 
        record.id !== 'seeker_session_data' &&
        record.userId && 
        record.password
      );

      console.log(`✅ Retrieved ${userRecords.length} users from individual records`);
      return userRecords;
    } catch (error) {
      console.error('❌ Error getting all users from IndexedDB:', error);
      
      // Final fallback: check localStorage
      try {
        const usersData = localStorage.getItem('registered_users');
        if (usersData) {
          const users = JSON.parse(usersData);
          console.log('✅ Fallback: Retrieved users from localStorage');
          return Array.isArray(users) ? users : [];
        }
      } catch (localStorageError) {
        console.error('❌ Error reading from localStorage:', localStorageError);
      }

      return [];
    }
  }

  async saveSession(sessionData: SessionData): Promise<boolean> {
    try {
      console.log('💾 Saving session data to IndexedDB:', sessionData);
      
      const sessionRecord = {
        id: 'seeker_session_data',
        ...sessionData,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.sessionService.put(sessionRecord);

      console.log('✅ Session data saved successfully to IndexedDB');
      return true;
    } catch (error) {
      console.error('❌ Error saving session data to IndexedDB:', error);
      return false;
    }
  }

  async loadSession(): Promise<SessionData | null> {
    try {
      const sessionRecord = await this.sessionService.getById('seeker_session_data');
      if (sessionRecord) {
        const sessionData = sessionRecord.data || sessionRecord;
        console.log('✅ Session loaded from IndexedDB');
        return sessionData;
      }
      return null;
    } catch (error) {
      console.error('❌ Error loading session from IndexedDB:', error);
      return null;
    }
  }

  async clearSession(): Promise<void> {
    try {
      await this.sessionService.delete('seeker_session_data');
      console.log('✅ Session cleared from IndexedDB');
    } catch (error) {
      console.error('❌ Error clearing session from IndexedDB:', error);
    }
  }

  async checkDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
    try {
      // Test basic database operations
      const testRecord = {
        id: 'health_check',
        timestamp: new Date().toISOString()
      };

      await this.userService.put(testRecord);
      const retrieved = await this.userService.getById('health_check');
      await this.userService.delete('health_check');

      if (retrieved) {
        console.log('✅ Database health check passed');
        return { healthy: true };
      } else {
        console.log('❌ Database health check failed: record not retrieved');
        return { healthy: false, error: 'Record not retrieved after save' };
      }
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return { 
        healthy: false, 
        error: error instanceof Error ? error.message : 'Unknown database error' 
      };
    }
  }
}

export const userDataManager = UserDataManager.getInstance();
