// Backup Management System
import { PricingConfig } from '@/types/pricing';

export class BackupManager {
  private static readonly BACKUP_PREFIX = 'pricing_backup_';
  private static readonly MAX_BACKUPS = 10;
  private static readonly MAIN_CUSTOM_KEY = 'custom_pricing';
  private static readonly MASTER_DATA_KEY = 'master_data_pricing_configs';

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
      
      return true;
    } catch (error) {
      console.error('❌ Restore failed:', error);
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
    
    return allConfigs;
  }
}