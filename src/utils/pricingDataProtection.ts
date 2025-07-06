// Robust Pricing Data Protection System
// Ensures custom pricing configurations are never lost with multiple safeguards

import { PricingConfig } from '@/types/pricing';
import { PricingDataManager } from './pricingDataManager';

export class PricingDataProtection {
  private static readonly BACKUP_PREFIX = 'pricing_backup_';
  private static readonly MAIN_CUSTOM_KEY = 'custom_pricing';
  private static readonly MASTER_DATA_KEY = 'master_data_pricing_configs';
  private static readonly PROTECTION_LOG_KEY = 'pricing_protection_log';
  private static readonly MAX_BACKUPS = 10;

  // Create timestamped backup before any operations
  static createBackup(reason: string = 'auto'): boolean {
    try {
      console.log(`🛡️ Creating pricing data backup - Reason: ${reason}`);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupKey = `${this.BACKUP_PREFIX}${timestamp}`;
      
      // Get current data from all possible sources
      const customData = this.getCurrentCustomData();
      const masterData = this.getCurrentMasterData();
      
      const backupData = {
        timestamp: new Date().toISOString(),
        reason,
        customData,
        masterData,
        mode: localStorage.getItem('master_data_mode'),
        dataCount: customData.length + masterData.length
      };
      
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // Log the backup
      this.logProtectionAction('backup_created', { 
        backupKey, 
        reason, 
        dataCount: backupData.dataCount 
      });
      
      // Clean old backups
      this.cleanOldBackups();
      
      console.log(`✅ Backup created successfully: ${backupKey}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to create backup:', error);
      return false;
    }
  }

  // Get current custom pricing data
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

  // Get current master data pricing
  private static getCurrentMasterData(): PricingConfig[] {
    try {
      const masterData = localStorage.getItem(this.MASTER_DATA_KEY);
      if (masterData) {
        const parsed = JSON.parse(masterData);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error getting master data:', error);
    }
    return [];
  }

  // Safe save with automatic backup and validation
  static safeSave(configs: PricingConfig[], reason: string = 'user_save'): boolean {
    try {
      console.log(`🛡️ Safe save initiated - Reason: ${reason}, Configs: ${configs.length}`);
      
      // Create backup before save
      if (!this.createBackup(`before_${reason}`)) {
        console.warn('⚠️ Backup failed, but proceeding with save');
      }
      
      // Validate configurations before saving
      const validation = this.validateConfigurations(configs);
      if (!validation.isValid) {
        console.error('❌ Configuration validation failed:', validation.errors);
        this.logProtectionAction('save_blocked', { 
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
            this.logProtectionAction('safe_save_success', { 
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
          this.logProtectionAction('safe_save_success', { 
            mode: 'mixed', 
            count: configs.length 
          });
          return true;
        }
      }
      
      console.error('❌ Save verification failed');
      this.logProtectionAction('save_verification_failed', { reason });
      return false;
      
    } catch (error) {
      console.error('❌ Safe save failed:', error);
      this.logProtectionAction('safe_save_error', { error: error.message });
      return false;
    }
  }

  // Validate pricing configurations
  static validateConfigurations(configs: PricingConfig[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(configs)) {
      errors.push('Configurations must be an array');
      return { isValid: false, errors };
    }
    
    configs.forEach((config, index) => {
      if (!config.id) errors.push(`Config ${index}: Missing ID`);
      if (!config.engagementModel) errors.push(`Config ${index}: Missing engagement model`);
      if (!config.organizationType) errors.push(`Config ${index}: Missing organization type`);
      if (typeof config.quarterlyFee !== 'number') errors.push(`Config ${index}: Invalid quarterly fee`);
      if (typeof config.halfYearlyFee !== 'number') errors.push(`Config ${index}: Invalid half-yearly fee`);
      if (typeof config.annualFee !== 'number') errors.push(`Config ${index}: Invalid annual fee`);
    });
    
    return { isValid: errors.length === 0, errors };
  }

  // Get all available backups
  static getAvailableBackups(): Array<{ key: string; timestamp: string; reason: string; dataCount: number }> {
    const backups: Array<{ key: string; timestamp: string; reason: string; dataCount: number }> = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.BACKUP_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          backups.push({
            key,
            timestamp: data.timestamp,
            reason: data.reason,
            dataCount: data.dataCount
          });
        } catch (error) {
          console.warn(`Invalid backup data in ${key}:`, error);
        }
      }
    }
    
    return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Restore from backup
  static restoreFromBackup(backupKey: string): boolean {
    try {
      console.log(`🔄 Restoring from backup: ${backupKey}`);
      
      const backupData = localStorage.getItem(backupKey);
      if (!backupData) {
        console.error('❌ Backup not found:', backupKey);
        return false;
      }
      
      const parsed = JSON.parse(backupData);
      const { customData, masterData, mode } = parsed;
      
      // Create backup before restore
      this.createBackup('before_restore');
      
      // Restore custom data if available
      if (Array.isArray(customData) && customData.length > 0) {
        localStorage.setItem(this.MAIN_CUSTOM_KEY, JSON.stringify(customData));
        console.log(`✅ Restored ${customData.length} custom pricing configurations`);
      }
      
      // Restore master data if available
      if (Array.isArray(masterData) && masterData.length > 0) {
        localStorage.setItem(this.MASTER_DATA_KEY, JSON.stringify(masterData));
        console.log(`✅ Restored ${masterData.length} master data pricing configurations`);
      }
      
      // Restore mode if specified
      if (mode) {
        localStorage.setItem('master_data_mode', mode);
        console.log(`✅ Restored mode: ${mode}`);
      }
      
      this.logProtectionAction('restore_success', { backupKey, customCount: customData?.length || 0, masterCount: masterData?.length || 0 });
      
      return true;
    } catch (error) {
      console.error('❌ Restore failed:', error);
      this.logProtectionAction('restore_error', { backupKey, error: error.message });
      return false;
    }
  }

  // Clean old backups to prevent storage bloat
  private static cleanOldBackups(): void {
    const backups = this.getAvailableBackups();
    if (backups.length > this.MAX_BACKUPS) {
      const toDelete = backups.slice(this.MAX_BACKUPS);
      toDelete.forEach(backup => {
        localStorage.removeItem(backup.key);
        console.log(`🗑️ Cleaned old backup: ${backup.key}`);
      });
    }
  }

  // Log protection actions for audit trail
  private static logProtectionAction(action: string, details: any): void {
    try {
      const log = JSON.parse(localStorage.getItem(this.PROTECTION_LOG_KEY) || '[]');
      log.push({
        timestamp: new Date().toISOString(),
        action,
        details
      });
      
      // Keep only last 100 log entries
      if (log.length > 100) {
        log.splice(0, log.length - 100);
      }
      
      localStorage.setItem(this.PROTECTION_LOG_KEY, JSON.stringify(log));
    } catch (error) {
      console.warn('Failed to log protection action:', error);
    }
  }

  // Get protection log
  static getProtectionLog(): Array<{ timestamp: string; action: string; details: any }> {
    try {
      return JSON.parse(localStorage.getItem(this.PROTECTION_LOG_KEY) || '[]');
    } catch (error) {
      console.error('Failed to get protection log:', error);
      return [];
    }
  }

  // Emergency recovery - consolidates all available data
  static emergencyRecovery(): PricingConfig[] {
    console.log('🚨 Emergency pricing data recovery initiated');
    
    const allConfigs: PricingConfig[] = [];
    const seenIds = new Set<string>();
    
    // Collect from all possible sources
    const sources = [
      { name: 'custom_pricing', data: this.getCurrentCustomData() },
      { name: 'master_data', data: this.getCurrentMasterData() }
    ];
    
    // Also check backups
    const backups = this.getAvailableBackups();
    backups.slice(0, 3).forEach(backup => { // Check last 3 backups
      try {
        const backupData = JSON.parse(localStorage.getItem(backup.key) || '{}');
        if (backupData.customData) {
          sources.push({ name: `backup_custom_${backup.key}`, data: backupData.customData });
        }
        if (backupData.masterData) {
          sources.push({ name: `backup_master_${backup.key}`, data: backupData.masterData });
        }
      } catch (error) {
        console.warn(`Failed to read backup ${backup.key}:`, error);
      }
    });
    
    // Consolidate unique configurations
    sources.forEach(source => {
      if (Array.isArray(source.data)) {
        source.data.forEach(config => {
          if (config.id && !seenIds.has(config.id)) {
            seenIds.add(config.id);
            allConfigs.push(config);
            console.log(`📋 Recovered config from ${source.name}: ${config.engagementModel} (${config.membershipStatus})`);
          }
        });
      }
    });
    
    console.log(`✅ Emergency recovery completed: ${allConfigs.length} unique configurations recovered`);
    this.logProtectionAction('emergency_recovery', { configCount: allConfigs.length, sourcesChecked: sources.length });
    
    return allConfigs;
  }

  // Health check - verifies data integrity
  static healthCheck(): { healthy: boolean; issues: string[]; configCount: number } {
    const issues: string[] = [];
    
    try {
      const customConfigs = this.getCurrentCustomData();
      const masterConfigs = this.getCurrentMasterData();
      const totalConfigs = customConfigs.length + masterConfigs.length;
      
      if (totalConfigs === 0) {
        issues.push('No pricing configurations found in any storage location');
      }
      
      // Check for data corruption
      const validation = this.validateConfigurations([...customConfigs, ...masterConfigs]);
      if (!validation.isValid) {
        issues.push(`Data validation errors: ${validation.errors.join(', ')}`);
      }
      
      // Check backup availability
      const backups = this.getAvailableBackups();
      if (backups.length === 0) {
        issues.push('No backups available for recovery');
      }
      
      const healthy = issues.length === 0;
      
      console.log(`🏥 Pricing data health check: ${healthy ? 'HEALTHY' : 'ISSUES FOUND'}`);
      if (issues.length > 0) {
        console.warn('⚠️ Health check issues:', issues);
      }
      
      return { healthy, issues, configCount: totalConfigs };
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { healthy: false, issues: [`Health check error: ${error.message}`], configCount: 0 };
    }
  }

  // Force enable custom-only mode with protection
  static enableCustomOnlyMode(): boolean {
    try {
      console.log('🎯 Enabling custom-only mode with data protection');
      
      // Create backup before mode change
      this.createBackup('before_custom_only_mode');
      
      // Set mode
      localStorage.setItem('master_data_mode', 'custom_only');
      
      // Verify custom data exists
      const customConfigs = this.getCurrentCustomData();
      console.log(`✅ Custom-only mode enabled. ${customConfigs.length} custom configurations available.`);
      
      this.logProtectionAction('custom_only_mode_enabled', { configCount: customConfigs.length });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to enable custom-only mode:', error);
      return false;
    }
  }
}

// Make available globally for debugging and emergency use
if (typeof window !== 'undefined') {
  (window as any).PricingDataProtection = PricingDataProtection;
}
