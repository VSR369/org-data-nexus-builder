import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { supabaseMasterDataService } from '@/services/SupabaseMasterDataService';

export interface CountryOption {
  name: string;
  code: string;
}

export const useSupabaseMasterData = () => {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        console.log('🔍 Fetching master data from Supabase...');
        setIsLoading(true);
        setError(null);

        // Try to fetch from dedicated master data tables first
        const [countriesData, orgTypesData, entityTypesData] = await Promise.all([
          supabaseMasterDataService.getCountries(),
          supabaseMasterDataService.getOrganizationTypes(),
          supabaseMasterDataService.getEntityTypes()
        ]);

        if (countriesData.length > 0 || orgTypesData.length > 0 || entityTypesData.length > 0) {
          // Use data from master data tables
          const countries = countriesData.map(c => ({ 
            name: c.name, 
            code: c.code || c.name.substring(0, 2).toUpperCase() 
          }));
          
          setCountries(countries);
          setOrganizationTypes(orgTypesData.map(o => o.name));
          setEntityTypes(entityTypesData.map(e => e.name));
          
          console.log('✅ Master data loaded from dedicated tables:');
          console.log('📍 Countries:', countries);
          console.log('🏢 Organization Types:', orgTypesData.map(o => o.name));
          console.log('🏛️ Entity Types:', entityTypesData.map(e => e.name));
          
          return;
        }

        // Since pricing_configs table is removed, use default fallback data
        console.warn('⚠️ Pricing configs table removed - using fallback data');
        setCountries([
          { name: 'India', code: 'IN' },
          { name: 'United States', code: 'US' },
          { name: 'United Arab Emirates', code: 'AE' }
        ]);
        setOrganizationTypes(['MSME', 'Startup', 'Corporate']);
        setEntityTypes(['Commercial', 'Non-profit', 'Government']);
      } catch (err) {
        console.error('❌ Error fetching master data:', err);
        setError('Failed to load master data');
        
        // Set default fallback data on error
        setCountries([{ name: 'India', code: 'IN' }]);
        setOrganizationTypes(['MSME']);
        setEntityTypes(['Commercial']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  return {
    countries,
    organizationTypes, 
    entityTypes,
    isLoading,
    error
  };
};