
import { DataManager } from './dataManager';

interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

// Default countries with proper structure
const defaultCountries: Country[] = [
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
];

// Data managers for master data
export const countriesDataManager = new DataManager<Country[]>({
  key: 'master_data_countries',
  defaultData: defaultCountries,
  version: 2 // Increment version to force migration to new structure
});

export const organizationTypesDataManager = new DataManager({
  key: 'master_data_organization_types',
  defaultData: [
    'Startup', 'Small Business', 'Medium Enterprise', 'Large Corporation', 'Non-Profit', 'Government Agency', 'Educational Institution', 'Healthcare Organization'
  ],
  version: 1
});
