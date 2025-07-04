// Simplified and corrected user data management for localStorage
// Consolidates all signup/login localStorage operations

export interface UserRecord {
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

export interface SessionData {
  userId: string;
  organizationName: string;
  organizationType: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  loginTimestamp: string;
}

const USERS_KEY = 'registered_users';
const SESSION_KEY = 'seeking_org_admin_session';

export class UserDataManager {
  // ============ SIGNUP OPERATIONS ============
  
  /**
   * Save user registration data during signup
   */
  static saveRegistrationData(userData: UserRecord): { success: boolean; error?: string } {
    console.log('💾 === SAVING REGISTRATION DATA ===');
    console.log('📊 User data to save:', JSON.stringify(userData, null, 2));
    
    try {
      // Validate required fields
      const requiredFields = ['userId', 'password', 'organizationName', 'entityType', 'country', 'email', 'contactPersonName'];
      for (const field of requiredFields) {
        if (!userData[field as keyof UserRecord] || userData[field as keyof UserRecord].toString().trim() === '') {
          console.error(`❌ Missing required field: ${field}`);
          return { success: false, error: `Missing required field: ${field}` };
        }
      }
      
      // Get existing users
      const existingUsers = this.getAllUsers();
      console.log('👥 Existing users count:', existingUsers.length);
      
      // Check for duplicate userId
      const duplicateUser = existingUsers.find(user => 
        user.userId.toLowerCase() === userData.userId.toLowerCase()
      );
      
      if (duplicateUser) {
        console.error('❌ Duplicate user ID:', userData.userId);
        return { success: false, error: `User ID "${userData.userId}" already exists` };
      }
      
      // Add new user to array
      const updatedUsers = [...existingUsers, userData];
      
      // Save to localStorage with JSON.stringify
      const jsonData = JSON.stringify(updatedUsers);
      localStorage.setItem(USERS_KEY, jsonData);
      
      console.log('✅ User registration data saved successfully');
      console.log('📊 Total users now:', updatedUsers.length);
      
      // Verify the save
      const verification = localStorage.getItem(USERS_KEY);
      if (verification === jsonData) {
        console.log('✅ Save verification successful');
        return { success: true };
      } else {
        console.error('❌ Save verification failed');
        return { success: false, error: 'Failed to verify data save' };
      }
      
    } catch (error) {
      console.error('❌ Error saving registration data:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  
  // ============ LOGIN OPERATIONS ============
  
  /**
   * Authenticate user during login and create session
   */
  static authenticateUser(userId: string, password: string): { success: boolean; user?: UserRecord; error?: string } {
    console.log('🔐 === AUTHENTICATING USER ===');
    console.log('🔐 Login attempt for userId:', userId);
    
    try {
      // Get all users from localStorage
      const allUsers = this.getAllUsers();
      console.log('👥 Total users to search:', allUsers.length);
      
      if (allUsers.length === 0) {
        console.log('❌ No registered users found');
        return { success: false, error: 'No registered users found. Please register first.' };
      }
      
      // Find user with matching credentials
      const foundUser = allUsers.find(user => 
        user.userId.toLowerCase() === userId.toLowerCase() && 
        user.password === password
      );
      
      if (!foundUser) {
        console.log('❌ User not found or invalid password');
        console.log('📊 Available userIds:', allUsers.map(u => u.userId));
        return { success: false, error: 'Invalid credentials. Please check your User ID and password.' };
      }
      
      console.log('✅ User authenticated successfully');
      console.log('👤 Found user:', {
        userId: foundUser.userId,
        organizationName: foundUser.organizationName,
        email: foundUser.email
      });
      
      return { success: true, user: foundUser };
      
    } catch (error) {
      console.error('❌ Authentication error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Authentication failed' };
    }
  }
  
  /**
   * Create and save user session after successful login
   */
  static createSession(user: UserRecord): { success: boolean; sessionData?: SessionData; error?: string } {
    console.log('🔑 === CREATING USER SESSION ===');
    
    try {
      const sessionData: SessionData = {
        userId: user.userId,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        entityType: user.entityType,
        country: user.country,
        email: user.email,
        contactPersonName: user.contactPersonName,
        loginTimestamp: new Date().toISOString()
      };
      
      console.log('📊 Session data to save:', JSON.stringify(sessionData, null, 2));
      
      // Save session to localStorage with JSON.stringify
      const jsonData = JSON.stringify(sessionData);
      localStorage.setItem(SESSION_KEY, jsonData);
      
      console.log('✅ Session created and saved successfully');
      
      // Verify the save
      const verification = localStorage.getItem(SESSION_KEY);
      if (verification === jsonData) {
        console.log('✅ Session save verification successful');
        return { success: true, sessionData };
      } else {
        console.error('❌ Session save verification failed');
        return { success: false, error: 'Failed to verify session save' };
      }
      
    } catch (error) {
      console.error('❌ Error creating session:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Session creation failed' };
    }
  }
  
  /**
   * Load existing session from localStorage
   */
  static loadSession(): { success: boolean; sessionData?: SessionData; error?: string } {
    console.log('📱 === LOADING SESSION ===');
    
    try {
      const rawSessionData = localStorage.getItem(SESSION_KEY);
      console.log('📊 Raw session data from localStorage:', rawSessionData);
      
      if (!rawSessionData) {
        console.log('📱 No session data found');
        return { success: false, error: 'No active session found' };
      }
      
      // Parse JSON data
      const sessionData = JSON.parse(rawSessionData) as SessionData;
      console.log('📊 Parsed session data:', JSON.stringify(sessionData, null, 2));
      
      // Validate session data structure
      const requiredSessionFields = ['userId', 'organizationName', 'email', 'loginTimestamp'];
      for (const field of requiredSessionFields) {
        if (!sessionData[field as keyof SessionData]) {
          console.error(`❌ Invalid session: missing ${field}`);
          return { success: false, error: 'Invalid session data' };
        }
      }
      
      console.log('✅ Session loaded successfully');
      return { success: true, sessionData };
      
    } catch (error) {
      console.error('❌ Error loading session:', error);
      // Clear corrupted session data
      localStorage.removeItem(SESSION_KEY);
      return { success: false, error: 'Corrupted session data removed' };
    }
  }
  
  // ============ HELPER METHODS ============
  
  /**
   * Get all registered users from localStorage
   */
  static getAllUsers(): UserRecord[] {
    console.log('👥 === GETTING ALL USERS ===');
    
    try {
      const rawData = localStorage.getItem(USERS_KEY);
      console.log('📊 Raw users data from localStorage:', rawData ? `${rawData.length} characters` : 'null');
      
      if (!rawData) {
        console.log('👥 No users data found');
        return [];
      }
      
      const users = JSON.parse(rawData) as UserRecord[];
      console.log('👥 Parsed users count:', Array.isArray(users) ? users.length : 'Not an array');
      
      if (!Array.isArray(users)) {
        console.error('❌ Users data is not an array');
        return [];
      }
      
      console.log('✅ Users retrieved successfully');
      return users;
      
    } catch (error) {
      console.error('❌ Error getting users:', error);
      return [];
    }
  }
  
  /**
   * Find user by userId
   */
  static findUserById(userId: string): UserRecord | null {
    console.log('🔍 === FINDING USER BY ID ===');
    console.log('🔍 Searching for userId:', userId);
    
    const allUsers = this.getAllUsers();
    const foundUser = allUsers.find(user => 
      user.userId.toLowerCase() === userId.toLowerCase()
    );
    
    if (foundUser) {
      console.log('✅ User found by ID');
      return foundUser;
    } else {
      console.log('❌ User not found by ID');
      return null;
    }
  }
  
  /**
   * Logout and clear session
   */
  static logout(): void {
    console.log('🚪 === LOGGING OUT ===');
    
    try {
      localStorage.removeItem(SESSION_KEY);
      console.log('✅ Session cleared successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  }
  
  /**
   * Validate data integrity
   */
  static validateDataIntegrity(): { valid: boolean; issues: string[] } {
    console.log('🔍 === VALIDATING DATA INTEGRITY ===');
    
    const issues: string[] = [];
    
    try {
      const allUsers = this.getAllUsers();
      
      // Check for duplicates
      const userIds = new Set<string>();
      const duplicates = new Set<string>();
      
      allUsers.forEach(user => {
        const lowerId = user.userId.toLowerCase();
        if (userIds.has(lowerId)) {
          duplicates.add(user.userId);
        } else {
          userIds.add(lowerId);
        }
      });
      
      if (duplicates.size > 0) {
        issues.push(`Duplicate user IDs found: ${Array.from(duplicates).join(', ')}`);
      }
      
      // Check for missing required fields
      const requiredFields = ['userId', 'password', 'organizationName', 'entityType', 'country', 'email', 'contactPersonName'];
      
      allUsers.forEach((user, index) => {
        requiredFields.forEach(field => {
          if (!user[field as keyof UserRecord] || user[field as keyof UserRecord].toString().trim() === '') {
            issues.push(`User ${user.userId || index}: missing ${field}`);
          }
        });
      });
      
      const valid = issues.length === 0;
      console.log(valid ? '✅ Data integrity validation passed' : '❌ Data integrity issues found');
      
      return { valid, issues };
      
    } catch (error) {
      console.error('❌ Error during validation:', error);
      return { valid: false, issues: ['Validation error: ' + (error instanceof Error ? error.message : 'Unknown error')] };
    }
  }
}

// Export convenience functions
export const saveUserRegistration = UserDataManager.saveRegistrationData;
export const authenticateUser = UserDataManager.authenticateUser;
export const createUserSession = UserDataManager.createSession;
export const loadUserSession = UserDataManager.loadSession;
export const logoutUser = UserDataManager.logout;
export const getAllRegisteredUsers = UserDataManager.getAllUsers;
export const findUserById = UserDataManager.findUserById;
export const validateUserDataIntegrity = UserDataManager.validateDataIntegrity;