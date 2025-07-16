import { supabase } from '@/integrations/supabase/client';
import { MasterDataSeeder } from './MasterDataSeeder';

export class DataMigrationService {
  static async runCompleteMigration(): Promise<void> {
    console.log('🚀 Starting complete migration process...');
    try {
      await MasterDataSeeder.seedAllMasterData();
      console.log('✅ Migration completed successfully');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}