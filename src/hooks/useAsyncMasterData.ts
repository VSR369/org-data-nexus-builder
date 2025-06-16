
import { useState, useEffect } from 'react';
import { asyncCountriesDataManager, asyncOrganizationTypesDataManager, asyncEntityTypesDataManager } from '@/utils/asyncSharedDataManagers';
import { Country } from '@/types/seekerRegistration';

interface AsyncMasterDataState {
  countries: Country[];
  organizationTypes: string[];
  entityTypes: string[];
  loading: boolean;
  error: string | null;
  hasData: boolean;
}

export const useAsyncMasterData = () => {
  const [state, setState] = useState<AsyncMasterDataState>({
    countries: [],
    organizationTypes: [],
    entityTypes: [],
    loading: true,
    error: null,
    hasData: false
  });

  const loadData = async () => {
    console.log('🔄 useAsyncMasterData: Loading master data...');
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [countries, organizationTypes, entityTypes] = await Promise.all([
        asyncCountriesDataManager.loadData(),
        asyncOrganizationTypesDataManager.loadData(),
        asyncEntityTypesDataManager.loadData()
      ]);

      const hasData = countries.length > 0 || organizationTypes.length > 0 || entityTypes.length > 0;

      setState({
        countries,
        organizationTypes,
        entityTypes,
        loading: false,
        error: null,
        hasData
      });

      console.log('✅ useAsyncMasterData: Master data loaded successfully');
      console.log('📊 Data status:', { 
        countries: countries.length, 
        organizationTypes: organizationTypes.length,
        entityTypes: entityTypes.length,
        hasData
      });

    } catch (error) {
      console.error('❌ useAsyncMasterData: Error loading master data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load master data'
      }));
    }
  };

  const saveCountries = async (countries: Country[]) => {
    try {
      await asyncCountriesDataManager.saveData(countries);
      setState(prev => ({ ...prev, countries }));
    } catch (error) {
      console.error('❌ Error saving countries:', error);
      throw error;
    }
  };

  const saveOrganizationTypes = async (types: string[]) => {
    try {
      await asyncOrganizationTypesDataManager.saveData(types);
      setState(prev => ({ ...prev, organizationTypes: types }));
    } catch (error) {
      console.error('❌ Error saving organization types:', error);
      throw error;
    }
  };

  const saveEntityTypes = async (types: string[]) => {
    try {
      await asyncEntityTypesDataManager.saveData(types);
      setState(prev => ({ ...prev, entityTypes: types }));
    } catch (error) {
      console.error('❌ Error saving entity types:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    ...state,
    refetch: loadData,
    saveCountries,
    saveOrganizationTypes,
    saveEntityTypes
  };
};
