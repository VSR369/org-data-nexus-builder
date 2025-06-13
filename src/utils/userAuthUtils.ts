
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
  
  const user = sessionStorageManager.findUser(userId, password);
  
  console.log('🔍 === USER SEARCH END ===');
  return user;
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
