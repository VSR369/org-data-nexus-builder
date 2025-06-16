
import { IndexedDBService } from '@/utils/storage/IndexedDBService';
import { UserRecord } from './types';
import { UserQueryService } from './UserQueryService';

export class DataMigrationService {
  private userService: IndexedDBService<UserRecord>;
  private queryService: UserQueryService;

  constructor() {
    this.userService = new IndexedDBService<UserRecord>({
      storeName: 'userProfiles'
    });
    this.queryService = new UserQueryService();
  }

  async migrateLocalStorageData(): Promise<void> {
    console.log('🔄 === MIGRATION CHECK START ===');
    
    try {
      // Check if migration has already been completed
      const migrationFlag = localStorage.getItem('unified_storage_migration_complete');
      if (migrationFlag === 'true') {
        console.log('✅ Migration already completed');
        return;
      }
      
      // Check for localStorage data to migrate
      const localUsers = localStorage.getItem('registered_users');
      if (!localUsers) {
        console.log('📊 No localStorage users to migrate');
        localStorage.setItem('unified_storage_migration_complete', 'true');
        return;
      }
      
      const users = JSON.parse(localUsers);
      if (!Array.isArray(users) || users.length === 0) {
        console.log('📊 No valid users in localStorage');
        localStorage.setItem('unified_storage_migration_complete', 'true');
        return;
      }
      
      console.log(`🔄 Migrating ${users.length} users from localStorage...`);
      
      // Migrate each user
      for (const user of users) {
        try {
          const userRecord: UserRecord = {
            id: user.userId,
            userId: user.userId,
            password: user.password,
            organizationName: user.organizationName,
            organizationType: user.organizationType || user.organizationType,
            entityType: user.entityType,
            country: user.country,
            email: user.email,
            contactPersonName: user.contactPersonName,
            industrySegment: user.industrySegment || '',
            organizationId: user.organizationId || `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            registrationTimestamp: user.registrationTimestamp || new Date().toISOString(),
            version: 1,
            createdAt: user.registrationTimestamp || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          await this.userService.put(userRecord);
          console.log(`✅ Migrated user: ${user.userId}`);
          
        } catch (error) {
          console.error(`❌ Failed to migrate user ${user.userId}:`, error);
        }
      }
      
      // Update users collection
      await this.queryService.updateUsersCollection();
      
      // Mark migration as complete
      localStorage.setItem('unified_storage_migration_complete', 'true');
      
      console.log('✅ Migration completed successfully');
      console.log('🔄 === MIGRATION END ===');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
    }
  }
}
