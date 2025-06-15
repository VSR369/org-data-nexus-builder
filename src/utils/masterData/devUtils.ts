
import { MasterDataPersistenceManager } from '../masterDataPersistenceManager';
import { currencyConfig, entityTypeConfig } from './configs';

export class DevUtils {
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
