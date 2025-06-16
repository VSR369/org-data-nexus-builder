
import { AsyncDataManager } from './dataManager';
import { Country } from '@/types/seekerRegistration';

// Countries data manager using IndexedDB
export const asyncCountriesDataManager = new AsyncDataManager<Country[]>({
  key: 'countries',
  storeName: 'masterData',
  defaultData: process.env.NODE_ENV === 'development' ? [
    { name: 'India', code: 'IN' },
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Japan', code: 'JP' },
    { name: 'Australia', code: 'AU' },
    { name: 'Canada', code: 'CA' }
  ] : [],
  version: 1,
  validateData: (data: any) => Array.isArray(data) && data.every(country => 
    country && typeof country.name === 'string' && typeof country.code === 'string'
  )
});

// Organization types data manager using IndexedDB
export const asyncOrganizationTypesDataManager = new AsyncDataManager<string[]>({
  key: 'organization_types',
  storeName: 'masterData',
  defaultData: process.env.NODE_ENV === 'development' ? [
    'Corporate',
    'Startup',
    'Non-Profit Organization',
    'Government',
    'Educational Institution',
    'Research Institution',
    'Healthcare Organization',
    'Financial Institution'
  ] : [],
  version: 1,
  validateData: (data: any) => Array.isArray(data) && data.every(item => typeof item === 'string')
});

// Entity types data manager using IndexedDB
export const asyncEntityTypesDataManager = new AsyncDataManager<string[]>({
  key: 'entity_types', 
  storeName: 'masterData',
  defaultData: process.env.NODE_ENV === 'development' ? [
    'Commercial',
    'Non-Profit Organization', 
    'Society',
    'Trust'
  ] : [],
  version: 1,
  validateData: (data: any) => Array.isArray(data) && data.every(item => typeof item === 'string')
});

console.log('📊 Async shared data managers initialized');
