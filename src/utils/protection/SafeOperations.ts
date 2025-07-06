// Safe Operations Manager
import { PricingConfig } from '@/types/pricing';
import { PricingDataManager } from '../pricing/PricingDataManager';
import { BackupManager } from './BackupManager';
import { ValidationService } from './ValidationService';
import { LoggingService } from './LoggingService';

export class SafeOperations {
  private static readonly MAIN_CUSTOM_KEY = 'custom_pricing';

  // Safe save with automatic backup and validation
  static safeSave(configs: PricingConfig[], reason: string = 'user_save'): boolean {
    try {
      console.log(`🛡️ Safe save initiated - Reason: ${reason}, Configs: ${configs.length}`);
      
      // Create backup before save
      if (!BackupManager.createBackup(`before_${reason}`)) {
        console.warn('⚠️ Backup failed, but proceeding with save');
      }
      
      // Validate configurations before saving
      const validation = ValidationService.validateConfigurations(configs);
      if (!validation.isValid) {
        console.error('❌ Configuration validation failed:', validation.errors);
        LoggingService.logProtectionAction('save_blocked', { 
          reason: 'validation_failed', 
          errors: validation.errors 
        });
        return false;
      }
      
      // Perform the save
      const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
      
      if (isCustomMode) {
        localStorage.setItem(this.MAIN_CUSTOM_KEY, JSON.stringify(configs));
        
        // Verify the save
        const savedData = localStorage.getItem(this.MAIN_CUSTOM_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed) && parsed.length === configs.length) {
            console.log('✅ Custom pricing data saved and verified successfully');
            LoggingService.logProtectionAction('safe_save_success', { 
              mode: 'custom_only', 
              count: configs.length 
            });
            return true;
          }
        }
      } else {
        // Use the standard data manager for mixed mode
        PricingDataManager.saveConfigurations(configs);
        
        // Verify the save
        const loadedConfigs = PricingDataManager.getAllConfigurations();
        if (loadedConfigs.length === configs.length) {
          console.log('✅ Master data pricing saved and verified successfully');
          LoggingService.logProtectionAction('safe_save_success', { 
            mode: 'mixed', 
            count: configs.length 
          });
          return true;
        }
      }
      
      console.error('❌ Save verification failed');
      LoggingService.logProtectionAction('save_verification_failed', { reason });
      return false;
      
    } catch (error) {
      console.error('❌ Safe save failed:', error);
      LoggingService.logProtectionAction('safe_save_error', { error: error.message });
      return false;
    }
  }

  // Force enable custom-only mode with protection
  static enableCustomOnlyMode(): boolean {
    try {
      console.log('🎯 Enabling custom-only mode with data protection');
      
      // Create backup before mode change
      BackupManager.createBackup('before_custom_only_mode');
      
      // Set mode
      localStorage.setItem('master_data_mode', 'custom_only');
      
      // Verify custom data exists
      const customConfigs = this.getCurrentCustomData();
      console.log(`✅ Custom-only mode enabled. ${customConfigs.length} custom configurations available.`);
      
      LoggingService.logProtectionAction('custom_only_mode_enabled', { configCount: customConfigs.length });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to enable custom-only mode:', error);
      return false;
    }
  }

  private static getCurrentCustomData(): PricingConfig[] {
    try {
      const customData = localStorage.getItem(this.MAIN_CUSTOM_KEY);
      if (customData) {
        const parsed = JSON.parse(customData);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error getting custom data:', error);
    }
    return [];
  }
}