import { indexedDBManager } from './storage/IndexedDBManager';
import { IndexedDBService } from './storage/IndexedDBService';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { MasterDataPersistenceManager } from './masterDataPersistenceManager';

export class CompleteDataResetService {
  private static instance: CompleteDataResetService;
  
  static getInstance(): CompleteDataResetService {
    if (!CompleteDataResetService.instance) {
      CompleteDataResetService.instance = new CompleteDataResetService();
    }
    return CompleteDataResetService.instance;
  }

  async performCompleteReset(): Promise<void> {
    console.log('🗑️ === PERFORMING COMPLETE DATA RESET ===');
    console.log('🚨 This will remove ALL Solution Seeking Organization data!');
    
    try {
      // Step 1: Clear all IndexedDB data
      await this.clearIndexedDBData();
      
      // Step 2: Clear all localStorage data
      await this.clearLocalStorageData();
      
      // Step 3: Clear all sessionStorage data
      await this.clearSessionStorageData();
      
      // Step 4: Clear master data configurations
      await this.clearMasterDataConfigurations();
      
      // Step 5: Clear unified user storage
      await this.clearUnifiedUserStorage();
      
      // Step 6: Clear browser caches and form data
      await this.clearBrowserCaches();
      
      // Step 7: Reset application state
      await this.resetApplicationState();
      
      console.log('✅ === COMPLETE DATA RESET SUCCESSFUL ===');
      console.log('🔄 Application is now in clean state. Please refresh the page.');
      
    } catch (error) {
      console.error('❌ Error during complete data reset:', error);
      throw error;
    }
  }

  private async clearIndexedDBData(): Promise<void> {
    console.log('🗑️ Clearing IndexedDB data...');
    
    try {
      // Initialize IndexedDB manager if needed
      if (!await indexedDBManager.isInitialized()) {
        await indexedDBManager.initialize();
      }
      
      // Clear all stores
      const stores = ['userProfiles', 'membershipData', 'sessionData', 'organizationData', 'engagementData'];
      
      for (const storeName of stores) {
        try {
          const service = new IndexedDBService<any>({ storeName });
          await service.clear();
          console.log(`✅ Cleared IndexedDB store: ${storeName}`);
        } catch (error) {
          console.log(`ℹ️ Store ${storeName} may not exist, skipping...`);
        }
      }
      
      // Close and delete the entire database
      try {
        const deleteRequest = indexedDB.deleteDatabase('VSRCoInnovatorDB');
        deleteRequest.onsuccess = () => console.log('✅ Deleted entire IndexedDB database');
        deleteRequest.onerror = () => console.log('⚠️ Could not delete IndexedDB database');
      } catch (error) {
        console.log('⚠️ Error deleting IndexedDB:', error);
      }
      
    } catch (error) {
      console.error('❌ Error clearing IndexedDB:', error);
    }
  }

