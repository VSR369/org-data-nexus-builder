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

        // Fallback to pricing_configs table
        const { data: pricingData, error: pricingError } = await supabase
          .from('pricing_configs')
          .select('country, organization_type, entity_type')
          .order('country, organization_type, entity_type');

        if (pricingError) {
          console.error('❌ Error fetching pricing configs:', pricingError);
          throw pricingError;
        }

        console.log('📊 Raw pricing data:', pricingData);

        if (pricingData && pricingData.length > 0) {
          // Extract unique countries
          const uniqueCountries = Array.from(
            new Set(pricingData.map(item => item.country))
          ).map(countryCode => {
            // Map country codes to names
            const countryMap: { [key: string]: string } = {
              'IN': 'India',
              'US': 'United States',
              'AE': 'United Arab Emirates',
              'GB': 'United Kingdom',
              'CA': 'Canada',
              'AU': 'Australia',
              'DE': 'Germany',
              'FR': 'France',
              'JP': 'Japan',
              'CN': 'China',
              'BR': 'Brazil',
              'MX': 'Mexico',
              'SG': 'Singapore',
              'MY': 'Malaysia',
              'TH': 'Thailand',
              'ID': 'Indonesia',
              'PH': 'Philippines',
              'VN': 'Vietnam',
              'KR': 'South Korea',
              'TW': 'Taiwan'
            };
            
            return {
              name: countryMap[countryCode] || countryCode,
              code: countryCode
            };
          });

          // Extract unique organization types
          const uniqueOrgTypes = Array.from(
            new Set(pricingData.map(item => item.organization_type))
          );

          // Extract unique entity types
          const uniqueEntityTypes = Array.from(
            new Set(pricingData.map(item => item.entity_type))
          );

          setCountries(uniqueCountries);
          setOrganizationTypes(uniqueOrgTypes);
          setEntityTypes(uniqueEntityTypes);

          console.log('✅ Master data loaded successfully:');
          console.log('📍 Countries:', uniqueCountries);
          console.log('🏢 Organization Types:', uniqueOrgTypes);
          console.log('🏛️ Entity Types:', uniqueEntityTypes);
        } else {
          console.warn('⚠️ No pricing config data found');
          // Set default fallback data
          setCountries([{ name: 'India', code: 'IN' }]);
          setOrganizationTypes(['MSME']);
          setEntityTypes(['Commercial']);
        }
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