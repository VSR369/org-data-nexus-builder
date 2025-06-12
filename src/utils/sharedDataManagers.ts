import { UniversalDataManager } from './core/UniversalDataManager';
import { seedingService } from './core/UniversalSeedingService';

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

const defaultOrgTypes = [
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
];

// Validation functions
const validateCountriesData = (data: any): boolean => {
  console.log(`🔍 Validating countries data:`, data);
  const isValid = Array.isArray(data) && data.every(country => 
    country && typeof country === 'object' && 
    typeof country.id === 'string' && 
    typeof country.name === 'string' && 
    typeof country.code === 'string'
  );
  console.log(`✅ Countries validation result: ${isValid}`);
  return isValid;
};

const validateOrgTypesData = (data: any): boolean => {
  console.log(`🔍 Validating organization types data:`, data);
  const isValid = Array.isArray(data) && data.every(type => typeof type === 'string');
  console.log(`✅ Organization types validation result: ${isValid}`);
  return isValid;
};

// Seeding functions
const seedCountriesData = (): Country[] => {
  console.log('🌱 Seeding countries default data');
  return defaultCountries;
};

const seedOrgTypesData = (): string[] => {
  console.log('🌱 Seeding organization types default data');
  return defaultOrgTypes;
};

// Create universal data manager instances
const countriesManager = new UniversalDataManager<Country[]>({
  key: 'master_data_countries',
  defaultData: defaultCountries,
  version: 3, // Increment version for the new system
  seedFunction: seedCountriesData,
  validationFunction: validateCountriesData
});

const organizationTypesManager = new UniversalDataManager<string[]>({
  key: 'master_data_organization_types',
  defaultData: defaultOrgTypes,
  version: 2, // Increment version for the new system
  seedFunction: seedOrgTypesData,
  validationFunction: validateOrgTypesData
});

// Register with seeding service
seedingService.registerManager('countries', countriesManager);
seedingService.registerSeedFunction('countries', seedCountriesData);
seedingService.registerManager('organization_types', organizationTypesManager);
seedingService.registerSeedFunction('organization_types', seedOrgTypesData);

// Enhanced manager classes
class EnhancedCountriesManager {
  private manager: UniversalDataManager<Country[]>;

  constructor(manager: UniversalDataManager<Country[]>) {
    this.manager = manager;
  }

  loadData(): Country[] {
    console.log('🔄 Enhanced countries loadData called');
    return this.manager.loadData();
  }

  saveData(data: Country[]): void {
    console.log('💾 Enhanced countries saveData called:', data);
    this.manager.saveData(data);
  }

  resetToDefault(): Country[] {
    console.log('🔄 Enhanced countries resetToDefault called');
    return this.manager.forceReseed();
  }

  getDataHealth() {
    return this.manager.getDataHealth();
  }
}

class EnhancedOrgTypesManager {
  private manager: UniversalDataManager<string[]>;

  constructor(manager: UniversalDataManager<string[]>) {
    this.manager = manager;
  }

  loadData(): string[] {
    console.log('🔄 Enhanced organization types loadData called');
    return this.manager.loadData();
  }

  saveData(data: string[]): void {
    console.log('💾 Enhanced organization types saveData called:', data);
    this.manager.saveData(data);
  }

  resetToDefault(): string[] {
    console.log('🔄 Enhanced organization types resetToDefault called');
    return this.manager.forceReseed();
  }

  getDataHealth() {
    return this.manager.getDataHealth();
  }
}

// Export singleton instances
export const countriesDataManager = new EnhancedCountriesManager(countriesManager);
export const organizationTypesDataManager = new EnhancedOrgTypesManager(organizationTypesManager);
