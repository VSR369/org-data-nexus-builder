
import { useState, useEffect } from 'react';
import { LegacyDataManager } from '@/utils/core/DataManager';
import { Country } from '@/types/seekerRegistration';

const countriesDataManager = new LegacyDataManager<Country[]>({
  key: 'master_data_countries',
  defaultData: [],
  version: 1
});

const organizationTypesDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_organization_types',
  defaultData: [],
  version: 1
});

export const useSeekerMasterData = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const loadedCountries = countriesDataManager.loadData();
        setCountries(loadedCountries);
        
        const loadedOrgTypes = organizationTypesDataManager.loadData();
        setOrganizationTypes(loadedOrgTypes);
      } catch (error) {
        console.error('Error loading seeker master data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    countries,
    organizationTypes,
    isLoading
  };
};
