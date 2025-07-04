
import { unifiedUserStorageService, UserRecord, SessionData } from '@/services/UnifiedUserStorageService';

export interface AuthResult {
  success: boolean;
  user?: UserRecord;
  error?: string;
}

export interface RegistrationData {
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
}

export async function registerUser(userData: RegistrationData): Promise<AuthResult> {
  console.log('📝 === UNIFIED REGISTRATION START ===');
  console.log('📝 Registering user with unified service:', userData.userId);
  
  try {
    // Validate required fields
    const required = ['userId', 'password', 'organizationName', 'organizationType', 'entityType', 'country', 'email', 'contactPersonName'];
    for (const field of required) {
      if (!userData[field as keyof RegistrationData] || userData[field as keyof RegistrationData].toString().trim() === '') {
        console.log(`❌ Missing required field: ${field}`);
        return {
          success: false,
          error: `Missing required field: ${field}`
        };
      }
    }
    
    // Register user with unified service
    const result = await unifiedUserStorageService.registerUser({
      ...userData,
      registrationTimestamp: new Date().toISOString()
    });
    
    if (result.success) {
      console.log('✅ Unified registration successful:', userData.userId);
      console.log('📝 === UNIFIED REGISTRATION END ===');
      return { success: true, user: result.user };
    } else {
      console.log('❌ Unified registration failed:', result.error);
      console.log('📝 === UNIFIED REGISTRATION FAILED ===');
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    console.log('📝 === UNIFIED REGISTRATION ERROR ===');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown registration error'
    };
  }
}

export async function authenticateUser(userId: string, password: string): Promise<AuthResult> {
  console.log('🔐 === UNIFIED LOGIN START ===');
  console.log('🔐 Authenticating with unified service:', userId);
  
  try {
    if (!userId.trim() || !password.trim()) {
      return {
        success: false,
        error: 'Please enter both User ID and password'
      };
    }
    
    const result = await unifiedUserStorageService.authenticateUser(userId.trim(), password);
    
    if (result.success && result.user) {
      console.log('✅ Unified authentication successful:', userId);
      console.log('🔐 === UNIFIED LOGIN END ===');
      return { success: true, user: result.user };
    } else {
      console.log('❌ Unified authentication failed:', result.error);
      console.log('🔐 === UNIFIED LOGIN FAILED ===');
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('❌ Authentication error:', error);
    console.log('🔐 === UNIFIED LOGIN ERROR ===');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown authentication error'
    };
  }
}

export async function saveUserSession(user: UserRecord): Promise<boolean> {
  try {
    const sessionData: SessionData = {
      userId: user.userId,
      organizationName: user.organizationName,
      organizationType: user.organizationType || user.entityType,
      entityType: user.entityType,
      country: user.country,
      email: user.email,
      contactPersonName: user.contactPersonName,
      industrySegment: user.industrySegment || 'Not Specified',
      organizationId: user.organizationId || user.userId,
      loginTimestamp: new Date().toISOString()
    };
    
    return await unifiedUserStorageService.saveSession(sessionData);
  } catch (error) {
    console.error('❌ Error saving session:', error);
    return false;
  }
}

export async function loadUserSession(): Promise<SessionData | null> {
  try {
    return await unifiedUserStorageService.loadSession();
  } catch (error) {
    console.error('❌ Error loading session:', error);
    return null;
  }
}

export async function clearUserSession(): Promise<void> {
  try {
    await unifiedUserStorageService.clearSession();
  } catch (error) {
    console.error('❌ Error clearing session:', error);
  }
}

export async function checkStorageHealth() {
  return await unifiedUserStorageService.checkStorageHealth();
}

export async function getAllUsers(): Promise<UserRecord[]> {
  try {
    return await unifiedUserStorageService.getAllUsers();
  } catch (error) {
    console.error('❌ Error getting all users:', error);
    return [];
  }
}
