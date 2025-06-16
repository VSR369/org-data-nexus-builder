
import { userDataManager } from './storage/UserDataManager';

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

export async function findRegisteredUser(userId: string, password: string): Promise<RegisteredUser | null> {
  console.log('🔍 === USER SEARCH START ===');
  console.log('🔍 Searching for userId:', userId);
  
  try {
    // Search in IndexedDB first
    const user = await userDataManager.findUser(userId, password);
    
    if (user) {
      console.log('✅ User found via IndexedDB');
      console.log('🔍 === USER SEARCH END ===');
      return user;
    }
    
    console.log('❌ User not found in IndexedDB');
    console.log('🔍 === USER SEARCH END ===');
    return null;
    
  } catch (error) {
    console.error('❌ Error during user search:', error);
    console.log('🔍 === USER SEARCH END ===');
    return null;
  }
}

export async function checkUserExistsForBetterError(userId: string): Promise<'user_exists' | 'no_users' | 'user_not_found'> {
  try {
    const allUsers = await userDataManager.getAllUsers();
    
    if (allUsers.length === 0) {
      return 'no_users';
    }
    
    const userExists = allUsers.find((u: any) => 
      u.userId.toLowerCase() === userId.toLowerCase()
    );
    
    return userExists ? 'user_exists' : 'user_not_found';
  } catch (error) {
    console.error('❌ Error checking user existence:', error);
    return 'no_users';
  }
}

export async function getUserStorageDiagnostics() {
  console.log('🔧 === STORAGE DIAGNOSTICS START ===');
  
  try {
    // Check IndexedDB user data
    const allUsers = await userDataManager.getAllUsers();
    console.log('👥 Number of users in IndexedDB:', allUsers.length);
    console.log('👥 User IDs in IndexedDB:', allUsers.map((u: any) => u.userId));
    
    // Check session data
    const sessionData = await userDataManager.loadSession();
    console.log('📊 Session data exists:', !!sessionData);
    
    console.log('🔧 === STORAGE DIAGNOSTICS END ===');
    
    return {
      indexedDBUserCount: allUsers.length,
      sessionExists: !!sessionData,
      storageType: 'IndexedDB'
    };
  } catch (error) {
    console.error('❌ Error during diagnostics:', error);
    return {
      indexedDBUserCount: 0,
      sessionExists: false,
      storageType: 'IndexedDB',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Legacy sync wrapper for compatibility
export function findRegisteredUserSync(userId: string, password: string): RegisteredUser | null {
  console.warn('⚠️ Using deprecated sync method. Use async version instead.');
  
  // Try to return from memory cache or localStorage fallback
  try {
    const usersData = localStorage.getItem('registered_users');
    if (usersData) {
      const users = JSON.parse(usersData);
      return users.find((u: RegisteredUser) => 
        u.userId.toLowerCase() === userId.toLowerCase() && u.password === password
      ) || null;
    }
  } catch (error) {
    console.error('❌ Error in sync fallback:', error);
  }
  
  return null;
}
