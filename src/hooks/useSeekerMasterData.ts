
import { useState, useEffect } from 'react';
import { Country } from '@/types/seekerRegistration';
import { IndustrySegment } from '@/types/industrySegments';
import { useSupabaseMasterData } from '@/hooks/useSupabaseMasterData';
import { useOrganizationTypes, useEntityTypes, useIndustrySegments } from '@/hooks/useMasterDataCRUD';

export const useSeekerMasterData = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Use Supabase hooks for all master data
  const { countries: supabaseCountries } = useSupabaseMasterData();
  const { items: organizationTypesItems } = useOrganizationTypes();
  const { items: entityTypesItems } = useEntityTypes();
  const { items: industrySegmentsItems } = useIndustrySegments();

  // Convert to expected formats
  const countries: Country[] = supabaseCountries.map(country => ({
    id: country.name,
    name: country.name,
    code: country.code,
    region: 'Unknown'
  }));
  
  const organizationTypes = organizationTypesItems.map(item => item.name);
  const entityTypes = entityTypesItems.map(item => item.name);
  const industrySegments: IndustrySegment[] = industrySegmentsItems.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    industrySegment: item.name
  }));

  useEffect(() => {
    // Set loading to false once we have data from Supabase
    if (supabaseCountries.length > 0 || organizationTypesItems.length > 0) {
      setIsLoading(false);
      console.log('✅ Seeker master data loaded from Supabase');
      console.log('📍 Countries:', countries.length);
      console.log('🏢 Organization types:', organizationTypes.length);
      console.log('🏭 Industry segments:', industrySegments.length);
      console.log('🏛️ Entity types:', entityTypes.length);
    }
  }, [supabaseCountries, organizationTypesItems, entityTypesItems, industrySegmentsItems]);

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
