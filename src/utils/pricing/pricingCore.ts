// Core Pricing Operations with Supabase Integration
import { PricingConfig } from '@/types/pricing';
import { supabase } from '@/integrations/supabase/client';
import { defaultPricingConfigs } from './pricingDefaults';

// Enhanced configuration storage key for localStorage backup
const CUSTOM_PRICING_CONFIGS_KEY = 'custom_pricingConfigs';
const DELETED_CONFIGS_KEY = 'pricing_deleted_configs';

// Database mapping functions
const mapConfigToDatabase = (config: PricingConfig) => ({
  config_id: config.id,
  country: config.country,
  currency: config.currency || '',
  organization_type: config.organizationType,
  entity_type: config.entityType,
  engagement_model: config.engagementModel,
  quarterly_fee: config.quarterlyFee || null,
  half_yearly_fee: config.halfYearlyFee || null,
  annual_fee: config.annualFee || null,
  platform_fee_percentage: config.platformFeePercentage || null,
  membership_status: config.membershipStatus,
  discount_percentage: config.discountPercentage || null,
  internal_paas_pricing: JSON.parse(JSON.stringify(config.internalPaasPricing || [])),
  version: config.version || 1
});

const mapDatabaseToConfig = (dbRow: any): PricingConfig => ({
  id: dbRow.config_id,
  country: dbRow.country,
  currency: dbRow.currency,
  organizationType: dbRow.organization_type,
  entityType: dbRow.entity_type,
  engagementModel: dbRow.engagement_model,
  quarterlyFee: dbRow.quarterly_fee,
  halfYearlyFee: dbRow.half_yearly_fee,
  annualFee: dbRow.annual_fee,
  platformFeePercentage: dbRow.platform_fee_percentage,
  membershipStatus: dbRow.membership_status,
  discountPercentage: dbRow.discount_percentage,
  internalPaasPricing: dbRow.internal_paas_pricing || [],
  version: dbRow.version || 1,
  createdAt: dbRow.created_at ? new Date(dbRow.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
});

/**
 * Get all pricing configurations with Supabase integration
 */
export async function getPricingConfigsAsync(): Promise<PricingConfig[]> {
  console.log('🔍 Getting pricing configurations from Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('pricing_configs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    if (data && data.length > 0) {
      const configs = data.map(mapDatabaseToConfig);
      console.log('✅ Loaded from Supabase:', configs.length);
      
      // Also save to localStorage as backup
      localStorage.setItem(CUSTOM_PRICING_CONFIGS_KEY, JSON.stringify(configs));
      return configs;
    }
  } catch (error) {
    console.error('❌ Error loading from Supabase:', error);
  }

  // Fallback to localStorage
  console.log('🔄 Falling back to localStorage...');
  const localConfigs = JSON.parse(localStorage.getItem(CUSTOM_PRICING_CONFIGS_KEY) || '[]');
  if (localConfigs.length > 0) {
    console.log('✅ Loaded from localStorage:', localConfigs.length);
    return localConfigs;
  }

  // Final fallback to defaults
  console.log('📋 Using default configurations as final fallback');
  return defaultPricingConfigs;
}

/**
 * Synchronous version for backward compatibility
 */
export const getPricingConfigs = (): PricingConfig[] => {
  console.log('🔍 Getting pricing configurations (sync)...');
  
  // Try localStorage first for immediate response
  const localConfigs = JSON.parse(localStorage.getItem(CUSTOM_PRICING_CONFIGS_KEY) || '[]');
  if (localConfigs.length > 0) {
    console.log('✅ Loaded from localStorage (sync):', localConfigs.length);
    return localConfigs;
  }

  // If no local data, trigger async load and return defaults for now
  getPricingConfigsAsync().then(configs => {
    console.log('🔄 Async load completed, configs will be available on next call');
  }).catch(error => {
    console.error('❌ Async load failed:', error);
  });

  // Return defaults for immediate use
  console.log('📋 Using default configurations for immediate response');
  return defaultPricingConfigs;
};

/**
 * Save pricing configurations to Supabase with localStorage backup
 */
export async function savePricingConfigsAsync(configs: PricingConfig[]): Promise<void> {
  console.log('💾 Saving pricing configurations to Supabase:', configs.length);
  
  try {
    // Save to Supabase
    const dbConfigs = configs.map(mapConfigToDatabase);
    
    // Delete existing configs and insert new ones (replace all)
    const { error: deleteError } = await supabase
      .from('pricing_configs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError && deleteError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is OK
      console.error('❌ Error deleting existing configs:', deleteError);
      throw new Error(`Delete failed: ${deleteError.message}`);
    }

    if (dbConfigs.length > 0) {
      const { error: insertError } = await supabase
        .from('pricing_configs')
        .insert(dbConfigs);

      if (insertError) {
        console.error('❌ Error inserting configs to Supabase:', insertError);
        throw new Error(`Insert failed: ${insertError.message}`);
      }
    }

    console.log('✅ Configurations saved to Supabase successfully');
    
    // Also save to localStorage as backup only after Supabase success
    localStorage.setItem(CUSTOM_PRICING_CONFIGS_KEY, JSON.stringify(configs));
    
  } catch (error: any) {
    console.error('❌ Error saving to Supabase:', error);
    
    // Save to localStorage as fallback
    localStorage.setItem(CUSTOM_PRICING_CONFIGS_KEY, JSON.stringify(configs));
    console.log('💾 Saved to localStorage as fallback');
    
    // Re-throw the error so the UI can handle it
    throw new Error(error.message || 'Failed to save to database');
  }
}

/**
 * Save pricing configurations (backward compatibility)
 */
export const savePricingConfigs = (configs: PricingConfig[]): void => {
  console.log('💾 Saving pricing configurations (sync):', configs.length);
  
  // Save to localStorage immediately for sync operation
  localStorage.setItem(CUSTOM_PRICING_CONFIGS_KEY, JSON.stringify(configs));
  
  // Also trigger async save to Supabase in background
  savePricingConfigsAsync(configs).catch(error => {
    console.error('⚠️ Background Supabase save failed:', error);
  });
};

/**
 * Save single pricing configuration
 */
export const savePricingConfig = (config: PricingConfig): void => {
  console.log(`💾 Saving single config: ${config.engagementModel} (${config.membershipStatus})`);
  
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

/**
 * Delete pricing configuration permanently from Supabase
 */
export const deletePricingConfigFromDatabase = async (configId: string): Promise<void> => {
  console.log(`🗑️ Permanently deleting config from database: ${configId}`);
  
  try {
    const { error } = await supabase
      .from('pricing_configs')
      .delete()
      .eq('config_id', configId);

    if (error) {
      console.error('❌ Error deleting from Supabase:', error);
      throw error;
    }

    console.log('✅ Configuration permanently deleted from database');
    
    // Also remove from localStorage
    const localConfigs = JSON.parse(localStorage.getItem(CUSTOM_PRICING_CONFIGS_KEY) || '[]');
    const filteredConfigs = localConfigs.filter((c: PricingConfig) => c.id !== configId);
    localStorage.setItem(CUSTOM_PRICING_CONFIGS_KEY, JSON.stringify(filteredConfigs));
    
  } catch (error) {
    console.error('❌ Error in permanent delete operation:', error);
    throw error;
  }
};

/**
 * Delete pricing configuration (backward compatibility)
 */
export const deletePricingConfig = (id: string): void => {
  console.log(`🗑️ Deleting config: ${id}`);
  
  const configs = getPricingConfigs();
  const filteredConfigs = configs.filter(c => c.id !== id);
  savePricingConfigs(filteredConfigs);
  
  // Also trigger permanent database deletion
  deletePricingConfigFromDatabase(id).catch(error => {
    console.error('⚠️ Background database deletion failed:', error);
  });
};

/**
 * Initialize pricing configurations from Supabase on app load
 */
export const initializePricingConfigs = async (): Promise<void> => {
  console.log('🎯 Initializing pricing configurations...');
  
  try {
    const configs = await getPricingConfigsAsync();
    console.log('✅ Pricing configurations initialized:', configs.length);
  } catch (error) {
    console.error('❌ Failed to initialize pricing configurations:', error);
  }
};

// Reset deleted configurations tracking (for admin use)
export const resetDeletedConfigsTracking = (): void => {
  localStorage.removeItem(DELETED_CONFIGS_KEY);
  console.log('🔄 Reset deleted configurations tracking');
};