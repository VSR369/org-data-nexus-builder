
import { MasterDataPersistenceManager } from '../masterDataPersistenceManager';
import { Currency } from './interfaces';
import { currencyConfig } from './configs';
import { emergencyFallbackCurrencies } from './fallbackData';

export class CurrencyService {
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
}
