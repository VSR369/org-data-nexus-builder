/**
 * Comprehensive localStorage cleaner to remove all legacy master data
 * This ensures Supabase is the single source of truth
 */
export class LocalStorageCleaner {
  /**
   * Remove all localStorage keys related to master data
   */
  static clearAllMasterData(): void {
    console.log('🧹 Starting comprehensive localStorage cleanup...');
    
    const masterDataKeys = [
      // Legacy data manager keys
      'master_data_countries',
      'master_data_currencies', 
      'master_data_organization_types',
      'master_data_entity_types',
      'master_data_industry_segments',
      'master_data_departments',
      'master_data_domain_groups',
      'master_data_challenge_statuses',
      'master_data_solution_statuses',
      'master_data_competency_capabilities',
      'master_data_communication_types',
      'master_data_reward_types',
      'master_data_seeker_membership_fees',
      'master_data_engagement_models',
      'master_data_pricing',
      'master_data_events',
      
      // Custom data keys
      'custom_countries',
      'custom_currencies',
      'custom_organization_types',
      'custom_entity_types', 
      'custom_industry_segments',
      'custom_departments',
      'custom_domain_groups',
      'custom_challenge_statuses',
      'custom_solution_statuses',
      'custom_competency_capabilities',
      'custom_communication_types',
      'custom_reward_types',
      'custom_seeker_membership_fees',
      'custom_engagement_models',
      'custom_pricing',
      'custom_events',
      
      // Mode and control keys
      'master_data_mode',
      'custom_data_extraction_timestamp',
      'custom_data_report',
      'custom_data_fix_timestamp',
      
      // Cache and backup keys
      'master_data_last_backup',
      'master_data_gist_url',
      'master_data_last_sync',
      
      // Version and initialization keys  
      'master_data_version',
      'master_data_initialized',
      'pricing_configs_version',
      'membership_fees_version'
    ];
    
    let removedCount = 0;
    
    masterDataKeys.forEach(key => {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        removedCount++;
        console.log(`🗑️ Removed: ${key}`);
      }
    });
    
    console.log(`✅ localStorage cleanup complete. Removed ${removedCount} master data keys.`);
    console.log('🎯 Supabase is now the single source of truth for all master data.');
  }
  
  /**
   * Clear all localStorage keys (nuclear option)
   */
  static clearAllLocalStorage(): void {
    console.log('☢️ Nuclear option: Clearing ALL localStorage...');
    const keyCount = localStorage.length;
    localStorage.clear();
    console.log(`💥 Cleared ${keyCount} localStorage keys.`);
  }
  
  /**
   * Get all localStorage keys for debugging
   */
  static getAllKeys(): string[] {
    return Object.keys(localStorage);
  }
  
  /**
   * Get master data related keys for debugging
   */
  static getMasterDataKeys(): string[] {
    return Object.keys(localStorage).filter(key => 
      key.includes('master_data') || 
      key.includes('custom_') ||
      key.includes('pricing') ||
      key.includes('membership')
    );
  }
}

// Auto-execute cleanup on import
LocalStorageCleaner.clearAllMasterData();