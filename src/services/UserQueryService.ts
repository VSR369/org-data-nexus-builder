
import { IndexedDBService } from '@/utils/storage/IndexedDBService';
import { UserRecord } from './types';

export class UserQueryService {
  private userService: IndexedDBService<UserRecord>;

  constructor() {
    this.userService = new IndexedDBService<UserRecord>({
      storeName: 'userProfiles'
    });
  }

  async findUserById(userId: string): Promise<UserRecord | null> {
    try {
      console.log('🔍 Looking for user:', userId);
      
      // Try direct lookup first
      const user = await this.userService.getById(userId);
      if (user && user.userId) {
        console.log('✅ User found via direct lookup');
        return user;
      }
      
      // Fallback: search through all users
      const allUsers = await this.getAllUsers();
      const foundUser = allUsers.find(u => u.userId.toLowerCase() === userId.toLowerCase());
      
      if (foundUser) {
        console.log('✅ User found via collection search');
        return foundUser;
      }
      
      console.log('❌ User not found:', userId);
      return null;
      
    } catch (error) {
      console.error('❌ Error finding user:', error);
      return null;
    }
  }

  async getAllUsers(): Promise<UserRecord[]> {
    try {
      // Get all user records, filtering out non-user entries
      const allRecords = await this.userService.getAll();
      const userRecords = allRecords.filter(record => 
        record.userId && 
        record.password && 
        record.id !== 'registered_users' && 
        record.id !== 'seeker_session_data'
      );
      
      console.log(`📊 Retrieved ${userRecords.length} users from storage`);
      return userRecords;
      
    } catch (error) {
      console.error('❌ Error getting all users:', error);
      return [];
    }
  }

  async updateUsersCollection(): Promise<void> {
    try {
      const allUsers = await this.getAllUsers();
      
      // Create a special collection record that matches UserRecord structure
      // We'll use a dummy user record format to store the collection
      const usersCollectionRecord: UserRecord = {
        id: 'registered_users',
        userId: 'registered_users',
        password: '',
        organizationName: 'System Collection',
        organizationType: 'System',
        entityType: 'System',
        country: 'System',
        email: 'system@collection',
        contactPersonName: 'System',
        industrySegment: 'System',
        organizationId: 'registered_users',
        registrationTimestamp: new Date().toISOString(),
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await this.userService.put(usersCollectionRecord);
      console.log('✅ Users collection updated');
      
    } catch (error) {
      console.error('❌ Error updating users collection:', error);
    }
  }
}
