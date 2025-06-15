
import { MasterDataPersistenceManager } from '../masterDataPersistenceManager';
import { currencyConfig, entityTypeConfig } from './configs';
import { Currency } from './interfaces';

export class ValidationService {
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
}
