// Custom Data Restoration Utility - Restore all custom master data and set custom-only mode

import { MasterDataRestoreProcessor } from './masterDataRestoreProcessor';

export class CustomDataRestoration {
  
  static async restoreAllCustomDataOnly() {
    console.log('🔄 === RESTORING CUSTOM MASTER DATA (CUSTOM-ONLY MODE) ===');
    
    // Set to custom-only mode to prevent default data from showing
    localStorage.setItem('master_data_mode', 'custom_only');
    console.log('🎯 Set master data mode to: custom_only');
    
    // Clear any cached default data that might interfere
    const defaultDataKeys = Object.keys(localStorage).filter(key => 
      key.includes('default_') || 
      key.includes('fallback_') ||
      key.includes('_cache')
    );
    
    defaultDataKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🗑️ Cleared cached data: ${key}`);
    });
    
    // Restore all custom master data
    const restorationResult = await MasterDataRestoreProcessor.restoreAllCustomData();
    
    // Log restoration summary
    console.log('📊 CUSTOM DATA RESTORATION COMPLETE:');
    console.log(`✅ Custom data categories restored: ${restorationResult.customDataFound.length}`);
    console.log(`📋 Total custom configurations: ${restorationResult.totalCustomConfigurations}`);
    
    if (restorationResult.customDataFound.length > 0) {
      console.log('🎯 Restored custom data for:');
      restorationResult.customDataFound.forEach(key => {
        console.log(`  - ${key.replace('master_data_', '')}`);
      });
    }
    
    if (restorationResult.emptyData.length > 0) {
      console.log('⚠️ No custom data found for:');
      restorationResult.emptyData.forEach(key => {
        console.log(`  - ${key.replace('master_data_', '')}`);
      });
    }
    
    // Clear any remaining default/fallback data
    this.clearDefaultDataInterference();
    
    console.log('🔄 === CUSTOM DATA RESTORATION COMPLETED ===');
    return restorationResult;
  }
  
  static clearDefaultDataInterference() {
    console.log('🧹 Clearing default data interference...');
    
    // Remove any keys that might cause default data to show
    const interferingKeys = [
      'default_pricing_configs',
      'fallback_engagement_models', 
      'cached_master_data',
      'temporary_defaults',
      'backup_configurations'
    ];
    
    interferingKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed interfering data: ${key}`);
      }
    });
    
    // Clear session storage that might have cached defaults
    sessionStorage.clear();
    console.log('🗑️ Cleared session storage cache');
  }
  
  static validateCustomOnlyMode() {
    const mode = localStorage.getItem('master_data_mode');
    console.log(`🔍 Current master data mode: ${mode}`);
    
    if (mode !== 'custom_only') {
      console.log('⚠️ Mode is not custom_only, setting it now...');
      localStorage.setItem('master_data_mode', 'custom_only');
    }
    
    return mode === 'custom_only';
  }
}

// Execute restoration immediately
CustomDataRestoration.restoreAllCustomDataOnly().then(result => {
  console.log('🎉 Custom data restoration completed successfully!');
  
  // Reload the page to ensure all components use custom data
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}).catch(error => {
  console.error('❌ Error during custom data restoration:', error);
});