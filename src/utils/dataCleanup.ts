
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
      // Clear Supabase database tables (main cleanup)
      await this.clearSupabaseData();

      // Clear browser form cache
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
      console.log(`📊 Current data: Organizations: ${counts.organizations}, Profiles: ${counts.profiles}, Activations: ${counts.activations}, Auth Users: ${counts.authUsers}`);

      // Clear organization documents first (due to foreign key)
      console.log('🗑️ Clearing organization documents...');
      const { error: docsError } = await supabase
        .from('organization_documents')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (docsError) {
        console.error('❌ Error clearing organization documents:', docsError);
        throw docsError;
      }
      console.log('✅ Organization documents cleared');

      // Clear organizations
      console.log('🗑️ Clearing organizations...');
      const { error: orgsError } = await supabase
        .from('organizations')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (orgsError) {
        console.error('❌ Error clearing organizations:', orgsError);
        throw orgsError;
      }
      console.log('✅ Organizations cleared');

      // Clear engagement activations
      console.log('🗑️ Clearing engagement activations...');
      const { error: activationsError } = await supabase
        .from('engagement_activations')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
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
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (profilesError) {
        console.error('❌ Error clearing profiles:', profilesError);
        throw profilesError;
      }
      console.log('✅ Profiles cleared');

      // Clear auth users using client-side auth methods
      console.log('🗑️ Attempting to clear current auth user...');
      try {
        const { data: currentUser } = await supabase.auth.getUser();
        if (currentUser?.user) {
          console.log(`🗑️ Signing out current user: ${currentUser.user.email}`);
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.warn('⚠️ Error signing out:', error);
          } else {
            console.log('✅ Current user signed out');
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not access current user:', error);
      }

      console.log('✅ === SUPABASE DATABASE CLEARED ===');
      
    } catch (error) {
      console.error('❌ Error during Supabase cleanup:', error);
      throw error;
    }
  }

  async getDataCounts(): Promise<{
    organizations: number;
    profiles: number;
    activations: number;
    authUsers: number;
    configs: number;
  }> {
    try {
      // Count organizations
      const { count: organizationsCount } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true });

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

      // Count auth users (check for current user)
      let authUsersCount = 0;
      try {
        const { data: currentUser } = await supabase.auth.getUser();
        authUsersCount = currentUser?.user ? 1 : 0;
      } catch (error) {
        console.warn('⚠️ Could not access current user for count');
      }

      return {
        organizations: organizationsCount || 0,
        profiles: profilesCount || 0,
        activations: activationsCount || 0,
        authUsers: authUsersCount,
        configs: configsCount || 0
      };
    } catch (error) {
      console.error('❌ Error getting data counts:', error);
      return { organizations: 0, profiles: 0, activations: 0, authUsers: 0, configs: 0 };
    }
  }

  async verifyDataCleanup(): Promise<{
    userProfilesCleared: boolean;
    membershipDataCleared: boolean;
    localStorageCleared: boolean;
    databaseCleared: boolean;
    remainingKeys: string[];
    databaseCounts: { organizations: number; profiles: number; activations: number; authUsers: number; configs: number };
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
      const databaseCleared = databaseCounts.organizations === 0 && databaseCounts.profiles === 0 && databaseCounts.activations === 0;
      
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
        databaseCounts: { organizations: 0, profiles: 0, activations: 0, authUsers: 0, configs: 0 }
      };
    }
  }
}

export const dataCleanupService = new DataCleanupService();
