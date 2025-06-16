
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

const industrySegmentsDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_industry_segments',
  defaultData: [],
  version: 1
});

const entityTypesDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: ['Commercial', 'Non-Profit Organization', 'Society', 'Trust'],
  version: 1
});

export const useSeekerMasterData = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const [industrySegments, setIndustrySegments] = useState<string[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const loadedCountries = countriesDataManager.loadData();
        setCountries(loadedCountries);
        
        const loadedOrgTypes = organizationTypesDataManager.loadData();
        setOrganizationTypes(loadedOrgTypes);

        const loadedIndustrySegments = industrySegmentsDataManager.loadData();
        setIndustrySegments(loadedIndustrySegments);

        const loadedEntityTypes = entityTypesDataManager.loadData();
        setEntityTypes(loadedEntityTypes);
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
    industrySegments,
    entityTypes,
    isLoading
  };
};
