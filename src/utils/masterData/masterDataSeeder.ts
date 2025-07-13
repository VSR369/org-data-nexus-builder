
// Currency service removed - use Supabase hooks instead
import { EntityTypeService } from './entityTypeService';
import { ValidationService } from './validationService';
import { DevUtils } from './devUtils';
import { Currency } from './interfaces';

export class MasterDataSeeder {
  static seedAllMasterData() {
    console.log('🌱 DEPRECATED: MasterDataSeeder - Use Supabase hooks instead');
    return { currencies: [], entityTypes: [] };
  }
  
  static getCurrencies(): Currency[] {
    console.log('⚠️ DEPRECATED: Use useCurrencies hook instead');
    return [];
  }
  
  static saveCurrencies(currencies: Currency[]): void {
    console.log('⚠️ DEPRECATED: Use useCurrencies hook instead');
  }
  
  static getEntityTypes(): string[] {
    return EntityTypeService.getEntityTypesSync();
  }
  
  static getCurrencyByCountry(country: string): Currency | null {
    console.log('⚠️ DEPRECATED: Use useCurrencies hook instead');
    return null;
  }
  
  static validateMasterDataIntegrity() {
    return ValidationService.validateMasterDataIntegrity();
  }

  static DANGEROUS_resetAllUserData(): void {
    DevUtils.DANGEROUS_resetAllUserData();
  }
}
