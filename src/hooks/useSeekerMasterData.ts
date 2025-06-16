
import { useState, useEffect } from 'react';
import { LegacyDataManager } from '@/utils/core/DataManager';
import { Country } from '@/types/seekerRegistration';
import { IndustrySegment, IndustrySegmentData } from '@/types/industrySegments';
import { industrySegmentDataManager } from '@/components/master-data/industry-segments/industrySegmentDataManager';

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

const entityTypesDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: ['Commercial', 'Non-Profit Organization', 'Society', 'Trust'],
  version: 1
});

export const useSeekerMasterData = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        console.log('🔍 Loading seeker master data...');
        
        const loadedCountries = countriesDataManager.loadData();
        setCountries(loadedCountries);
        console.log('📍 Loaded countries:', loadedCountries.length);
        
        const loadedOrgTypes = organizationTypesDataManager.loadData();
        setOrganizationTypes(loadedOrgTypes);
        console.log('🏢 Loaded organization types:', loadedOrgTypes.length);

        // Use the industry segment data manager to get the proper data structure
        const industrySegmentData: IndustrySegmentData = industrySegmentDataManager.loadData();
        console.log('📊 Raw industry segment data:', industrySegmentData);
        
        // Extract the industrySegments array from the data structure
        const loadedIndustrySegments = industrySegmentData.industrySegments || [];
        setIndustrySegments(loadedIndustrySegments);
        console.log('🏭 Loaded industry segments:', loadedIndustrySegments.length, loadedIndustrySegments);

        const loadedEntityTypes = entityTypesDataManager.loadData();
        setEntityTypes(loadedEntityTypes);
        console.log('🏛️ Loaded entity types:', loadedEntityTypes.length);
      } catch (error) {
        console.error('❌ Error loading seeker master data:', error);
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

// Export types for convenience
export type { IndustrySegment };
