/**
 * ENHANCED localStorage cleaner - TOTAL ELIMINATION of master data localStorage
 * This ensures Supabase is the ONLY source of truth
 */
export class LocalStorageCleaner {
  /**
   * Remove ALL localStorage keys related to master data - NO EXCEPTIONS
   */
  static clearAllMasterData(): void {
    console.log('🧹 STARTING TOTAL MASTER DATA ELIMINATION FROM LOCALSTORAGE...');
    
    const allMasterDataKeys = [
      // Core master data keys
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
      'master_data_domain_groups_hierarchy',
      'master_data_capability_levels',
      'master_data_challenge_status',
      'master_data_communication_channels',
      'master_data_pricing_configs',
      
      // Custom data keys - ALL VARIANTS
      'custom_countries',
      'custom_currencies',
      'custom_organization_types',
      'custom_organizationTypes',
      'custom_entity_types', 
      'custom_entityTypes',
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
      // PRICING-RELATED KEYS - ALL VARIANTS (COMPLETE REMOVAL)
      'custom_pricing',
      'custom_pricing_data',
      'pricing_data',
      'pricing_config',
      'pricing_configurations',
      'engagement_pricing',
      'membership_pricing',
      'paas_pricing',
      'marketplace_pricing',
      'pricing_backup',
      'pricing_protection',
      'pricing_validation',
      'pricing_log',
      'pricing_mode',
      'pricing_cache',
      'pricing_state',
      'pricing_initialized',
      'last_pricing_sync',
      'pricing_dirty',
      'pricing_temp',
      'pricing_session',
      'custom_events',
      
      // Mode and control keys - ELIMINATE ALL MODE LOGIC
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
      'membership_fees_version',
      
      // Migration and state keys
      'supabase_master_data_migration_complete',
      'indexeddb_migration_complete'
    ];
    
    let removedCount = 0;
    
    // AGGRESSIVE CLEANUP - Check all localStorage keys
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (allMasterDataKeys.includes(key) || 
          key.includes('master_data') || 
          key.includes('custom_') ||
          key.includes('pricing') ||
          key.includes('membership')) {
        localStorage.removeItem(key);
        removedCount++;
        console.log(`🗑️ ELIMINATED: ${key}`);
      }
    });
    
    console.log(`✅ TOTAL MASTER DATA ELIMINATION COMPLETE. Removed ${removedCount} keys.`);
    console.log('🎯 SUPABASE IS NOW THE ONLY SOURCE OF TRUTH FOR ALL MASTER DATA.');
    console.log('🚫 localStorage can NO LONGER be used for master data - SUPABASE ONLY.');
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