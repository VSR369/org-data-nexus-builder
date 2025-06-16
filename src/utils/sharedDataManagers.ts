
import { LegacyDataManager } from './core/DataManager';
import { Country } from '@/types/seekerRegistration';

// Use LegacyDataManager for backward compatibility
export const countriesDataManager = new LegacyDataManager<Country[]>({
  key: 'master_data_countries',
  defaultData: process.env.NODE_ENV === 'development' ? [
    { id: '1', name: 'India', code: 'IN', region: 'Asia' },
    { id: '2', name: 'United States of America', code: 'US', region: 'North America' },
    { id: '3', name: 'United Arab Emirates', code: 'AE', region: 'Middle East' },
    { id: '4', name: 'United Kingdom', code: 'GB', region: 'Europe' },
    { id: '5', name: 'Germany', code: 'DE', region: 'Europe' },
    { id: '6', name: 'France', code: 'FR', region: 'Europe' },
    { id: '7', name: 'Japan', code: 'JP', region: 'Asia' },
    { id: '8', name: 'Australia', code: 'AU', region: 'Oceania' },
    { id: '9', name: 'China', code: 'CN', region: 'Asia' },
    { id: '10', name: 'Brazil', code: 'BR', region: 'South America' },
    { id: '11', name: 'Canada', code: 'CA', region: 'North America' },
    { id: '12', name: 'Mexico', code: 'MX', region: 'North America' }
  ] : [],
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
