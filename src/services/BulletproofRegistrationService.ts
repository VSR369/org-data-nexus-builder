import { UserRegistrationService } from './UserRegistrationService';
import { userDataManager } from '@/utils/storage/UserDataManager';

interface CompleteUserData {
  // Basic Info
  userId: string;
  password: string;
  organizationName: string;
  organizationId: string;
  organizationType: string;
  entityType: string;
  industrySegment: string;
  
  // Contact Details
  contactPersonName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  
  // Location
  country: string;
  address: string;
  
  // Web Presence
  website: string;
  
  // Documents (File objects converted to metadata)
  registrationDocuments: Array<{name: string, size: number, type: string}>;
  companyProfile: Array<{name: string, size: number, type: string}>;
  companyLogo: Array<{name: string, size: number, type: string}>;
  
  // Timestamps
  registrationTimestamp: string;
}

export class BulletproofRegistrationService {
  private userRegistrationService: UserRegistrationService;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  constructor() {
    this.userRegistrationService = new UserRegistrationService();
  }

  async registerUser(userData: any): Promise<{ success: boolean; error?: string; userId?: string }> {
    console.log('🛡️ === BULLETPROOF REGISTRATION START ===');
    console.log('🛡️ Registering user with comprehensive data protection:', userData.userId);
    
    try {
      // Step 1: Comprehensive data validation
      const validationResult = this.validateCompleteUserData(userData);
      if (!validationResult.isValid) {
        console.error('❌ Data validation failed:', validationResult.errors);
        return {
          success: false,
          error: `Data validation failed: ${validationResult.errors.join(', ')}`
        };
      }

      // Step 2: Prepare complete user data with all fields
      const completeUserData = this.prepareCompleteUserData(userData);
      
      // Step 3: Check for duplicate users across all storage locations
      const duplicateCheck = await this.checkForDuplicateUser(completeUserData.userId, completeUserData.email);
      if (duplicateCheck.exists) {
        console.error('❌ User already exists:', duplicateCheck.location);
        return {
          success: false,
          error: `User already exists in ${duplicateCheck.location}. Please use a different User ID or Email.`
        };
      }

      // Step 4: Save to multiple storage locations with retry mechanism
      const saveResults = await this.saveToMultipleLocations(completeUserData);
      
      if (saveResults.success) {
        // Step 5: Verify all saves were successful
        const verificationResult = await this.verifyAllSaves(completeUserData.userId);
        
        if (verificationResult.success) {
          console.log('✅ Bulletproof registration completed successfully:', completeUserData.userId);
          console.log('🛡️ === BULLETPROOF REGISTRATION SUCCESS ===');
          return {
            success: true,
            userId: completeUserData.userId
          };
        } else {
          console.error('❌ Save verification failed:', verificationResult.errors);
          return {
            success: false,
            error: `Registration verification failed: ${verificationResult.errors.join(', ')}`
          };
        }
      } else {
        console.error('❌ Failed to save to required storage locations:', saveResults.errors);
        return {
          success: false,
          error: `Registration failed: ${saveResults.errors.join(', ')}`
        };
      }

    } catch (error) {
      console.error('❌ Bulletproof registration failed with exception:', error);
      console.log('🛡️ === BULLETPROOF REGISTRATION FAILED ===');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown registration error'
      };
    }
  }

  private validateCompleteUserData(userData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required string fields
    const requiredFields = [
      'userId', 'password', 'organizationName', 'organizationId', 
      'organizationType', 'entityType', 'contactPersonName', 
      'email', 'country'
    ];

    for (const field of requiredFields) {
      if (!userData[field] || typeof userData[field] !== 'string' || userData[field].trim() === '') {
        errors.push(`${field} is required and cannot be empty`);
      }
    }

    // Email validation
    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Invalid email format');
    }

    // Password validation
    if (userData.password && userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    // User ID validation (no spaces, special characters)
    if (userData.userId && !/^[a-zA-Z0-9_-]+$/.test(userData.userId)) {
      errors.push('User ID can only contain letters, numbers, underscores, and hyphens');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private prepareCompleteUserData(userData: any): CompleteUserData {
    // Convert File objects to metadata for storage
    const convertFiles = (files: File[] | undefined) => {
      if (!files || !Array.isArray(files)) return [];
      return files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
    };

    return {
      userId: userData.userId?.trim() || '',
      password: userData.password || '',
      organizationName: userData.organizationName?.trim() || '',
      organizationId: userData.organizationId || '',
      organizationType: userData.organizationType || '',
      entityType: userData.entityType || '',  
      industrySegment: userData.industrySegment || '',
      contactPersonName: userData.contactPersonName?.trim() || '',
      email: userData.email?.trim().toLowerCase() || '',
      countryCode: userData.countryCode || '',
      phoneNumber: userData.phoneNumber || '',
      country: userData.country || '',
      address: userData.address?.trim() || '',
      website: userData.website?.trim() || '',
      registrationDocuments: convertFiles(userData.registrationDocuments),
      companyProfile: convertFiles(userData.companyProfile),
      companyLogo: convertFiles(userData.companyLogo),
      registrationTimestamp: new Date().toISOString()
    };
  }

  private async checkForDuplicateUser(userId: string, email: string): Promise<{ exists: boolean; location?: string }> {
    try {
      // Check localStorage
      const localStorageUsers = localStorage.getItem('registered_users');
      if (localStorageUsers) {
        const users = JSON.parse(localStorageUsers);
        const duplicate = users.find((user: any) => 
          user.userId?.toLowerCase() === userId.toLowerCase() || 
          user.email?.toLowerCase() === email.toLowerCase()
        );
        if (duplicate) {
          return { exists: true, location: 'localStorage' };
        }
      }

      // Check IndexedDB
      const indexedDBUser = await userDataManager.findUser(userId, 'dummy_check');
      if (indexedDBUser) {
        return { exists: true, location: 'IndexedDB' };
      }

      return { exists: false };
    } catch (error) {
      console.warn('⚠️ Error checking for duplicates:', error);
      return { exists: false };
    }
  }

  private async saveToMultipleLocations(userData: CompleteUserData): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    let successCount = 0;

    // Save to localStorage with retry
    const localStorageSuccess = await this.saveToLocalStorageWithRetry(userData);
    if (localStorageSuccess) {
      successCount++;
      console.log('✅ Saved to localStorage successfully');
    } else {
      errors.push('Failed to save to localStorage');
    }

    // Save to IndexedDB with retry
    const indexedDBSuccess = await this.saveToIndexedDBWithRetry(userData);
    if (indexedDBSuccess) {
      successCount++;
      console.log('✅ Saved to IndexedDB successfully');
    } else {
      errors.push('Failed to save to IndexedDB');
    }

    // Save to sessionStorage as additional backup
    const sessionStorageSuccess = this.saveToSessionStorage(userData);
    if (sessionStorageSuccess) {
      successCount++;
      console.log('✅ Saved to sessionStorage successfully');
    } else {
      errors.push('Failed to save to sessionStorage');
    }

    // Require at least 2 successful saves
    return {
      success: successCount >= 2,
      errors
    };
  }

  private async saveToLocalStorageWithRetry(userData: CompleteUserData): Promise<boolean> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        existingUsers.push(userData);
        localStorage.setItem('registered_users', JSON.stringify(existingUsers));
        
        // Verify the save
        const verification = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const savedUser = verification.find((u: any) => u.userId === userData.userId);
        
        if (savedUser) {
          return true;
        } else {
          throw new Error('Save verification failed');
        }
      } catch (error) {
        console.warn(`⚠️ localStorage save attempt ${attempt} failed:`, error);
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }
    return false;
  }

  private async saveToIndexedDBWithRetry(userData: CompleteUserData): Promise<boolean> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const success = await userDataManager.saveUser(userData);
        if (success) {
          // Verify the save
          const verification = await userDataManager.findUser(userData.userId, userData.password);
          if (verification) {
            return true;
          } else {
            throw new Error('IndexedDB save verification failed');
          }
        } else {
          throw new Error('IndexedDB save returned false');
        }
      } catch (error) {
        console.warn(`⚠️ IndexedDB save attempt ${attempt} failed:`, error);
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }
    return false;
  }

  private saveToSessionStorage(userData: CompleteUserData): boolean {
    try {
      const sessionKey = `user_backup_${userData.userId}`;
      sessionStorage.setItem(sessionKey, JSON.stringify(userData));
      
      // Verify the save
      const verification = sessionStorage.getItem(sessionKey);
      return verification !== null;
    } catch (error) {
      console.warn('⚠️ sessionStorage save failed:', error);
      return false;
    }
  }

  private async verifyAllSaves(userId: string): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    let verifiedCount = 0;

    // Verify localStorage
    try {
      const localUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const localUser = localUsers.find((u: any) => u.userId === userId);
      if (localUser) {
        verifiedCount++;
        console.log('✅ Verified localStorage save');
      } else {
        errors.push('localStorage verification failed');
      }
    } catch (error) {
      errors.push('localStorage verification error');
    }

    // Verify IndexedDB
    try {
      const allUsers = await userDataManager.getAllUsers();
      const indexedUser = allUsers.find(u => u.userId === userId);
      if (indexedUser) {
        verifiedCount++;
        console.log('✅ Verified IndexedDB save');
      } else {
        errors.push('IndexedDB verification failed');
      }
    } catch (error) {
      errors.push('IndexedDB verification error');
    }

    // Verify sessionStorage
    try {
      const sessionUser = sessionStorage.getItem(`user_backup_${userId}`);
      if (sessionUser) {
        verifiedCount++;
        console.log('✅ Verified sessionStorage save');
      } else {
        errors.push('sessionStorage verification failed');
      }
    } catch (error) {
      errors.push('sessionStorage verification error');
    }

    return {
      success: verifiedCount >= 2,
      errors
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}