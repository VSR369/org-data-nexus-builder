
import { DataManager } from './dataManager';

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  country: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

// Enhanced default currencies with better country coverage
const defaultCurrencies: Currency[] = [
  { id: '1', code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India' },
  { id: '2', code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States of America' },
  { id: '3', code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union' },
  { id: '4', code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom' },
  { id: '5', code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada' },
  { id: '6', code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia' },
  { id: '7', code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan' },
  { id: '8', code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'Singapore' },
  { id: '9', code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'China' },
  { id: '10', code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland' },
  { id: '11', code: 'AED', name: 'UAE Dirham', symbol: 'AED', country: 'United Arab Emirates' },
  { id: '12', code: 'BRL', name: 'Brazilian Real', symbol: 'R$', country: 'Brazil' },
  { id: '13', code: 'MXN', name: 'Mexican Peso', symbol: '$', country: 'Mexico' },
  { id: '14', code: 'EUR', name: 'Euro', symbol: '€', country: 'Germany' },
  { id: '15', code: 'EUR', name: 'Euro', symbol: '€', country: 'France' }
];

const defaultEntityTypes: string[] = [
  'Commercial',
  'Non-Profit Organization',
  'Society',
  'Trust',
  'Government',
  'Educational Institution',
  'Healthcare Organization',
  'Research Institution'
];

const currencyDataManager = new DataManager<Currency[]>({
  key: 'master_data_currencies',
  defaultData: defaultCurrencies,
  version: 1
});

const entityTypeDataManager = new DataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: defaultEntityTypes,
  version: 1
});

export class MasterDataSeeder {
  static seedAllMasterData() {
    console.log('🌱 Starting master data seeding...');
    
    // Load currencies - DO NOT reset if data exists
    let currencies = currencyDataManager.loadData();
    console.log('💰 Loaded currencies from storage:', currencies.length);
    
    // Only seed defaults if truly empty (no currencies at all)
    if (!currencies || currencies.length === 0) {
      console.log('📦 No currencies found, seeding defaults for the first time...');
      currencyDataManager.saveData(defaultCurrencies);
      currencies = defaultCurrencies;
    } else {
      console.log('✅ Using existing currency data, count:', currencies.length);
    }
    
    // Load entity types
    let entityTypes = entityTypeDataManager.loadData();
    if (!entityTypes || entityTypes.length === 0) {
      console.log('📦 No entity types found, seeding defaults...');
      entityTypeDataManager.saveData(defaultEntityTypes);
      entityTypes = defaultEntityTypes;
    }
    console.log('🏢 Entity types loaded:', entityTypes.length);
    
    console.log('✅ Master data seeding complete');
    
    return {
      currencies,
      entityTypes
    };
  }
  
  static validateMasterDataIntegrity(): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check currencies
    const currencies = currencyDataManager.loadData();
    if (!currencies || currencies.length === 0) {
      issues.push('No currencies found in master data');
    }
    
    // Check entity types
    const entityTypes = entityTypeDataManager.loadData();
    if (!entityTypes || entityTypes.length === 0) {
      issues.push('No entity types found in master data');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
  
  static getCurrencyByCountry(country: string): Currency | null {
    const currencies = currencyDataManager.loadData();
    
    console.log('🔍 getCurrencyByCountry - Looking for:', country);
    console.log('🔍 getCurrencyByCountry - Available currencies:', currencies?.length || 0);
    
    if (!currencies || currencies.length === 0) {
      console.log('❌ No currencies available for lookup');
      return null;
    }
    
    // Direct match
    let currency = currencies.find(c => 
      c.country.toLowerCase() === country.toLowerCase()
    );
    
    if (currency) {
      console.log('✅ getCurrencyByCountry - Direct match found:', currency);
      return currency;
    }
    
    // Common mappings
    const mappings: { [key: string]: string } = {
      'United States of America': 'United States of America',
      'USA': 'United States of America',
      'US': 'United States of America',
      'UK': 'United Kingdom',
      'Britain': 'United Kingdom',
      'Great Britain': 'United Kingdom'
    };
    
    const mappedCountry = mappings[country];
    if (mappedCountry) {
      currency = currencies.find(c => 
        c.country.toLowerCase() === mappedCountry.toLowerCase()
      );
      if (currency) {
        console.log('✅ getCurrencyByCountry - Mapped match found:', currency);
        return currency;
      }
    }
    
    // Partial match
    currency = currencies.find(c => 
      c.country.toLowerCase().includes(country.toLowerCase()) ||
      country.toLowerCase().includes(c.country.toLowerCase())
    );
    
    if (currency) {
      console.log('✅ getCurrencyByCountry - Partial match found:', currency);
      return currency;
    }
    
    console.log('❌ getCurrencyByCountry - No match found for:', country);
    return null;
  }
  
  static getCurrencies(): Currency[] {
    return currencyDataManager.loadData() || [];
  }
  
  static saveCurrencies(currencies: Currency[]): void {
    console.log('💾 Saving currencies to persistent storage:', currencies.length);
    currencyDataManager.saveData(currencies);
  }
  
  static getEntityTypes(): string[] {
    return entityTypeDataManager.loadData() || [];
  }
  
  // Only use this method when explicitly requested by user for testing/reset purposes
  static resetCurrencyData(): Currency[] {
    console.log('🔄 MANUAL RESET: Resetting currency data to defaults...');
    const resetData = currencyDataManager.resetToDefault();
    console.log('🔄 MANUAL RESET: Currency data reset complete, count:', resetData.length);
    return resetData;
  }
}
