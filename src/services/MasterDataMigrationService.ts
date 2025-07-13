import { supabase } from '@/integrations/supabase/client';

interface MasterDataRecord {
  id?: string;
  name: string;
  code?: string;
  symbol?: string;
  description?: string;
  category?: string;
  is_user_created?: boolean;
  created_by?: string;
  version?: number;
}

export class MasterDataMigrationService {
  private static instance: MasterDataMigrationService;

  static getInstance(): MasterDataMigrationService {
    if (!MasterDataMigrationService.instance) {
      MasterDataMigrationService.instance = new MasterDataMigrationService();
    }
    return MasterDataMigrationService.instance;
  }

  private constructor() {}

  async migrateAllMasterData(): Promise<void> {
    console.log('🔄 Starting master data migration from localStorage to Supabase...');
    
    const migrationFlag = localStorage.getItem('supabase_master_data_migration_complete');
    if (migrationFlag === 'true') {
      console.log('✅ Master data migration already completed');
      return;
    }

    try {
      // Define the migration mapping
      const migrations = [
        { key: 'master_data_organization_types', table: 'master_organization_types', fields: ['name'] },
        { key: 'master_data_entity_types', table: 'master_entity_types', fields: ['name'] },
        { key: 'master_data_departments', table: 'master_departments', fields: ['name'] },
        { key: 'master_data_industry_segments', table: 'master_industry_segments', fields: ['name', 'description'] },
        { key: 'master_data_competency_capabilities', table: 'master_competency_capabilities', fields: ['name', 'description', 'category'] },
        { key: 'master_data_engagement_models', table: 'master_engagement_models', fields: ['name', 'description'] },
        { key: 'master_data_challenge_statuses', table: 'master_challenge_statuses', fields: ['name', 'description'] },
        { key: 'master_data_solution_statuses', table: 'master_solution_statuses', fields: ['name', 'description'] },
        { key: 'master_data_reward_types', table: 'master_reward_types', fields: ['name', 'description'] },
        { key: 'master_data_communication_types', table: 'master_communication_types', fields: ['name', 'description'] },
        { key: 'master_data_countries', table: 'master_countries', fields: ['name', 'code'] },
        { key: 'master_data_currencies', table: 'master_currencies', fields: ['name', 'code', 'symbol'] }
      ];

      let migratedCount = 0;

      for (const migration of migrations) {
        try {
          const success = await this.migrateDataCategory(migration.key, migration.table, migration.fields);
          if (success) {
            migratedCount++;
            console.log(`✅ Migrated ${migration.key} successfully`);
          }
        } catch (error) {
          console.error(`❌ Failed to migrate ${migration.key}:`, error);
        }
      }

      // Mark migration as complete
      localStorage.setItem('supabase_master_data_migration_complete', 'true');
      console.log(`🎉 Master data migration completed! ${migratedCount}/${migrations.length} categories migrated`);

    } catch (error) {
      console.error('❌ Master data migration failed:', error);
    }
  }

  private async migrateDataCategory(localStorageKey: string, tableName: string, fields: string[]): Promise<boolean> {
    try {
      // Check if data exists in localStorage
      const localData = localStorage.getItem(localStorageKey);
      if (!localData) {
        console.log(`📊 No data found in localStorage for ${localStorageKey}`);
        return true; // Not an error, just no data to migrate
      }

      let dataToMigrate: any[] = [];

      try {
        const parsed = JSON.parse(localData);
        
        // Handle different data formats (wrapped vs raw)
        if (Array.isArray(parsed)) {
          dataToMigrate = parsed;
        } else if (parsed.data && Array.isArray(parsed.data)) {
          dataToMigrate = parsed.data;
        } else if (typeof parsed === 'object' && parsed !== null) {
          // Handle single object
          dataToMigrate = [parsed];
        }
      } catch (parseError) {
        console.error(`Failed to parse ${localStorageKey}:`, parseError);
        return false;
      }

      if (dataToMigrate.length === 0) {
        console.log(`📊 No valid data to migrate for ${localStorageKey}`);
        return true;
      }

      // Check if data already exists in Supabase
      const { data: existingData } = await supabase
        .from(tableName as any)
        .select('name');

      const existingNames = new Set(existingData?.map((item: any) => item.name) || []);

      // Prepare records for insertion
      const recordsToInsert: MasterDataRecord[] = [];

      dataToMigrate.forEach((item: any) => {
        if (!item || typeof item !== 'object') return;

        const record: MasterDataRecord = {
          name: item.name || item.title || '',
          is_user_created: item.isUserCreated || false,
          created_by: item.createdBy || 'migration',
          version: 1
        };

        // Add optional fields based on the table structure
        if (fields.includes('code') && item.code) record.code = item.code;
        if (fields.includes('symbol') && item.symbol) record.symbol = item.symbol;
        if (fields.includes('description') && item.description) record.description = item.description;
        if (fields.includes('category') && item.category) record.category = item.category;

        // Only add if name exists and not already in Supabase
        if (record.name && !existingNames.has(record.name)) {
          recordsToInsert.push(record);
        }
      });

      if (recordsToInsert.length === 0) {
        console.log(`📊 All data for ${localStorageKey} already exists in Supabase`);
        return true;
      }

      // Insert records into Supabase
      const { error } = await supabase
        .from(tableName as any)
        .insert(recordsToInsert);

      if (error) {
        console.error(`Failed to insert data into ${tableName}:`, error);
        return false;
      }

      console.log(`✅ Migrated ${recordsToInsert.length} records to ${tableName}`);
      return true;

    } catch (error) {
      console.error(`Migration error for ${tableName}:`, error);
      return false;
    }
  }

  async forceMigration(): Promise<void> {
    localStorage.removeItem('supabase_master_data_migration_complete');
    await this.migrateAllMasterData();
  }

  isMigrationComplete(): boolean {
    return localStorage.getItem('supabase_master_data_migration_complete') === 'true';
  }
}

export const masterDataMigrationService = MasterDataMigrationService.getInstance();