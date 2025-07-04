import { useState, useEffect } from 'react';
import { LegacyDataManager } from '@/utils/core/DataManager';
import { Country } from '@/types/seekerRegistration';
import { IndustrySegment, IndustrySegmentData } from '@/types/industrySegments';
import { industrySegmentDataManager } from '@/components/master-data/industry-segments/industrySegmentDataManager';

// Fallback data for when localStorage is empty or corrupted
const FALLBACK_COUNTRIES: Country[] = [
  { id: 'in', name: 'India', code: 'IN' },
  { id: 'us', name: 'United States', code: 'US' },
  { id: 'gb', name: 'United Kingdom', code: 'GB' },
  { id: 'ca', name: 'Canada', code: 'CA' },
  { id: 'au', name: 'Australia', code: 'AU' },
  { id: 'de', name: 'Germany', code: 'DE' },
  { id: 'fr', name: 'France', code: 'FR' },
  { id: 'jp', name: 'Japan', code: 'JP' },
  { id: 'sg', name: 'Singapore', code: 'SG' },
  { id: 'ke', name: 'Kenya', code: 'KE' }
];

const FALLBACK_ORGANIZATION_TYPES: string[] = [
  'Large Enterprise',
  'Start-up',
  'MSME',
  'Academic Institution',
  'Research Institution',
  'Non-Profit Organization',
  'Government Department',
  'Industry Association',
  'Freelancer/Individual Consultant',
  'Think Tank/Policy Institute'
];

const FALLBACK_ENTITY_TYPES: string[] = [
  'Commercial',
  'Non-Profit Organization',
  'Society',
  'Trust',
  'Partnership',
  'Limited Liability Partnership',
  'Private Limited Company',
  'Public Limited Company'
];

const FALLBACK_INDUSTRY_SEGMENTS: IndustrySegment[] = [
  { id: 'it', industrySegment: 'Information Technology', description: 'Software, Hardware, and IT services' },
  { id: 'bfsi', industrySegment: 'Banking, Financial Services and Insurance', description: 'Financial sector services' },
  { id: 'healthcare', industrySegment: 'Healthcare & Life Sciences', description: 'Medical and pharmaceutical services' },
  { id: 'manufacturing', industrySegment: 'Manufacturing', description: 'Industrial manufacturing and production' },
  { id: 'retail', industrySegment: 'Retail & E-commerce', description: 'Retail and online commerce' },
  { id: 'education', industrySegment: 'Education & Training', description: 'Educational institutions and training' },
  { id: 'energy', industrySegment: 'Energy & Utilities', description: 'Power, oil, gas, and renewable energy' },
  { id: 'transport', industrySegment: 'Transportation & Logistics', description: 'Transport and supply chain' }
];

// Data managers with fallback initialization
const countriesDataManager = new LegacyDataManager<Country[]>({
  key: 'master_data_countries',
  defaultData: FALLBACK_COUNTRIES,
  version: 1
});

const organizationTypesDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_organization_types',
  defaultData: FALLBACK_ORGANIZATION_TYPES,
  version: 1
});

const entityTypesDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: FALLBACK_ENTITY_TYPES,
  version: 1
});

interface InternalMasterDataState {
  countries: Country[];
  organizationTypes: string[];
  industrySegments: IndustrySegment[];
  entityTypes: string[];
  isLoading: boolean;
  hasErrors: boolean;
  errors: string[];
}

export interface MasterDataState extends InternalMasterDataState {
  refreshMasterData: () => void;
}

