// Core Pricing Operations
import { PricingConfig } from '@/types/pricing';
import { LegacyDataManager } from '../core/DataManager';
import { PricingDataProtection } from '../pricingDataProtection';
import { defaultPricingConfigs } from './pricingDefaults';

const pricingDataManager = new LegacyDataManager<PricingConfig[]>({
  key: 'master_data_pricing_configs',
  defaultData: [],
  version: 4 // Increment version to respect user deletions
});

// Track deleted configurations to prevent auto-recreation
const deletedConfigsManager = new LegacyDataManager<string[]>({
  key: 'master_data_pricing_deleted_configs',
  defaultData: [],
  version: 1
});

export const getPricingConfigs = (): PricingConfig[] => {
  console.log('🔍 Enhanced: Getting pricing configurations...');
  
  try {
    // Dynamic import for enhanced manager
    const { EnhancedPricingDataManager } = eval('require')('../enhancedPricingDataManager');
    return EnhancedPricingDataManager.getAllConfigurations();
  } catch (error) {
    console.error('❌ Enhanced manager failed, using fallback:', error);
    
    // Fallback to original logic
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    if (isCustomMode) {
      const customData = localStorage.getItem('custom_pricing');
      if (customData) {
        try {
          const parsed = JSON.parse(customData);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (parseError) {
          console.error('❌ Failed to parse custom pricing data');
        }
      }
      return [];
    }
    
    const configs = pricingDataManager.loadData();
    return Array.isArray(configs) ? configs : [];
  }
};

export const savePricingConfigs = (configs: PricingConfig[]): void => {
  // Use the protection system for all saves
  console.log('🛡️ Using protected save for pricing configurations');
  const success = PricingDataProtection.safeSave(configs, 'user_configuration');
  
  if (!success) {
    console.error('❌ Protected save failed, attempting fallback save');
    
    // Fallback to original logic if protection fails
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    
    if (isCustomMode) {
      console.log('💾 Fallback: Custom-only mode save');
      localStorage.setItem('custom_pricing', JSON.stringify(configs));
    } else {
      console.log('💾 Fallback: Mixed mode save');
      pricingDataManager.saveData(configs);
    }
  }
};

export const savePricingConfig = (config: PricingConfig): void => {
  console.log(`🛡️ Protected save for single config: ${config.engagementModel} (${config.membershipStatus})`);
  
  const configs = getPricingConfigs();
  const existingIndex = configs.findIndex(c => c.id === config.id);
  
  if (existingIndex >= 0) {
    configs[existingIndex] = config;
    console.log('✏️ Updated existing configuration');
  } else {
    configs.push(config);
    console.log('➕ Added new configuration');
  }
  
  savePricingConfigs(configs);
};

export const deletePricingConfig = (id: string): void => {
  console.log(`🛡️ Protected delete for config: ${id}`);
  
  // Create backup before deletion
  PricingDataProtection.createBackup('before_delete');
  
  const configs = getPricingConfigs();
  const configToDelete = configs.find(c => c.id === id);
  
  if (configToDelete) {
    console.log(`🗑️ Deleting config: ${configToDelete.engagementModel} (${configToDelete.membershipStatus})`);
  }
  
  const filteredConfigs = configs.filter(c => c.id !== id);
  
  const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
  
  if (!isCustomMode) {
    // Track deleted configuration ID to prevent auto-recreation in mixed mode
    const deletedConfigIds = deletedConfigsManager.loadData();
    if (!deletedConfigIds.includes(id)) {
      deletedConfigIds.push(id);
      deletedConfigsManager.saveData(deletedConfigIds);
      console.log('🗑️ Marked config as deleted in mixed mode:', id);
    }
  }
  
  savePricingConfigs(filteredConfigs);
};

// Reset deleted configurations tracking (for admin use)
export const resetDeletedConfigsTracking = (): void => {
  deletedConfigsManager.saveData([]);
  console.log('🔄 Reset deleted configurations tracking');
};