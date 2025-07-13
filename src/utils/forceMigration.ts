import { masterDataMigrationService } from '@/services/MasterDataMigrationService';

// Force migration function for testing
const forceMigration = async () => {
  console.log('🔄 === STARTING MANUAL MIGRATION ===');
  
  // Check localStorage content first
  const localStorageKeys = [
    'master_data_organization_types',
    'master_data_entity_types', 
    'master_data_departments',
    'master_data_industry_segments',
    'master_data_challenge_statuses',
    'master_data_solution_statuses',
    'master_data_reward_types',
    'master_data_communication_types'
  ];
  
  localStorageKeys.forEach(key => {
    const data = localStorage.getItem(key);
    console.log(`📊 ${key}:`, data ? JSON.parse(data) : 'No data');
  });
  
  // Force migration by removing completion flag
  localStorage.removeItem('supabase_master_data_migration_complete');
  
  // Run migration
  await masterDataMigrationService.migrateAllMasterData();
  
  console.log('✅ === MANUAL MIGRATION COMPLETED ===');
};

// Run the migration
forceMigration().catch(console.error);