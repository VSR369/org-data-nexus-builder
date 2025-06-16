
import { IndexedDBService } from '@/utils/storage/IndexedDBService';
import { UserRecord } from './types';
import { UserQueryService } from './UserQueryService';

export class UserAuthenticationService {
  private userService: IndexedDBService<UserRecord>;
  private queryService: UserQueryService;

  constructor() {
    this.userService = new IndexedDBService<UserRecord>({
      storeName: 'userProfiles'
    });
    this.queryService = new UserQueryService();
  }

  async authenticateUser(userId: string, password: string): Promise<{ success: boolean; user?: UserRecord; error?: string }> {
    console.log('🔐 === USER LOGIN START ===');
    console.log('🔐 Authenticating user:', userId);
    
    try {
      // Find user by ID
      const user = await this.queryService.findUserById(userId);
      if (!user) {
        console.log('❌ User not found:', userId);
        
        // Check if there are any users at all
        const allUsers = await this.queryService.getAllUsers();
        if (allUsers.length === 0) {
          return {
            success: false,
            error: 'No registered users found. Please register first by clicking the "Register here" link below.'
          };
        }
        
        return {
          success: false,
          error: `User ID "${userId}" not found. Please check your User ID or register first.`
        };
      }
      
      // Verify password
      if (user.password !== password) {
        console.log('❌ Invalid password for user:', userId);
        return {
          success: false,
          error: 'User ID exists but password is incorrect. Please check your password.'
        };
      }
      
      // Update last login timestamp
      const updatedUser: UserRecord = {
        ...user,
        lastLoginTimestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await this.userService.put(updatedUser);
      
      console.log('✅ Authentication successful:', userId);
      console.log('🔐 === USER LOGIN END ===');
      
      return { success: true, user: updatedUser };
      
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      console.log('🔐 === USER LOGIN FAILED ===');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown authentication error'
      };
    }
  }
}
