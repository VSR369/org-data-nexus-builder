
import { CurrencyService } from './currencyService';
import { EntityTypeService } from './entityTypeService';
import { ValidationService } from './validationService';
import { DevUtils } from './devUtils';
import { Currency } from './interfaces';

export class MasterDataSeeder {
  static seedAllMasterData() {
    console.log('🌱 Starting master data initialization...');
    
    // Load currencies - NEVER overwrite user data
    let currencies = CurrencyService.getCurrencies();
    console.log('💰 Loaded currencies from storage:', currencies.length);
    
    // Load entity types - NEVER overwrite user data  
    let entityTypes = EntityTypeService.getEntityTypesSync();
    console.log('🏢 Entity types loaded:', entityTypes.length);
    
    console.log('✅ Master data initialization complete (user data preserved)');
    
    return {
      currencies,
      entityTypes
    };
  }
  
  static getCurrencies(): Currency[] {
    return CurrencyService.getCurrencies();
  }
  
  static saveCurrencies(currencies: Currency[]): void {
    CurrencyService.saveCurrencies(currencies);
  }
  
  static getEntityTypes(): string[] {
    return EntityTypeService.getEntityTypesSync();
  }
  
  static getCurrencyByCountry(country: string): Currency | null {
    return CurrencyService.getCurrencyByCountry(country);
  }
  
  static validateMasterDataIntegrity() {
    return ValidationService.validateMasterDataIntegrity();
  }

  // FOR TESTING/DEVELOPMENT ONLY - Use with extreme caution
  static DANGEROUS_resetAllUserData(): void {
    DevUtils.DANGEROUS_resetAllUserData();
  }
}
