
import { LocalStorageManager } from './LocalStorageManager';

interface SessionData {
  seekerOrganizationName: string;
  seekerEntityType: string;
  seekerCountry: string;
  seekerUserId: string;
}

interface RegisteredUser {
  userId: string;
  password: string;
  organizationName: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  industrySegment: string;
  organizationId: string;
  registrationTimestamp?: string;
}

class SessionStorageManager {
  private sessionManager: LocalStorageManager<SessionData>;
  private usersManager: LocalStorageManager<RegisteredUser[]>;

  constructor() {
    this.sessionManager = new LocalStorageManager<SessionData>({
      key: 'seeker_session_data',
      version: 1,
      validateData: (data: any) => {
        return data &&
               typeof data.seekerOrganizationName === 'string' &&
               typeof data.seekerEntityType === 'string' &&
               typeof data.seekerCountry === 'string' &&
               typeof data.seekerUserId === 'string' &&
               data.seekerOrganizationName.length > 0 &&
               data.seekerUserId.length > 0;
      },
      enableBackup: true
    });

    this.usersManager = new LocalStorageManager<RegisteredUser[]>({
      key: 'registered_users',
      version: 1,
      defaultData: [],
      validateData: (data: any) => {
        return Array.isArray(data) && data.every(user => 
          user.userId && user.password && user.organizationName
        );
      },
      enableBackup: true
    });
  }

  saveSession(sessionData: SessionData): boolean {
    console.log('💾 === SESSION SAVE START ===');
    const result = this.sessionManager.save(sessionData);
    
    if (result.success) {
      // Also save individual keys for backward compatibility
      Object.entries(sessionData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      console.log('✅ Session saved successfully');
      console.log('💾 === SESSION SAVE END ===');
      return true;
    } else {
      console.error('❌ Session save failed:', result.error);
      console.log('💾 === SESSION SAVE END ===');
      return false;
    }
  }

  loadSession(): SessionData | null {
    console.log('📤 === SESSION LOAD START ===');
    const result = this.sessionManager.load();
    
    if (result.success && result.data) {
      console.log('✅ Session loaded successfully:', result.data);
      console.log('📤 === SESSION LOAD END ===');
      return result.data;
    }

    // Fallback: try to load from individual keys
    console.log('⚠️ Trying fallback session recovery...');
    const fallbackSession = this.loadSessionFromIndividualKeys();
    
    if (fallbackSession) {
      console.log('✅ Session recovered from individual keys');
      // Save the recovered session for future use
      this.saveSession(fallbackSession);
      console.log('📤 === SESSION LOAD END ===');
      return fallbackSession;
    }

    console.log('❌ No session data found');
    console.log('📤 === SESSION LOAD END ===');
    return null;
  }

  private loadSessionFromIndividualKeys(): SessionData | null {
    const keys = ['seekerOrganizationName', 'seekerEntityType', 'seekerCountry', 'seekerUserId'];
    const sessionData: Partial<SessionData> = {};
    
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (!value) {
        return null;
      }
      sessionData[key as keyof SessionData] = value;
    }
    
    return sessionData as SessionData;
  }

  clearSession(): void {
    console.log('🧹 === SESSION CLEAR START ===');
    
    // Clear managed session data
    this.sessionManager.remove();
    
    // Clear individual keys for backward compatibility
    const keys = ['seekerOrganizationName', 'seekerEntityType', 'seekerCountry', 'seekerUserId'];
    keys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🧹 Cleared ${key}`);
    });
    
    console.log('✅ Session cleared successfully');
    console.log('🧹 === SESSION CLEAR END ===');
  }

  saveUser(user: RegisteredUser): boolean {
    console.log('💾 Attempting to save user via SessionStorageManager:', user.userId);
    
    const usersResult = this.usersManager.load();
    const users = usersResult.success ? usersResult.data! : [];
    
    // Check for duplicate
    const exists = users.find(u => u.userId.toLowerCase() === user.userId.toLowerCase());
    if (exists) {
      console.error('❌ User already exists:', user.userId);
      return false;
    }
    
    users.push(user);
    const saveResult = this.usersManager.save(users);
    
    if (saveResult.success) {
      console.log('✅ User saved successfully via SessionStorageManager:', user.userId);
      return true;
    } else {
      console.error('❌ SessionStorageManager save failed, trying direct localStorage save...');
      
      // Fallback: Direct localStorage save if SessionStorageManager fails
      try {
        localStorage.setItem('registered_users', JSON.stringify(users));
        console.log('✅ User saved successfully via direct localStorage fallback:', user.userId);
        return true;
      } catch (error) {
        console.error('❌ Direct localStorage save also failed:', error);
        return false;
      }
    }
  }

  findUser(userId: string, password: string): RegisteredUser | null {
    console.log('🔍 SessionStorageManager searching for user:', userId);
    
    // Try SessionStorageManager first
    const usersResult = this.usersManager.load();
    if (usersResult.success && usersResult.data) {
      const user = usersResult.data.find(u => 
        u.userId.toLowerCase() === userId.toLowerCase() && u.password === password
      );
      
      if (user) {
        console.log('✅ User found via SessionStorageManager:', user.userId);
        return user;
      }
    } else {
      console.log('⚠️ SessionStorageManager load failed, trying direct localStorage...');
    }
    
    // Fallback: Direct localStorage access
    try {
      const directUsers = localStorage.getItem('registered_users');
      if (directUsers) {
        const users = JSON.parse(directUsers);
        const user = users.find((u: RegisteredUser) => 
          u.userId.toLowerCase() === userId.toLowerCase() && u.password === password
        );
        
        if (user) {
          console.log('✅ User found via direct localStorage fallback:', user.userId);
          return user;
        }
      }
    } catch (error) {
      console.error('❌ Direct localStorage access failed:', error);
    }
    
    console.log('❌ User not found:', userId);
    return null;
  }

  getStorageHealth(): {
    session: any;
    users: any;
    directUsersCount: number;
  } {
    let directUsersCount = 0;
    try {
      const directUsers = localStorage.getItem('registered_users');
      if (directUsers) {
        const users = JSON.parse(directUsers);
        directUsersCount = Array.isArray(users) ? users.length : 0;
      }
    } catch {
      directUsersCount = -1; // Error state
    }
    
    return {
      session: this.sessionManager.getHealth(),
      users: this.usersManager.getHealth(),
      directUsersCount
    };
  }
}

export const sessionStorageManager = new SessionStorageManager();
