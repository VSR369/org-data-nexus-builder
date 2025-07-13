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
 * Get all pricing configurations - Supabase only (no fallbacks)
 */
export async function getPricingConfigsAsync(): Promise<PricingConfig[]> {
  console.log('🔍 Getting pricing configurations from Supabase (single source of truth)...');
  
  try {
    const { data, error } = await supabase
      .from('pricing_configs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    const configs = data ? data.map(mapDatabaseToConfig) : [];
    console.log('✅ Loaded from Supabase:', configs.length);
    return configs;
    
  } catch (error) {
    console.error('❌ Error loading from Supabase:', error);
    throw error;
  }
}

/**
 * Synchronous version - returns empty array, forces async loading
 */
export const getPricingConfigs = (): PricingConfig[] => {
  console.log('⚠️ getPricingConfigs (sync) is deprecated. Use getPricingConfigsAsync() instead.');
  console.log('🔍 Returning empty array - use async version for Supabase data');
  return [];
};

/**
 * Save pricing configurations to Supabase only (no localStorage fallback)
 */
export async function savePricingConfigsAsync(configs: PricingConfig[]): Promise<void> {
  console.log('💾 Saving pricing configurations to Supabase (single source of truth):', configs.length);
  
  try {
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
    
  } catch (error: any) {
    console.error('❌ Error saving to Supabase:', error);
    throw new Error(error.message || 'Failed to save to database');
  }
}

/**
 * Save pricing configurations (deprecated - use async version)
 */
export const savePricingConfigs = (configs: PricingConfig[]): void => {
  console.log('⚠️ savePricingConfigs (sync) is deprecated. Use savePricingConfigsAsync() instead.');
  
  // Trigger async save to Supabase
  savePricingConfigsAsync(configs).catch(error => {
    console.error('❌ Supabase save failed:', error);
  });
};

/**
 * Save single pricing configuration (deprecated)
 */
export const savePricingConfig = (config: PricingConfig): void => {
  console.log('⚠️ savePricingConfig is deprecated. Use savePricingConfigsAsync() with full config array instead.');
  
  // This method is deprecated as we use Supabase-only approach
  savePricingConfigsAsync([config]).catch(error => {
    console.error('❌ Single config save failed:', error);
  });
};

/**
 * Delete pricing configuration from Supabase only
 */
export const deletePricingConfigFromDatabase = async (configId: string): Promise<void> => {
  console.log(`🗑️ Deleting config from Supabase: ${configId}`);
  
  try {
    const { error } = await supabase
      .from('pricing_configs')
      .delete()
      .eq('config_id', configId);

    if (error) {
      console.error('❌ Error deleting from Supabase:', error);
      throw error;
    }

    console.log('✅ Configuration deleted from Supabase');
    
  } catch (error) {
    console.error('❌ Error in delete operation:', error);
    throw error;
  }
};

/**
 * Delete pricing configuration (deprecated)
 */
export const deletePricingConfig = (id: string): void => {
  console.log('⚠️ deletePricingConfig is deprecated. Use deletePricingConfigFromDatabase() instead.');
  
  // Trigger database deletion
  deletePricingConfigFromDatabase(id).catch(error => {
    console.error('❌ Database deletion failed:', error);
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