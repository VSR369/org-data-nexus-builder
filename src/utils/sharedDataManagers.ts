
import { LegacyDataManager } from './core/DataManager';
import { Country } from '@/types/seekerRegistration';

// Use LegacyDataManager for backward compatibility
export const countriesDataManager = new LegacyDataManager<Country[]>({
  key: 'master_data_countries',
  defaultData: [
    { id: '1', name: 'India', code: 'IN', region: 'Asia' },
    { id: '2', name: 'United States of America', code: 'US', region: 'North America' },
    { id: '3', name: 'United Arab Emirates', code: 'AE', region: 'Middle East' }
  ],
  version: 1
});

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
