
import { indexedDBManager } from './storage/IndexedDBManager';
import { IndexedDBService } from './storage/IndexedDBService';

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

  async verifyDataCleanup(): Promise<{
    userProfilesCleared: boolean;
    membershipDataCleared: boolean;
    localStorageCleared: boolean;
    remainingKeys: string[];
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

      console.log('✅ === VERIFICATION COMPLETE ===');
      
      return {
        userProfilesCleared,
        membershipDataCleared,
        localStorageCleared,
        remainingKeys: organizationKeys
      };
      
    } catch (error) {
      console.error('❌ Error during verification:', error);
      return {
        userProfilesCleared: false,
        membershipDataCleared: false,
        localStorageCleared: false,
        remainingKeys: []
      };
    }
  }
}

export const dataCleanupService = new DataCleanupService();
