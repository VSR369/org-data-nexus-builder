
import { DataManager } from './dataManager';
import { MasterDataPersistenceManager } from './masterDataPersistenceManager';

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  isUserCreated: boolean;
}

interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

// IMPORTANT: These are ONLY used when NO user data exists
const emergencyFallbackCurrencies: Currency[] = [
  { 
    id: 'fallback_1', 
    code: 'USD', 
    name: 'US Dollar', 
    symbol: '$', 
    country: 'United States of America',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isUserCreated: false
  },
  { 
    id: 'fallback_2', 
    code: 'EUR', 
    name: 'Euro', 
    symbol: '€', 
    country: 'European Union',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isUserCreated: false
  }
];

const emergencyFallbackEntityTypes: string[] = [
  'Commercial',
  'Non-Profit Organization'
];

const currencyConfig = {
  key: 'master_data_currencies',
  version: 2,
  preserveUserData: true
};

const entityTypeConfig = {
  key: 'master_data_entity_types', 
  version: 2,
  preserveUserData: true
};

export class MasterDataSeeder {
  static seedAllMasterData() {
    console.log('🌱 Starting master data initialization...');
    
    // Load currencies - NEVER overwrite user data
    let currencies = this.getCurrencies();
    console.log('💰 Loaded currencies from storage:', currencies.length);
    
    // Load entity types - NEVER overwrite user data  
    let entityTypes = this.getEntityTypes();
    console.log('🏢 Entity types loaded:', entityTypes.length);
    
    console.log('✅ Master data initialization complete (user data preserved)');
    
    return {
      currencies,
      entityTypes
    };
  }
  
  static getCurrencies(): Currency[] {
    console.log('🔍 Getting currencies...');
    
    // First, try to load user data
    const userData = MasterDataPersistenceManager.loadUserData<Currency[]>(currencyConfig);
    if (userData && userData.length > 0) {
      console.log('✅ Using user-created currencies:', userData.length);
      return userData;
    }

    // Check if we have any legacy data in old format
    const legacyData = localStorage.getItem('master_data_currencies');
    if (legacyData) {
      try {
        const parsed = JSON.parse(legacyData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('⚠️ Found legacy currency data, migrating to new format');
          const migratedData = parsed.map((item: any, index: number) => ({
            ...item,
            id: item.id || `migrated_${index}`,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isUserCreated: true // Assume legacy data is user data
          }));
          
          // Save as user data
          MasterDataPersistenceManager.saveUserData(currencyConfig, migratedData);
          return migratedData;
        }
      } catch (error) {
        console.error('❌ Failed to migrate legacy currency data:', error);
      }
    }

    // Only use emergency fallback if absolutely no data exists
    console.log('📦 No user data found, using emergency fallback currencies (NOT saved)');
    return emergencyFallbackCurrencies;
  }
  
  static saveCurrencies(currencies: Currency[]): void {
    console.log('💾 Saving currencies as user data:', currencies.length);
    MasterDataPersistenceManager.saveUserData(currencyConfig, currencies);
  }
  
  static getEntityTypes(): string[] {
    console.log('🔍 Getting entity types...');
    
    // Check if we have user data (stored as string array)
    const hasUserData = MasterDataPersistenceManager.hasUserData(entityTypeConfig);
    if (hasUserData) {
      const stored = localStorage.getItem('master_data_entity_types');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.data && Array.isArray(parsed.data)) {
            console.log('✅ Using user-created entity types:', parsed.data.length);
            return parsed.data;
          }
        } catch (error) {
          console.error('❌ Failed to parse entity types:', error);
        }
      }
    }

    // Check legacy format
    const legacyData = localStorage.getItem('master_data_entity_types');
    if (legacyData) {
      try {
        const parsed = JSON.parse(legacyData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('⚠️ Found legacy entity types, treating as user data');
          return parsed;
        }
      } catch (error) {
        console.error('❌ Failed to parse legacy entity types:', error);
      }
    }

    console.log('📦 No user data found, using emergency fallback entity types');
    return emergencyFallbackEntityTypes;
  }
  
  static getCurrencyByCountry(country: string): Currency | null {
    const currencies = this.getCurrencies();
    
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
  
  static validateMasterDataIntegrity(): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    try {
      const currencyValidation = MasterDataPersistenceManager.validateDataIntegrity<Currency[]>(currencyConfig);
      const entityTypeValidation = MasterDataPersistenceManager.validateDataIntegrity<any[]>(entityTypeConfig);
      
      if (!currencyValidation.hasUserData) {
        issues.push('No user-created currencies found');
      } else if (!currencyValidation.isValid) {
        issues.push(...currencyValidation.issues.map(issue => `Currency: ${issue}`));
      }
      
      if (!entityTypeValidation.hasUserData) {
        issues.push('No user-created entity types found');
      } else if (!entityTypeValidation.isValid) {
        issues.push(...entityTypeValidation.issues.map(issue => `Entity Type: ${issue}`));
      }

    } catch (error) {
      issues.push(`Validation error: ${error}`);
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  // FOR TESTING/DEVELOPMENT ONLY - Use with extreme caution
  static DANGEROUS_resetAllUserData(): void {
    console.log('🚨 DANGEROUS: Resetting ALL user data - this should only be used in development!');
    MasterDataPersistenceManager.clearUserData(currencyConfig);
    MasterDataPersistenceManager.clearUserData(entityTypeConfig);
    
    // Also clear legacy storage
    localStorage.removeItem('master_data_currencies');
    localStorage.removeItem('master_data_entity_types');
    
    console.log('🗑️ All user master data has been cleared');
  }
}