export const useRobustMasterData = (): MasterDataState => {
  const [state, setState] = useState<InternalMasterDataState>({
    countries: [],
    organizationTypes: [],
    industrySegments: [],
    entityTypes: [],
    isLoading: true,
    hasErrors: false,
    errors: []
  });

  const initializeMasterData = async () => {
    console.log('🔄 === INITIALIZING ROBUST MASTER DATA ===');
    
    try {
      // Use the new unified structure fixer for comprehensive fixes
      const { MasterDataStructureFixer } = await import('@/utils/masterDataStructureFixer');
      const fixResult = MasterDataStructureFixer.fixAllMasterDataStructures();
      
      // Also run the initialization service for any additional fixes
      const { MasterDataInitializationService } = await import('@/services/MasterDataInitializationService');
      const initResult = await MasterDataInitializationService.initializeAllMasterData();
      
      // Combine all fix results
      const allFixed = [...fixResult.results.filter(r => r.wasFixed).map(r => r.key), ...initResult.fixed];
      const allErrors = [...fixResult.errors, ...initResult.errors];
      
      if (allFixed.length > 0) {
        console.log('🔧 Fixed issues:', allFixed);
      }
      
      if (allErrors.length > 0) {
        console.error('❌ Fix errors:', allErrors);
      }

      const errors: string[] = [...allErrors];
      
      // Load countries with fallback
      let countries: Country[] = [];
      try {
        countries = countriesDataManager.loadData();
        if (!countries || countries.length === 0) {
          console.log('⚠️ No countries found, using fallback data');
          countries = FALLBACK_COUNTRIES;
          countriesDataManager.saveData(FALLBACK_COUNTRIES);
        }
        console.log('📍 Countries loaded:', countries.length);
      } catch (error) {
        console.error('❌ Error loading countries:', error);
        countries = FALLBACK_COUNTRIES;
        errors.push('Countries data was corrupted, using fallback');
        try {
          countriesDataManager.saveData(FALLBACK_COUNTRIES);
        } catch (saveError) {
          console.error('❌ Failed to save fallback countries:', saveError);
        }
      }

      // Load organization types with fallback
      let organizationTypes: string[] = [];
      try {
        organizationTypes = organizationTypesDataManager.loadData();
        if (!organizationTypes || organizationTypes.length === 0) {
          console.log('⚠️ No organization types found, using fallback data');
          organizationTypes = FALLBACK_ORGANIZATION_TYPES;
          organizationTypesDataManager.saveData(FALLBACK_ORGANIZATION_TYPES);
        }
        console.log('🏢 Organization types loaded:', organizationTypes.length);
      } catch (error) {
        console.error('❌ Error loading organization types:', error);
        organizationTypes = FALLBACK_ORGANIZATION_TYPES;
        errors.push('Organization types data was corrupted, using fallback');
        try {
          organizationTypesDataManager.saveData(FALLBACK_ORGANIZATION_TYPES);
        } catch (saveError) {
          console.error('❌ Failed to save fallback organization types:', saveError);
        }
      }

      // Load industry segments with fallback
      let industrySegments: IndustrySegment[] = [];
      try {
        const industrySegmentData: IndustrySegmentData = industrySegmentDataManager.loadData();
        industrySegments = industrySegmentData.industrySegments || [];
        if (industrySegments.length === 0) {
          console.log('⚠️ No industry segments found, using fallback data');
          industrySegments = FALLBACK_INDUSTRY_SEGMENTS;
          industrySegmentDataManager.saveData({ industrySegments: FALLBACK_INDUSTRY_SEGMENTS });
        }
        console.log('🏭 Industry segments loaded:', industrySegments.length);
      } catch (error) {
        console.error('❌ Error loading industry segments:', error);
        industrySegments = FALLBACK_INDUSTRY_SEGMENTS;
        errors.push('Industry segments data was corrupted, using fallback');
        try {
          industrySegmentDataManager.saveData({ industrySegments: FALLBACK_INDUSTRY_SEGMENTS });
        } catch (saveError) {
          console.error('❌ Failed to save fallback industry segments:', saveError);
        }
      }

      // Load entity types with fallback
      let entityTypes: string[] = [];
      try {
        entityTypes = entityTypesDataManager.loadData();
        if (!entityTypes || entityTypes.length === 0) {
          console.log('⚠️ No entity types found, using fallback data');
          entityTypes = FALLBACK_ENTITY_TYPES;
          entityTypesDataManager.saveData(FALLBACK_ENTITY_TYPES);
        }
        console.log('🏛️ Entity types loaded:', entityTypes.length);
      } catch (error) {
        console.error('❌ Error loading entity types:', error);
        entityTypes = FALLBACK_ENTITY_TYPES;
        errors.push('Entity types data was corrupted, using fallback');
        try {
          entityTypesDataManager.saveData(FALLBACK_ENTITY_TYPES);
        } catch (saveError) {
          console.error('❌ Failed to save fallback entity types:', saveError);
        }
      }

      setState({
        countries,
        organizationTypes,
        industrySegments,
        entityTypes,
        isLoading: false,
        hasErrors: errors.length > 0,
        errors
      });

      console.log('✅ Master data initialization complete');
      if (errors.length > 0) {
        console.log('⚠️ Errors during initialization:', errors);
      }

    } catch (error) {
      console.error('❌ Critical error during master data initialization:', error);
      
      // Use all fallback data in case of critical failure
      setState({
        countries: FALLBACK_COUNTRIES,
        organizationTypes: FALLBACK_ORGANIZATION_TYPES,
        industrySegments: FALLBACK_INDUSTRY_SEGMENTS,
        entityTypes: FALLBACK_ENTITY_TYPES,
        isLoading: false,
        hasErrors: true,
        errors: ['Critical error loading master data, using all fallback data']
      });
    }
  };

  const refreshMasterData = async () => {
    console.log('🔄 Refreshing master data...');
    setState(prev => ({ ...prev, isLoading: true }));
    await initializeMasterData();
  };

  useEffect(() => {
    initializeMasterData();
  }, []);

  return {
    ...state,
    refreshMasterData
  };
};

// Export individual fallback data for testing
export { 
  FALLBACK_COUNTRIES, 
  FALLBACK_ORGANIZATION_TYPES, 
  FALLBACK_ENTITY_TYPES, 
  FALLBACK_INDUSTRY_SEGMENTS 
};