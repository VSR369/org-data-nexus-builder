
import { MasterDataPersistenceManager } from '../masterDataPersistenceManager';
import { Currency } from './interfaces';
import { currencyConfig } from './configs';
import { emergencyFallbackCurrencies } from './fallbackData';

export class CurrencyService {
  static getCurrencies(): Currency[] {
    console.log('🔍 Getting currencies...');
    
    // NEW APPROACH: Always use raw localStorage storage
    const rawData = localStorage.getItem('master_data_currencies');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        
        // Handle wrapped format (legacy from MasterDataPersistenceManager)
        if (parsed && typeof parsed === 'object' && parsed.data && Array.isArray(parsed.data)) {
          console.log('⚠️ Found wrapped currency data, unwrapping...');
          const unwrapped = parsed.data;
          // Store in raw format for future use
          localStorage.setItem('master_data_currencies', JSON.stringify(unwrapped));
          console.log('✅ Unwrapped and stored currencies in raw format');
          return unwrapped;
        }
        
        // Handle raw array format (preferred)
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('✅ Using raw currency data:', parsed.length);
          return parsed;
        }
        
        console.log('⚠️ Invalid currency data structure, using fallback');
      } catch (error) {
        console.error('❌ Failed to parse currency data:', error);
      }
    }

    // Use emergency fallback and store it
    console.log('📦 No valid data found, using emergency fallback currencies');
    localStorage.setItem('master_data_currencies', JSON.stringify(emergencyFallbackCurrencies));
    return emergencyFallbackCurrencies;
  }
  
  static saveCurrencies(currencies: Currency[]): void {
    console.log('💾 Saving currencies in raw format:', currencies.length);
    localStorage.setItem('master_data_currencies', JSON.stringify(currencies));
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
    
    // Enhanced mappings for UAE and other countries
    const mappings: { [key: string]: string } = {
      'United States of America': 'United States of America',
      'USA': 'United States of America',
      'US': 'United States of America',
      'UK': 'United Kingdom',
      'Britain': 'United Kingdom',
      'Great Britain': 'United Kingdom',
      'UAE': 'United Arab Emirates',
      'United Arab Emirates': 'United Arab Emirates',
      'AE': 'United Arab Emirates'
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
