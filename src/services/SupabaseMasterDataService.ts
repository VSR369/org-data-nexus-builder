import { supabase } from '@/integrations/supabase/client';

export interface MasterDataItem {
  id?: string;
  name: string;
  code?: string;
  symbol?: string;
  description?: string;
  category?: string;
  is_user_created?: boolean;
  created_by?: string;
  version?: number;
  created_at?: string;
  updated_at?: string;
}

export class SupabaseMasterDataService {
  
  // Generic CRUD operations for all master data tables
  async getItems(tableName: string): Promise<MasterDataItem[]> {
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .order('name');

      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return [];
      }

      return (data as any as MasterDataItem[]) || [];
    } catch (error) {
      console.error(`Failed to fetch ${tableName}:`, error);
      return [];
    }
  }

  async saveItems(tableName: string, items: MasterDataItem[]): Promise<boolean> {
    try {
      // First, delete existing records (for full replacement)
      const { error: deleteError } = await supabase
        .from(tableName as any)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (deleteError) {
        console.error(`Error clearing ${tableName}:`, deleteError);
        return false;
      }

      // Insert new records
      if (items.length > 0) {
        const recordsToInsert = items.map(item => ({
          name: item.name,
          code: item.code,
          symbol: item.symbol,
          description: item.description,
          category: item.category,
          is_user_created: item.is_user_created || false,
          created_by: item.created_by || 'user',
          version: 1
        }));

        const { error: insertError } = await supabase
          .from(tableName as any)
          .insert(recordsToInsert);

        if (insertError) {
          console.error(`Error inserting into ${tableName}:`, insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(`Failed to save ${tableName}:`, error);
      return false;
    }
  }

  async addItem(tableName: string, item: MasterDataItem): Promise<boolean> {
    try {
      const recordToInsert = {
        name: item.name,
        code: item.code,
        symbol: item.symbol,
        description: item.description,
        category: item.category,
        is_user_created: item.is_user_created || true,
        created_by: item.created_by || 'user',
        version: 1
      };

      const { error } = await supabase
        .from(tableName as any)
        .insert([recordToInsert]);

      if (error) {
        console.error(`Error adding item to ${tableName}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Failed to add item to ${tableName}:`, error);
      return false;
    }
  }

  async updateItem(tableName: string, id: string, item: MasterDataItem): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .update({
          name: item.name,
          code: item.code,
          symbol: item.symbol,
          description: item.description,
          category: item.category,
          is_user_created: item.is_user_created,
          created_by: item.created_by
        })
        .eq('id', id);

      if (error) {
        console.error(`Error updating item in ${tableName}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Failed to update item in ${tableName}:`, error);
      return false;
    }
  }

  async deleteItem(tableName: string, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting item from ${tableName}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Failed to delete item from ${tableName}:`, error);
      return false;
    }
  }

  // Specific methods for each master data type
  async getCountries(): Promise<MasterDataItem[]> {
    return this.getItems('master_countries');
  }

  async saveCountries(countries: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_countries', countries);
  }

  async getCurrencies(): Promise<MasterDataItem[]> {
    return this.getItems('master_currencies');
  }

  async saveCurrencies(currencies: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_currencies', currencies);
  }

  async getOrganizationTypes(): Promise<MasterDataItem[]> {
    return this.getItems('master_organization_types');
  }

  async saveOrganizationTypes(types: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_organization_types', types);
  }

  async getEntityTypes(): Promise<MasterDataItem[]> {
    return this.getItems('master_entity_types');
  }

  async saveEntityTypes(types: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_entity_types', types);
  }

  async getDepartments(): Promise<MasterDataItem[]> {
    return this.getItems('master_departments');
  }

  async saveDepartments(departments: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_departments', departments);
  }

  async getIndustrySegments(): Promise<MasterDataItem[]> {
    return this.getItems('master_industry_segments');
  }

  async saveIndustrySegments(segments: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_industry_segments', segments);
  }

  async getCompetencyCapabilities(): Promise<MasterDataItem[]> {
    return this.getItems('master_competency_capabilities');
  }

  async saveCompetencyCapabilities(capabilities: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_competency_capabilities', capabilities);
  }

  async getEngagementModels(): Promise<MasterDataItem[]> {
    return this.getItems('master_engagement_models');
  }

  async saveEngagementModels(models: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_engagement_models', models);
  }

  async getChallengeStatuses(): Promise<MasterDataItem[]> {
    return this.getItems('master_challenge_statuses');
  }

  async saveChallengeStatuses(statuses: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_challenge_statuses', statuses);
  }

  async getSolutionStatuses(): Promise<MasterDataItem[]> {
    return this.getItems('master_solution_statuses');
  }

  async saveSolutionStatuses(statuses: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_solution_statuses', statuses);
  }

  async getRewardTypes(): Promise<MasterDataItem[]> {
    return this.getItems('master_reward_types');
  }

  async saveRewardTypes(types: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_reward_types', types);
  }

  async getCommunicationTypes(): Promise<MasterDataItem[]> {
    return this.getItems('master_communication_types');
  }

  async saveCommunicationTypes(types: MasterDataItem[]): Promise<boolean> {
    return this.saveItems('master_communication_types', types);
  }
}

export const supabaseMasterDataService = new SupabaseMasterDataService();