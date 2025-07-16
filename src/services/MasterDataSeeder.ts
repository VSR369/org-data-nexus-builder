import { supabase } from '@/integrations/supabase/client';

export class MasterDataSeeder {
  static async seedAllMasterData() {
    const result = { success: true, tablesSeeded: [], totalRecords: 0, errors: [] };

    try {
      // Seed pricing tiers
      const tiers = [
        { name: 'Basic', description: 'Entry-level pricing tier', level_order: 1, is_active: true },
        { name: 'Standard', description: 'Standard pricing tier', level_order: 2, is_active: true },
        { name: 'Premium', description: 'Premium pricing tier', level_order: 3, is_active: true },
        { name: 'Enterprise', description: 'Enterprise pricing tier', level_order: 4, is_active: true }
      ];

      const { data: tiersData } = await supabase
        .from('master_pricing_tiers')
        .upsert(tiers, { onConflict: 'name' })
        .select();

      if (tiersData) {
        result.tablesSeeded.push('master_pricing_tiers');
        result.totalRecords += tiersData.length;
      }

      // Seed fee components
      const feeComponents = [
        { name: 'Platform Fee', component_type: 'platform', description: 'Core platform usage fee', is_active: true },
        { name: 'Management Fee', component_type: 'management', description: 'Project management fee', is_active: true },
        { name: 'Consulting Fee', component_type: 'consulting', description: 'Strategic consulting fee', is_active: true }
      ];

      const { data: feesData } = await supabase
        .from('master_fee_components')
        .upsert(feeComponents, { onConflict: 'name,component_type' })
        .select();

      if (feesData) {
        result.tablesSeeded.push('master_fee_components');
        result.totalRecords += feesData.length;
      }

      // Seed advance payment types
      const advanceTypes = [
        { name: 'No Advance', description: 'No advance payment', percentage_of_platform_fee: 0, is_active: true },
        { name: 'Quarter Advance', description: '25% advance payment', percentage_of_platform_fee: 25, is_active: true },
        { name: 'Half Advance', description: '50% advance payment', percentage_of_platform_fee: 50, is_active: true }
      ];

      const { data: advanceData } = await supabase
        .from('master_advance_payment_types')
        .upsert(advanceTypes, { onConflict: 'name' })
        .select();

      if (advanceData) {
        result.tablesSeeded.push('master_advance_payment_types');
        result.totalRecords += advanceData.length;
      }

      console.log(`✅ Seeded ${result.totalRecords} records across ${result.tablesSeeded.length} tables`);

    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : 'Seeding failed');
    }

    return result;
  }

  static async checkSeedingStatus() {
    const tables = ['master_pricing_tiers', 'master_fee_components', 'master_advance_payment_types'] as const;
    const emptyTables = [];
    
    for (const table of tables) {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (!count || count === 0) emptyTables.push(table);
    }

    return { needsSeeding: emptyTables.length > 0, emptyTables };
  }
}