
import { sessionStorageManager } from './storage/SessionStorageManager';

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

export function findRegisteredUser(userId: string, password: string): RegisteredUser | null {
  console.log('🔍 === USER SEARCH START ===');
  console.log('🔍 Searching for userId:', userId);
  
  // First try with SessionStorageManager
  let user = sessionStorageManager.findUser(userId, password);
  
  if (user) {
    console.log('✅ User found via SessionStorageManager');
    console.log('🔍 === USER SEARCH END ===');
    return user;
  }
  
  // Fallback: Direct localStorage access if SessionStorageManager fails due to integrity issues
  console.log('⚠️ SessionStorageManager failed, trying direct localStorage access...');
  
  try {
    const usersData = localStorage.getItem('registered_users');
    if (!usersData) {
      console.log('❌ No users data found in localStorage');
      console.log('🔍 === USER SEARCH END ===');
      return null;
    }
    
    const users = JSON.parse(usersData);
    const foundUser = users.find((u: RegisteredUser) => 
      u.userId.toLowerCase() === userId.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
      console.log('✅ User found via direct localStorage access');
      console.log('🔍 === USER SEARCH END ===');
      return foundUser;
    } else {
      console.log('❌ User not found or password incorrect');
      console.log('🔍 === USER SEARCH END ===');
      return null;
    }
  } catch (error) {
    console.error('❌ Error accessing localStorage directly:', error);
    console.log('🔍 === USER SEARCH END ===');
    return null;
  }
}

export function checkUserExistsForBetterError(userId: string): 'user_exists' | 'no_users' | 'user_not_found' {
  // Try to find user with any password to check existence
  const usersData = localStorage.getItem('registered_users');
  if (!usersData) {
    return 'no_users';
  }
  
  try {
    const users = JSON.parse(usersData);
    const userExists = users.find((u: any) => 
      u.userId.toLowerCase() === userId.toLowerCase()
    );
    
    return userExists ? 'user_exists' : 'user_not_found';
  } catch {
    return 'no_users';
  }
}

export function getUserStorageDiagnostics() {
  console.log('🔧 === STORAGE DIAGNOSTICS START ===');
  
  // Check SessionStorageManager health
  const storageHealth = sessionStorageManager.getStorageHealth();
  console.log('📊 SessionStorageManager Health:', storageHealth);
  
  // Check direct localStorage access
  const directUsers = localStorage.getItem('registered_users');
  console.log('📁 Direct localStorage users data exists:', !!directUsers);
  
  if (directUsers) {
    try {
      const users = JSON.parse(directUsers);
      console.log('👥 Number of users in direct localStorage:', users.length);
      console.log('👥 User IDs in direct localStorage:', users.map((u: any) => u.userId));
    } catch (error) {
      console.error('❌ Error parsing direct localStorage users:', error);
    }
  }
  
  console.log('🔧 === STORAGE DIAGNOSTICS END ===');
  
  return {
    sessionManagerHealth: storageHealth,
    directStorageExists: !!directUsers,
    directStorageValid: directUsers ? (() => {
      try {
        JSON.parse(directUsers);
        return true;
      } catch {
        return false;
      }
    })() : false
  };
}
