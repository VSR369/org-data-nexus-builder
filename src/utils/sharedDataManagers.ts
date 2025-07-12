
import { LegacyDataManager } from './core/DataManager';
import { Country } from '@/types/seekerRegistration';

// Use LegacyDataManager for backward compatibility with custom data support
export const countriesDataManager = new LegacyDataManager<Country[]>({
  key: 'master_data_countries',
  defaultData: [
    { _id: '1', name: 'India', code: 'IN', region: 'Asia' },
    { _id: '2', name: 'United States of America', code: 'US', region: 'North America' },
    { _id: '3', name: 'United Arab Emirates', code: 'AE', region: 'Middle East' }
  ],
  version: 1
});

// Override loadData to check for custom data first
const originalLoadData = countriesDataManager.loadData.bind(countriesDataManager);
countriesDataManager.loadData = function() {
  // Check for custom-only mode first
  const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
  if (isCustomMode) {
    console.log('🎯 Custom-only mode detected, loading custom countries...');
    const customData = localStorage.getItem('custom_countries');
    if (customData) {
      try {
        const parsed = JSON.parse(customData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('✅ Using custom countries:', parsed.length);
          return parsed;
        }
      } catch (error) {
        console.error('❌ Failed to parse custom countries data:', error);
      }
    }
  }
  
  // Fallback to original method
  return originalLoadData();
};

// Force initialization with default data if empty
const initializeCountriesData = () => {
  const existingData = countriesDataManager.loadData();
  if (!existingData || !Array.isArray(existingData) || existingData.length === 0) {
    console.log('🔧 Force initializing countries data with defaults');
    countriesDataManager.resetToDefault();
  }
};

// Initialize on module load
initializeCountriesData();

export const organizationTypesDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_organization_types',
  defaultData: process.env.NODE_ENV === 'development' ? [
    'Large Enterprise',
    'Start-up',
    'MSME',
    'Academic Institution',
    'Research Institution',
    'Non-Profit Organization / NGO',
    'Government Department / PSU',
    'Industry Association / Consortium',
    'Freelancer / Individual Consultant',
    'Think Tank / Policy Institute'
  ] : [],
  version: 1
});

// Import the service
import { OrganizationTypeService } from '@/utils/masterData/organizationTypeService';

// Override loadData to check for custom data first
const originalOrgTypesLoadData = organizationTypesDataManager.loadData.bind(organizationTypesDataManager);
organizationTypesDataManager.loadData = function() {
  // Check for custom-only mode first
  const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
  if (isCustomMode) {
    console.log('🎯 Custom-only mode detected, using OrganizationTypeService...');
    return OrganizationTypeService.getOrganizationTypes();
  }
  
  // Fallback to original method
  return originalOrgTypesLoadData();
};

// Legacy compatibility layer for components that expect sync access
export const countriesDataManagerCompat = {
  loadData: () => countriesDataManager.loadData(),
  saveData: (data: Country[]) => countriesDataManager.saveData(data)
};

export const organizationTypesDataManagerCompat = {
  loadData: () => organizationTypesDataManager.loadData(),
  saveData: (data: string[]) => organizationTypesDataManager.saveData(data)
};

console.log('📊 Shared data managers initialized with legacy compatibility');
