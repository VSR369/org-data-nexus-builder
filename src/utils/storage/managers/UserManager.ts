
import { LocalStorageManager } from '../LocalStorageManager';

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

export class UserManager {
  private usersManager: LocalStorageManager<RegisteredUser[]>;

  constructor() {
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

  saveUser(user: RegisteredUser): boolean {
    console.log('💾 Attempting to save user via UserManager:', user.userId);
    console.log('📊 SIGNUP - User data being saved:', JSON.stringify(user, null, 2));
    
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
      console.log('✅ User saved successfully via UserManager:', user.userId);
      console.log('📊 SIGNUP - Final users array saved to localStorage:', JSON.stringify(users, null, 2));
      return true;
    } else {
      console.error('❌ UserManager save failed, trying direct localStorage save...');
      
      // Fallback: Direct localStorage save if UserManager fails
      try {
        console.log('📊 SIGNUP - Saving directly to localStorage with key "registered_users"');
        console.log('📊 SIGNUP - Data being saved:', JSON.stringify(users, null, 2));
        localStorage.setItem('registered_users', JSON.stringify(users));
        console.log('✅ User saved successfully via direct localStorage fallback:', user.userId);
        
        // Verify the save
        const verification = localStorage.getItem('registered_users');
        console.log('📊 SIGNUP - Verification read from localStorage:', verification);
        return true;
      } catch (error) {
        console.error('❌ Direct localStorage save also failed:', error);
        return false;
      }
    }
  }

  findUser(userId: string, password: string): RegisteredUser | null {
    console.log('🔍 UserManager searching for user:', userId);
    console.log('📊 LOGIN - Attempting to find user with ID:', userId);
    
    // Try UserManager first
    const usersResult = this.usersManager.load();
    if (usersResult.success && usersResult.data) {
      console.log('📊 LOGIN - UserManager loaded data successfully');
      const user = usersResult.data.find(u => 
        u.userId.toLowerCase() === userId.toLowerCase() && u.password === password
      );
      
      if (user) {
        console.log('✅ User found via UserManager:', user.userId);
        console.log('📊 LOGIN - Retrieved user data:', JSON.stringify(user, null, 2));
        return user;
      }
    } else {
      console.log('⚠️ UserManager load failed, trying direct localStorage...');
    }
    
    // Fallback: Direct localStorage access
    try {
      console.log('📊 LOGIN - Calling localStorage.getItem("registered_users")');
      const directUsers = localStorage.getItem('registered_users');
      console.log('📊 LOGIN - Raw localStorage data:', directUsers);
      
      if (directUsers) {
        const users = JSON.parse(directUsers);
        console.log('📊 LOGIN - Parsed users array:', JSON.stringify(users, null, 2));
        console.log('📊 LOGIN - Total users in localStorage:', users.length);
        
        const user = users.find((u: RegisteredUser) => 
          u.userId.toLowerCase() === userId.toLowerCase() && u.password === password
        );
        
        if (user) {
          console.log('✅ User found via direct localStorage fallback:', user.userId);
          console.log('📊 LOGIN - Found user details:', JSON.stringify(user, null, 2));
          return user;
        } else {
          console.log('❌ LOGIN - User not found in users array');
          console.log('📊 LOGIN - Available userIds in localStorage:', users.map((u: any) => u.userId));
        }
      } else {
        console.log('📊 LOGIN - No data found in localStorage with key "registered_users"');
      }
    } catch (error) {
      console.error('❌ Direct localStorage access failed:', error);
    }
    
    console.log('❌ User not found:', userId);
    return null;
  }

  getUsersHealth(): any {
    return this.usersManager.getHealth();
  }

  getDirectUsersCount(): number {
    try {
      const directUsers = localStorage.getItem('registered_users');
      if (directUsers) {
        const users = JSON.parse(directUsers);
        return Array.isArray(users) ? users.length : 0;
      }
      return 0;
    } catch {
      return -1; // Error state
    }
  }
}
