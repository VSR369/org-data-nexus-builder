import { supabase } from '@/integrations/supabase/client';
import { MasterDataSeeder } from './MasterDataSeeder';

export class DataMigrationService {
  static async migrateAllConfigurations() {
    const result = {
      success: true,
      migratedConfigurations: 0,
      createdDefaults: 0,
      errors: [],
      warnings: []
    };

    try {
      console.log('🔄 Starting configuration migration...');

      // Ensure master data exists
      const seedingStatus = await MasterDataSeeder.checkSeedingStatus();
      if (seedingStatus.needsSeeding) {
        console.log('🌱 Seeding master data...');
        await MasterDataSeeder.seedAllMasterData();
      }

      // Get existing configurations that need migration
      const { data: configurations } = await supabase
        .from('pricing_configurations')
        .select('*')
        .is('pricing_tier_id', null);

      if (configurations && configurations.length > 0) {
        // Get default values for migration
        const { data: defaultTier } = await supabase
          .from('master_pricing_tiers')
          .select('*')
          .eq('name', 'Standard')
          .single();

        const { data: defaultAdvanceType } = await supabase
          .from('master_advance_payment_types')
          .select('*')
          .eq('name', 'Quarter Advance')
          .single();

        if (defaultTier && defaultAdvanceType) {
          // Migrate configurations
          for (const config of configurations) {
            const { error } = await supabase
              .from('pricing_configurations')
              .update({
                pricing_tier_id: defaultTier.id,
                advance_payment_type_id: defaultAdvanceType.id,
                calculated_platform_fee: config.base_value * 0.15,
                calculated_advance_payment: config.base_value * 0.15 * 0.25
              })
              .eq('id', config.id);

            if (error) {
              result.errors.push(`Failed to migrate ${config.config_name}: ${error.message}`);
            } else {
              result.migratedConfigurations++;
            }
          }
        }
      }

      // Check if we need to create default configurations
      const { count } = await supabase
        .from('pricing_configurations')
        .select('*', { count: 'exact', head: true });

      if (!count || count === 0) {
        result.createdDefaults = 1;
        result.warnings.push('No existing configurations found - system ready for new configurations');
      }

      console.log(`✅ Migration completed: ${result.migratedConfigurations} migrated, ${result.createdDefaults} defaults created`);

    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : 'Migration failed');
    }

    return result;
  }
}