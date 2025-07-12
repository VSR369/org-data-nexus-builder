
import { MasterDataPersistenceManager } from '../masterDataPersistenceManager';
import { Currency } from './interfaces';
import { currencyConfig } from './configs';
import { emergencyFallbackCurrencies } from './fallbackData';

export class CurrencyService {
  static getCurrencies(): Currency[] {
    console.log('🔍 Getting currencies...');
    
    // CHECK FOR CUSTOM-ONLY MODE FIRST
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    if (isCustomMode) {
      console.log('🎯 Custom-only mode detected, loading custom currencies...');
      const customData = localStorage.getItem('custom_currencies');
      if (customData !== null) {
        try {
          const parsed = JSON.parse(customData);
          if (Array.isArray(parsed)) {
            console.log('✅ Using custom currencies (including empty array):', parsed.length);
            return parsed; // Return even if empty array - this preserves deletions
          }
        } catch (error) {
          console.error('❌ Failed to parse custom currency data:', error);
        }
      }
    }
    
    // FALLBACK: Use raw localStorage storage
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

    // IMPORTANT: In custom-only mode, do NOT use emergency fallback
    if (isCustomMode) {
      console.log('🚫 Custom-only mode: No custom currencies found, returning empty array instead of fallback');
      return [];
    }

    // Use emergency fallback only in mixed mode
    console.log('📦 Mixed mode: No valid data found, using emergency fallback currencies');
    localStorage.setItem('master_data_currencies', JSON.stringify(emergencyFallbackCurrencies));
    return emergencyFallbackCurrencies;
  }
  
  static saveCurrencies(currencies: Currency[]): void {
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    
    if (isCustomMode) {
      console.log('💾 Custom-only mode: Saving currencies to custom_currencies:', currencies.length);
      localStorage.setItem('custom_currencies', JSON.stringify(currencies));
      
      // Validation: Read back to ensure it was saved correctly
      const readBack = localStorage.getItem('custom_currencies');
      if (readBack !== null) {
        try {
          const parsed = JSON.parse(readBack);
          if (Array.isArray(parsed) && parsed.length === currencies.length) {
            console.log('✅ Custom currencies save validated successfully');
          } else {
            console.error('❌ Custom currencies save validation failed - length mismatch');
          }
        } catch (error) {
          console.error('❌ Custom currencies save validation failed - parse error:', error);
        }
      } else {
        console.error('❌ Custom currencies save validation failed - null readback');
      }
    } else {
      console.log('💾 Mixed mode: Saving currencies to master_data_currencies:', currencies.length);
      localStorage.setItem('master_data_currencies', JSON.stringify(currencies));
    }
  }
  
  static getCurrencyByCountry(country: string): Currency | null {
    const currencies = this.getCurrencies();
    
    console.log('🔍 getCurrencyByCountry - Looking for:', country);
    console.log('🔍 getCurrencyByCountry - Available currencies:', currencies?.length || 0);
    
    // Add null/undefined checks
    if (!country || typeof country !== 'string') {
      console.log('❌ Invalid country parameter:', country);
      return null;
    }
    
    if (!currencies || currencies.length === 0) {
      console.log('❌ No currencies available for lookup');
      return null;
    }
    
    // Direct match - with null checks
    let currency = currencies.find(c => 
      c && c.country && typeof c.country === 'string' && 
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
        c && c.country && typeof c.country === 'string' && 
        c.country.toLowerCase() === mappedCountry.toLowerCase()
      );
      if (currency) {
        console.log('✅ getCurrencyByCountry - Mapped match found:', currency);
        return currency;
      }
    }
    
    // Partial match - with null checks
    currency = currencies.find(c => 
      c && c.country && typeof c.country === 'string' && 
      (c.country.toLowerCase().includes(country.toLowerCase()) ||
       country.toLowerCase().includes(c.country.toLowerCase()))
    );
    
    if (currency) {
      console.log('✅ getCurrencyByCountry - Partial match found:', currency);
      return currency;
    }
    
    console.log('❌ getCurrencyByCountry - No match found for:', country);
    return null;
  }
}