  private async clearLocalStorageData(): Promise<void> {
    console.log('🗑️ Clearing localStorage data...');
    
    // Define all possible keys that could contain organization data
    const organizationKeys = [
      // User and authentication data
      'registered_users',
      'seeker_session_data',
      'seeking_org_admin_session',
      'user_session',
      'current_user',
      'login_history',
      'authentication_cache',
      
      // Organization data
      'seekerOrganizationName',
      'seekerEntityType',
      'seekerCountry',
      'seekerUserId',
      'seekerOrganizationType',
      'seekerIndustrySegment',
      'organization_profile',
      'organization_details',
      
      // Membership and engagement data
      'membership_status',
      'membership_payment_history',
      'completed_membership_payment',
      'engagement_selection',
      'engagement_model_selection',
      'user_membership_data',
      'selected_engagement_model',
      'pricing_selection',
      
      // Master data configurations
      'master_data_seeker_membership_fees',
      'master_data_engagement_models',
      'master_data_pricing_configs',
      'master_data_countries',
      'master_data_currencies',
      'master_data_entity_types',
      'master_data_organization_types',
      'master_data_industry_segments',
      'master_data_domain_groups',
      'master_data_departments',
      'master_data_competency_capabilities',
      
      // Application state
      'app_initialization_state',
      'dashboard_state',
      'form_cache',
      'user_preferences',
      
      // Validation and settings
      'votingSettings',
      'assessmentSettings',
      'validation_cache'
    ];

    // Remove all predefined keys
    organizationKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`✅ Removed localStorage key: ${key}`);
      } catch (error) {
        console.log(`⚠️ Could not remove ${key}:`, error);
      }
    });

    // Scan for any remaining organization-related keys
    const allKeys = Object.keys(localStorage);
    const remainingOrgKeys = allKeys.filter(key => 
      key.toLowerCase().includes('seeker') ||
      key.toLowerCase().includes('membership') ||
      key.toLowerCase().includes('organization') ||
      key.toLowerCase().includes('engagement') ||
      key.toLowerCase().includes('admin') ||
      key.toLowerCase().includes('master_data') ||
      key.includes('_backup') ||
      key.includes('_integrity') ||
      key.includes('_version') ||
      key.includes('_cache')
    );

    // Remove any remaining organization-related keys
    remainingOrgKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`✅ Removed additional localStorage key: ${key}`);
      } catch (error) {
        console.log(`⚠️ Could not remove additional key ${key}:`, error);
      }
    });
  }

  private async clearSessionStorageData(): Promise<void> {
    console.log('🗑️ Clearing sessionStorage data...');
    
    try {
      // Clear all sessionStorage
      sessionStorage.clear();
      console.log('✅ Cleared all sessionStorage data');
    } catch (error) {
      console.error('❌ Error clearing sessionStorage:', error);
    }
  }

  private async clearMasterDataConfigurations(): Promise<void> {
    console.log('🗑️ Clearing master data configurations...');
    
    try {
      // Clear all master data persistence manager data
      const masterDataKeys = [
        'master_data_seeker_membership_fees',
        'master_data_engagement_models',
        'master_data_pricing_configs',
        'master_data_countries',
        'master_data_currencies',
        'master_data_entity_types',
        'master_data_organization_types',
        'master_data_industry_segments',
        'master_data_domain_groups',
        'master_data_departments',
        'master_data_competency_capabilities',
        'master_data_challenge_statuses',
        'master_data_solution_statuses',
        'master_data_reward_types',
        'master_data_communication_types'
      ];

      masterDataKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log(`✅ Cleared master data: ${key}`);
        } catch (error) {
          console.log(`⚠️ Could not clear master data ${key}:`, error);
        }
      });
      
    } catch (error) {
      console.error('❌ Error clearing master data configurations:', error);
    }
  }

  private async clearUnifiedUserStorage(): Promise<void> {
    console.log('🗑️ Clearing unified user storage...');
    
    try {
      await unifiedUserStorageService.initialize();
      await unifiedUserStorageService.clearSession();
      console.log('✅ Cleared unified user storage session');
    } catch (error) {
      console.error('❌ Error clearing unified user storage:', error);
    }
  }

  private async clearBrowserCaches(): Promise<void> {
    console.log('🗑️ Clearing browser caches and form data...');
    
    try {
      // Clear all form inputs related to organizations
      const formSelectors = [
        '#org-email',
        '#org-password',
        '#userId',
        '#password',
        '#organizationName',
        '#entityType',
        '#country',
        '#organizationType',
        '#industrySegment',
        '#contactPersonName',
        '#email'
      ];

      formSelectors.forEach(selector => {
        const element = document.querySelector(selector) as HTMLInputElement;
        if (element) {
          element.value = '';
          element.autocomplete = 'off';
          // Trigger change event to clear any React state
          element.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`✅ Cleared form field: ${selector}`);
        }
      });

      // Clear any cached authentication tokens or headers
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
            console.log(`✅ Cleared cache: ${cacheName}`);
          }
        } catch (error) {
          console.log('⚠️ Could not clear service worker caches:', error);
        }
      }

    } catch (error) {
      console.error('❌ Error clearing browser caches:', error);
    }
  }

  private async resetApplicationState(): Promise<void> {
    console.log('🗑️ Resetting application state...');
    
    try {
      // Dispatch custom events to notify components to reset their state
      window.dispatchEvent(new CustomEvent('completeDataReset'));
      window.dispatchEvent(new CustomEvent('dashboardDataChange'));
      
      // Clear any URL hash or query parameters that might contain org data
      if (window.location.hash || window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      console.log('✅ Application state reset complete');
      
    } catch (error) {
      console.error('❌ Error resetting application state:', error);
    }
  }

  async verifyCompleteReset(): Promise<{
    indexedDBCleared: boolean;
    localStorageCleared: boolean;
    sessionStorageCleared: boolean;
    masterDataCleared: boolean;
    remainingKeys: string[];
  }> {
    console.log('🔍 === VERIFYING COMPLETE DATA RESET ===');
    
    try {
      // Check IndexedDB
      let indexedDBCleared = true;
      try {
        if (await indexedDBManager.isInitialized()) {
          const users = await unifiedUserStorageService.getAllUsers();
          indexedDBCleared = users.length === 0;
        }
      } catch (error) {
        // If IndexedDB is not accessible, consider it cleared
        indexedDBCleared = true;
      }

      // Check localStorage
      const allLocalKeys = Object.keys(localStorage);
      const remainingOrgKeys = allLocalKeys.filter(key => 
        key.toLowerCase().includes('seeker') ||
        key.toLowerCase().includes('membership') ||
        key.toLowerCase().includes('organization') ||
        key.toLowerCase().includes('engagement') ||
        key.toLowerCase().includes('admin') ||
        key.toLowerCase().includes('master_data') ||
        key.includes('registered_users')
      );
      
      const localStorageCleared = remainingOrgKeys.length === 0;

      // Check sessionStorage
      const sessionStorageCleared = sessionStorage.length === 0;

      // Check master data
      const masterDataKeys = allLocalKeys.filter(key => key.startsWith('master_data_'));
      const masterDataCleared = masterDataKeys.length === 0;

      const result = {
        indexedDBCleared,
        localStorageCleared,
        sessionStorageCleared,
        masterDataCleared,
        remainingKeys: remainingOrgKeys
      };

      console.log('📊 Reset Verification Results:', result);
      
      if (remainingOrgKeys.length > 0) {
        console.log('🔍 Remaining organization keys:', remainingOrgKeys);
      }

      console.log('✅ === VERIFICATION COMPLETE ===');
      return result;
      
    } catch (error) {
      console.error('❌ Error during verification:', error);
      return {
        indexedDBCleared: false,
        localStorageCleared: false,
        sessionStorageCleared: false,
        masterDataCleared: false,
        remainingKeys: []
      };
    }
  }
}

export const completeDataResetService = CompleteDataResetService.getInstance();