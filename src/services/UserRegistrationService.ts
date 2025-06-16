
import { IndexedDBService } from '@/utils/storage/IndexedDBService';
import { UserRecord } from './types';

export class UserRegistrationService {
  private userService: IndexedDBService<UserRecord>;

  constructor() {
    this.userService = new IndexedDBService<UserRecord>({
      storeName: 'userProfiles'
    });
  }

  async registerUser(userData: Omit<UserRecord, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string; user?: UserRecord }> {
    console.log('📝 === USER REGISTRATION START ===');
    console.log('📝 Registering user:', userData.userId);
    
    try {
      // Check if user already exists
      const existingUser = await this.userService.getById(userData.userId);
      if (existingUser) {
        console.log('❌ User already exists:', userData.userId);
        return {
          success: false,
          error: `User ID "${userData.userId}" already exists. Please choose a different User ID.`
        };
      }
      
      // Create user record
      const userRecord: UserRecord = {
        id: userData.userId,
        ...userData,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to IndexedDB
      await this.userService.put(userRecord);
      console.log('✅ User saved to IndexedDB:', userRecord.userId);
      
      // Verify the save
      const verification = await this.userService.getById(userData.userId);
      if (!verification) {
        throw new Error('Failed to verify user save - user not found after registration');
      }
      
      console.log('✅ Registration completed and verified:', userData.userId);
      console.log('📝 === USER REGISTRATION END ===');
      
      return { success: true, user: userRecord };
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      console.log('📝 === USER REGISTRATION FAILED ===');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown registration error'
      };
    }
  }
}
