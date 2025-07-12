// Main Pricing Data Protection Interface
// Maintains backward compatibility while using focused modules

import { PricingConfig } from '@/types/pricing';
import { BackupManager } from './protection/BackupManager';
import { ValidationService } from './protection/ValidationService';
import { SafeOperations } from './protection/SafeOperations';
import { LoggingService } from './protection/LoggingService';

export class PricingDataProtection {
  // Re-export backup methods
  static createBackup = BackupManager.createBackup.bind(BackupManager);
  static getAvailableBackups = BackupManager.getAvailableBackups.bind(BackupManager);
  static restoreFromBackup = BackupManager.restoreFromBackup.bind(BackupManager);
  static emergencyRecovery = BackupManager.emergencyRecovery.bind(BackupManager);

  // Re-export validation methods
  static validateConfigurations = ValidationService.validateConfigurations.bind(ValidationService);
  static healthCheck = ValidationService.healthCheck.bind(ValidationService);

  // Re-export safe operations
  static safeSave = SafeOperations.safeSave.bind(SafeOperations);
  static enableCustomOnlyMode = SafeOperations.enableCustomOnlyMode.bind(SafeOperations);

  // Re-export logging methods
  static getProtectionLog = LoggingService.getProtectionLog.bind(LoggingService);
}

// Make available globally for debugging and emergency use
if (typeof window !== 'undefined') {
  (window as any).PricingDataProtection = PricingDataProtection;
}
