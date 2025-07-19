
import { useState, useEffect } from 'react';
import { Country } from '@/types/seekerRegistration';
import { IndustrySegment } from '@/types/industrySegments';
import { useSupabaseMasterData } from '@/hooks/useSupabaseMasterData';
import { supabase } from '@/integrations/supabase/client';

export const useSeekerMasterData = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Use Supabase hooks for all master data
  const { countries: supabaseCountries } = useSupabaseMasterData();

  // Convert to expected formats
  const countries: Country[] = supabaseCountries.map(country => ({
    id: country.name,
    name: country.name,
    code: country.code,
    region: 'Unknown'
  }));
  
  const organizationTypes: string[] = [];
  const entityTypes: string[] = [];
  const industrySegments: IndustrySegment[] = [];

  useEffect(() => {
    // Set loading to false once we have data from Supabase
    if (supabaseCountries.length > 0) {
      setIsLoading(false);
      console.log('✅ Seeker master data loaded from Supabase');
      console.log('📍 Countries:', countries.length);
    }
  }, [supabaseCountries]);

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
