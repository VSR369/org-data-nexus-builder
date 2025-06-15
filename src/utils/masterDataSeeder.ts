
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
  { id: '2', code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States' },
  { id: '3', code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union' },
  { id: '4', code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom' },
  { id: '5', code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada' },
  { id: '6', code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia' },
  { id: '7', code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan' },
  { id: '8', code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'Singapore' },
  { id: '9', code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'China' },
  { id: '10', code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland' }
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
    
    // Seed currencies
    const currencies = currencyDataManager.loadData();
    console.log('💰 Seeded currencies:', currencies.length);
    
    // Seed entity types
    const entityTypes = entityTypeDataManager.loadData();
    console.log('🏢 Seeded entity types:', entityTypes.length);
    
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
    if (currencies.length === 0) {
      issues.push('No currencies found in master data');
    }
    
    // Check entity types
    const entityTypes = entityTypeDataManager.loadData();
    if (entityTypes.length === 0) {
      issues.push('No entity types found in master data');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
  
  static getCurrencyByCountry(country: string): Currency | null {
    const currencies = currencyDataManager.loadData();
    
    // Direct match
    let currency = currencies.find(c => 
      c.country.toLowerCase() === country.toLowerCase()
    );
    
    if (currency) return currency;
    
    // Common mappings
    const mappings: { [key: string]: string } = {
      'United States of America': 'United States',
      'USA': 'United States',
      'US': 'United States',
      'UK': 'United Kingdom',
      'Britain': 'United Kingdom',
      'Great Britain': 'United Kingdom'
    };
    
    const mappedCountry = mappings[country];
    if (mappedCountry) {
      currency = currencies.find(c => 
        c.country.toLowerCase() === mappedCountry.toLowerCase()
      );
      if (currency) return currency;
    }
    
    // Partial match
    currency = currencies.find(c => 
      c.country.toLowerCase().includes(country.toLowerCase()) ||
      country.toLowerCase().includes(c.country.toLowerCase())
    );
    
    return currency || null;
  }
}
