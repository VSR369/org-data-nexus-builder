import { useState, useEffect } from 'react';
import { supabaseMasterDataService, MasterDataItem } from '@/services/SupabaseMasterDataService';
import { masterDataMigrationService } from '@/services/MasterDataMigrationService';

export interface UseMasterDataResult {
  data: MasterDataItem[];
  loading: boolean;
  error: string | null;
  saveData: (items: MasterDataItem[]) => Promise<boolean>;
  addItem: (item: MasterDataItem) => Promise<boolean>;
  updateItem: (id: string, item: MasterDataItem) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export const useMasterData = (tableName: string): UseMasterDataResult => {
  const [data, setData] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure migration is complete before loading data
      if (!masterDataMigrationService.isMigrationComplete()) {
        await masterDataMigrationService.migrateAllMasterData();
      }
      
      const items = await supabaseMasterDataService.getItems(tableName);
      setData(items);
    } catch (err) {
      console.error(`Error loading ${tableName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tableName]);

  const saveData = async (items: MasterDataItem[]): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await supabaseMasterDataService.saveItems(tableName, items);
      if (success) {
        setData(items);
      }
      return success;
    } catch (err) {
      console.error(`Error saving ${tableName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to save data');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: MasterDataItem): Promise<boolean> => {
    try {
      const success = await supabaseMasterDataService.addItem(tableName, item);
      if (success) {
        await loadData(); // Refresh data
      }
      return success;
    } catch (err) {
      console.error(`Error adding item to ${tableName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
      return false;
    }
  };

  const updateItem = async (id: string, item: MasterDataItem): Promise<boolean> => {
    try {
      const success = await supabaseMasterDataService.updateItem(tableName, id, item);
      if (success) {
        await loadData(); // Refresh data
      }
      return success;
    } catch (err) {
      console.error(`Error updating item in ${tableName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
      return false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const success = await supabaseMasterDataService.deleteItem(tableName, id);
      if (success) {
        await loadData(); // Refresh data
      }
      return success;
    } catch (err) {
      console.error(`Error deleting item from ${tableName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      return false;
    }
  };

  const refresh = async (): Promise<void> => {
    await loadData();
  };

  return {
    data,
    loading,
    error,
    saveData,
    addItem,
    updateItem,
    deleteItem,
    refresh
  };
};

// Convenience hooks for specific master data types
export const useCountries = () => useMasterData('master_countries');
export const useCurrencies = () => useMasterData('master_currencies');
export const useOrganizationTypes = () => useMasterData('master_organization_types');
export const useEntityTypes = () => useMasterData('master_entity_types');
export const useDepartments = () => useMasterData('master_departments');
export const useIndustrySegments = () => useMasterData('master_industry_segments');
export const useCompetencyCapabilities = () => useMasterData('master_competency_capabilities');
export const useEngagementModels = () => useMasterData('master_engagement_models');
export const useChallengeStatuses = () => useMasterData('master_challenge_statuses');
export const useSolutionStatuses = () => useMasterData('master_solution_statuses');
export const useRewardTypes = () => useMasterData('master_reward_types');
export const useCommunicationTypes = () => useMasterData('master_communication_types');