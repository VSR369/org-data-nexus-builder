
import { indexedDBManager } from './storage/IndexedDBManager';
import { IndexedDBService } from './storage/IndexedDBService';
import { supabase } from '@/integrations/supabase/client';

export class DataCleanupService {
  private userService: IndexedDBService<any>;
  private membershipService: IndexedDBService<any>;

  constructor() {
    this.userService = new IndexedDBService<any>({
      storeName: 'userProfiles'
    });
    this.membershipService = new IndexedDBService<any>({
      storeName: 'membershipData'
    });
  }

  async clearAllSolutionSeekingOrganizationData(): Promise<void> {
    console.log('🗑️ === CLEARING ALL SOLUTION SEEKING ORGANIZATION DATA ===');
    
    try {
      // First clear Supabase database tables
      await this.clearSupabaseData();

      // Ensure IndexedDB is initialized
      if (!await indexedDBManager.isInitialized()) {
        await indexedDBManager.initialize();
      }

      // Clear user profiles from IndexedDB
      console.log('🗑️ Clearing user profiles from IndexedDB...');
      await this.userService.clear();

      // Clear membership data from IndexedDB
      console.log('🗑️ Clearing membership data from IndexedDB...');
      try {
        await this.membershipService.clear();
      } catch (error) {
        console.log('ℹ️ Membership store may not exist yet, skipping...');
      }

      // Clear localStorage data related to organizations
      console.log('🗑️ Clearing localStorage organization data...');
      const keysToRemove = [
        'registered_users',
        'seeker_session_data',
        'seeking_org_admin_session',
        'seekerOrganizationName',
        'seekerEntityType',
        'seekerCountry',
        'seekerUserId',
        'seekerOrganizationType',
        'membership_status',
        'engagement_selection',
        'user_membership_data'
      ];

      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log(`✅ Removed ${key} from localStorage`);
        } catch (error) {
          console.log(`⚠️ Could not remove ${key}:`, error);
        }
      });

      // Clear any backup or integrity data
      const allKeys = Object.keys(localStorage);
      const backupKeys = allKeys.filter(key => 
        key.includes('_backup') || 
        key.includes('_integrity') || 
        key.includes('_version') ||
        key.startsWith('seeker') ||
        key.includes('membership') ||
        key.includes('organization')
      );

      backupKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log(`✅ Removed backup/integrity key: ${key}`);
        } catch (error) {
          console.log(`⚠️ Could not remove backup key ${key}:`, error);
        }
      });

      // Clear browser form cache and autofill data
      this.clearBrowserFormCache();

      console.log('✅ === ALL SOLUTION SEEKING ORGANIZATION DATA CLEARED ===');
      
    } catch (error) {
      console.error('❌ Error during data cleanup:', error);
      throw error;
    }
  }

  private clearBrowserFormCache(): void {
    console.log('🗑️ Clearing browser form cache...');
    
    // Clear organization login form inputs
    const orgEmailInput = document.getElementById('org-email') as HTMLInputElement;
    const orgPasswordInput = document.getElementById('org-password') as HTMLInputElement;
    
    if (orgEmailInput) {
      orgEmailInput.value = '';
      orgEmailInput.autocomplete = 'off';
    }
    if (orgPasswordInput) {
      orgPasswordInput.value = '';
      orgPasswordInput.autocomplete = 'off';
    }

    // Clear general login form inputs
    const emailInput = document.getElementById('userId') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    if (emailInput) {
      emailInput.value = '';
      emailInput.autocomplete = 'off';
    }
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.autocomplete = 'off';
    }

    console.log('✅ Browser form cache cleared');
  }

  private async clearSupabaseData(): Promise<void> {
    console.log('🗑️ === CLEARING SUPABASE DATABASE ===');
    
    try {
      // Get current data counts for logging
      const counts = await this.getDataCounts();
      console.log(`📊 Current data: Profiles: ${counts.profiles}, Activations: ${counts.activations}, Auth Users: ${counts.authUsers}`);

      // Clear engagement activations
      console.log('🗑️ Clearing engagement activations...');
      const { error: activationsError } = await supabase
        .from('engagement_activations')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (activationsError) {
        console.error('❌ Error clearing engagement activations:', activationsError);
        throw activationsError;
      }
      console.log('✅ Engagement activations cleared');

      // Clear profiles
      console.log('🗑️ Clearing profiles...');
      const { error: profilesError } = await supabase
        .from('profiles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (profilesError) {
        console.error('❌ Error clearing profiles:', profilesError);
        throw profilesError;
      }
      console.log('✅ Profiles cleared');

      // Clear auth users (this allows email reuse)
      console.log('🗑️ Clearing auth users...');
      const { data: users } = await supabase.auth.admin.listUsers();
      
      if (users?.users) {
        for (const user of users.users) {
          const { error } = await supabase.auth.admin.deleteUser(user.id);
          if (error) {
            console.warn(`⚠️ Could not delete user ${user.email}:`, error);
          } else {
            console.log(`✅ Deleted user: ${user.email}`);
          }
        }
      }

      console.log('✅ === SUPABASE DATABASE CLEARED ===');
      
    } catch (error) {
      console.error('❌ Error during Supabase cleanup:', error);
      throw error;
    }
  }

  async getDataCounts(): Promise<{
    profiles: number;
    activations: number;
    authUsers: number;
    configs: number;
  }> {
    try {
      // Count profiles
      const { count: profilesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Count engagement activations
      const { count: activationsCount } = await supabase
        .from('engagement_activations')
        .select('*', { count: 'exact', head: true });

      // Count pricing configs (should be preserved)
      const { count: configsCount } = await supabase
        .from('pricing_configs')
        .select('*', { count: 'exact', head: true });

      // Count auth users
      const { data: users } = await supabase.auth.admin.listUsers();
      const authUsersCount = users?.users?.length || 0;

      return {
        profiles: profilesCount || 0,
        activations: activationsCount || 0,
        authUsers: authUsersCount,
        configs: configsCount || 0
      };
    } catch (error) {
      console.error('❌ Error getting data counts:', error);
      return { profiles: 0, activations: 0, authUsers: 0, configs: 0 };
    }
  }

  async verifyDataCleanup(): Promise<{
    userProfilesCleared: boolean;
    membershipDataCleared: boolean;
    localStorageCleared: boolean;
    databaseCleared: boolean;
    remainingKeys: string[];
    databaseCounts: { profiles: number; activations: number; authUsers: number; configs: number };
  }> {
    console.log('🔍 === VERIFYING DATA CLEANUP ===');
    
    try {
      // Check IndexedDB user profiles
      const users = await this.userService.getAll();
      const userProfilesCleared = users.length === 0;
      console.log(`📊 User profiles remaining: ${users.length}`);

      // Check IndexedDB membership data
      let membershipCount = 0;
      try {
        const memberships = await this.membershipService.getAll();
        membershipCount = memberships.length;
      } catch (error) {
        // Store may not exist, which is fine
      }
      const membershipDataCleared = membershipCount === 0;
      console.log(`📊 Membership records remaining: ${membershipCount}`);

      // Check localStorage
      const allKeys = Object.keys(localStorage);
      const organizationKeys = allKeys.filter(key => 
        key.includes('seeker') ||
        key.includes('membership') ||
        key.includes('organization') ||
        key.includes('registered_users') ||
        key.includes('admin_session')
      );
      
      const localStorageCleared = organizationKeys.length === 0;
      console.log(`📊 Organization-related localStorage keys remaining: ${organizationKeys.length}`);
      
      if (organizationKeys.length > 0) {
        console.log('🔍 Remaining organization keys:', organizationKeys);
      }

      // Verify database cleanup
      const databaseCounts = await this.getDataCounts();
      const databaseCleared = databaseCounts.profiles === 0 && databaseCounts.activations === 0 && databaseCounts.authUsers === 0;
      
      console.log(`📊 Post-cleanup database counts:`, databaseCounts);
      console.log('✅ === VERIFICATION COMPLETE ===');
      
      return {
        userProfilesCleared,
        membershipDataCleared,
        localStorageCleared,
        databaseCleared,
        remainingKeys: organizationKeys,
        databaseCounts
      };
      
    } catch (error) {
      console.error('❌ Error during verification:', error);
      return {
        userProfilesCleared: false,
        membershipDataCleared: false,
        localStorageCleared: false,
        databaseCleared: false,
        remainingKeys: [],
        databaseCounts: { profiles: 0, activations: 0, authUsers: 0, configs: 0 }
      };
    }
  }
}

export const dataCleanupService = new DataCleanupService();
