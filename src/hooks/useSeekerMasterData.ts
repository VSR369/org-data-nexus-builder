
import { useState, useEffect } from 'react';
import { Country, IndustrySegment } from '@/types/seekerRegistration';
import { countriesDataManager } from '@/utils/sharedDataManagers';
import { DataManager } from '@/utils/dataManager';
import { industrySegmentDataManager } from '@/components/master-data/industry-segments/industrySegmentDataManager';

// Data manager for entity types
const entityTypeDataManager = new DataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: ['Commercial', 'Non-Profit Organization', 'Society', 'Trust'],
  version: 1
});

export const useSeekerMasterData = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);

  // Load master data
  useEffect(() => {
    const loadedCountries = countriesDataManager.loadData();
    const loadedIndustrySegmentData = industrySegmentDataManager.loadData();
    const loadedEntityTypes = entityTypeDataManager.loadData();

    console.log('🔍 SeekerRegistration - Loaded industry segment data from master data:', loadedIndustrySegmentData);
    console.log('🔍 SeekerRegistration - Loaded countries from master data:', loadedCountries);
    console.log('🔍 SeekerRegistration - Loaded entity types from master data:', loadedEntityTypes);

    setCountries(loadedCountries);
    setIndustrySegments(loadedIndustrySegmentData.industrySegments || []);
    setEntityTypes(loadedEntityTypes);
  }, []);

  return {
    countries,
    industrySegments,
    entityTypes
  };
};
