
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
  private userService: IndexedDBService<UserData>;
  private sessionService: IndexedDBService<SessionData>;

  private constructor() {
    this.userService = new IndexedDBService<UserData>({
      storeName: 'userProfiles'
    });
    this.sessionService = new IndexedDBService<SessionData>({
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

      const userRecord = {
        ...userData,
        id: userData.userId
      };

      await this.userService.put(userRecord as any);
      
      // Also save to users collection for compatibility
      const allUsers = await this.getAllUsers();
      const updatedUsers = allUsers.filter(u => u.userId !== userData.userId);
      updatedUsers.push(userData);
      
      await this.userService.put({
        id: 'registered_users',
        ...updatedUsers
      } as any);

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
      
      const allUsers = await this.getAllUsers();
      const user = allUsers.find(u => 
        u.userId.toLowerCase() === userId.toLowerCase() && u.password === password
      );

      if (user) {
        console.log('✅ User found in IndexedDB');
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
      const usersRecord = await this.userService.getById('registered_users');
      if (usersRecord && Array.isArray((usersRecord as any).data || usersRecord)) {
        return (usersRecord as any).data || usersRecord;
      }
      return [];
    } catch (error) {
      console.error('❌ Error getting all users from IndexedDB:', error);
      return [];
    }
  }

  async saveSession(sessionData: SessionData): Promise<boolean> {
    try {
      console.log('💾 Saving session data to IndexedDB:', sessionData);
      
      await this.sessionService.put({
        id: 'seeker_session_data',
        ...sessionData
      } as any);

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
        const sessionData = (sessionRecord as any).data || sessionRecord;
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

  async migrateFromLocalStorage(): Promise<void> {
    console.log('🔄 Migrating user data from localStorage to IndexedDB...');
    
    try {
      // Migrate registered users
      const usersData = localStorage.getItem('registered_users');
      if (usersData) {
        const users = JSON.parse(usersData);
        await this.userService.put({
          id: 'registered_users',
          data: users,
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as any);
        localStorage.removeItem('registered_users');
        console.log('✅ Migrated registered users');
      }

      // Migrate session data
      const sessionData = localStorage.getItem('seeker_session_data');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        await this.saveSession(session);
        localStorage.removeItem('seeker_session_data');
        console.log('✅ Migrated session data');
      }

    } catch (error) {
      console.error('❌ Error during user data migration:', error);
    }
  }
}

export const userDataManager = UserDataManager.getInstance();
