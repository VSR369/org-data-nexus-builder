import { UniversalDataManager, UniversalDataConfig } from './UniversalDataManager';

export interface EnhancedDataConfig<T> extends UniversalDataConfig<T> {
  autoBackupInterval?: number; // minutes
  maxBackupVersions?: number;
  enableIntegrityChecks?: boolean;
}

export class EnhancedUniversalDataManager<T> extends UniversalDataManager<T> {
  private config: EnhancedDataConfig<T>;
  private backupInterval: NodeJS.Timeout | null = null;
  private integrityCheckInterval: NodeJS.Timeout | null = null;

  constructor(config: EnhancedDataConfig<T>) {
    super(config);
    this.config = {
      autoBackupInterval: 5, // Default 5 minutes
      maxBackupVersions: 10, // Keep 10 backup versions
      enableIntegrityChecks: true,
      ...config
    };
    
    this.initializeEnhancedFeatures();
  }

  private initializeEnhancedFeatures(): void {
    // Start automatic backup if enabled
    if (this.config.autoBackupInterval && this.config.autoBackupInterval > 0) {
      this.startAutoBackup();
    }

    // Start integrity checks if enabled
    if (this.config.enableIntegrityChecks) {
      this.startIntegrityChecks();
    }

    // Listen for page visibility changes to check data integrity
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.performIntegrityCheck();
        }
      });
    }
  }

  private startAutoBackup(): void {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
    }

    this.backupInterval = setInterval(() => {
      this.createBackupVersion();
    }, (this.config.autoBackupInterval || 5) * 60 * 1000);

    console.log(`🔄 Auto-backup enabled for ${this.config.key} every ${this.config.autoBackupInterval} minutes`);
  }

  private startIntegrityChecks(): void {
    if (this.integrityCheckInterval) {
      clearInterval(this.integrityCheckInterval);
    }

    // Check integrity every 30 seconds
    this.integrityCheckInterval = setInterval(() => {
      this.performIntegrityCheck();
    }, 30000);

    console.log(`🔍 Integrity checks enabled for ${this.config.key}`);
  }

  private createBackupVersion(): void {
    try {
      const currentData = this.loadData();
      const backupKey = `${this.config.key}_backup_${Date.now()}`;
      const backupData = {
        data: currentData,
        timestamp: new Date().toISOString(),
        version: this.config.version
      };

      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // Clean up old backups
      this.cleanupOldBackups();
      
      console.log(`💾 Backup created for ${this.config.key}: ${backupKey}`);
    } catch (error) {
      console.error(`❌ Failed to create backup for ${this.config.key}:`, error);
    }
  }

  private cleanupOldBackups(): void {
    try {
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${this.config.key}_backup_`))
        .sort();

      const maxVersions = this.config.maxBackupVersions || 10;
      if (backupKeys.length > maxVersions) {
        const keysToRemove = backupKeys.slice(0, backupKeys.length - maxVersions);
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          console.log(`🗑️ Removed old backup: ${key}`);
        });
      }
    } catch (error) {
      console.error(`❌ Failed to cleanup old backups for ${this.config.key}:`, error);
    }
  }

  private performIntegrityCheck(): void {
    try {
      const stored = localStorage.getItem(this.config.key);
      if (!stored) {
        console.warn(`⚠️ Missing data detected for ${this.config.key}, attempting recovery...`);
        this.attemptRecovery();
        return;
      }

      const parsed = JSON.parse(stored);
      if (!this.validateData(parsed)) {
        console.warn(`⚠️ Invalid data detected for ${this.config.key}, attempting recovery...`);
        this.attemptRecovery();
        return;
      }

      console.log(`✅ Integrity check passed for ${this.config.key}`);
    } catch (error) {
      console.error(`❌ Integrity check failed for ${this.config.key}:`, error);
      this.attemptRecovery();
    }
  }

  private attemptRecovery(): void {
    console.log(`🔧 Attempting recovery for ${this.config.key}...`);

    // Try to recover from latest backup
    const recoveredData = this.recoverFromBackup();
    if (recoveredData) {
      this.saveData(recoveredData);
      console.log(`✅ Recovered ${this.config.key} from backup`);
      
      // Notify about recovery
      this.notifyRecovery('backup');
      return;
    }

    // Try to recover from session storage
    const sessionData = this.recoverFromSession();
    if (sessionData) {
      this.saveData(sessionData);
      console.log(`✅ Recovered ${this.config.key} from session storage`);
      
      // Notify about recovery
      this.notifyRecovery('session');
      return;
    }

    // Fall back to seeding default data
    console.log(`🌱 No recovery possible, seeding default data for ${this.config.key}`);
    this.forceReseed();
    this.notifyRecovery('default');
  }

  private recoverFromBackup(): T | null {
    try {
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${this.config.key}_backup_`))
        .sort()
        .reverse(); // Latest first

      for (const backupKey of backupKeys) {
        try {
          const backupData = JSON.parse(localStorage.getItem(backupKey) || '');
          if (backupData && backupData.data && this.validateData(backupData.data)) {
            console.log(`🔄 Recovered from backup: ${backupKey}`);
            return backupData.data;
          }
        } catch (error) {
          console.warn(`⚠️ Invalid backup ${backupKey}:`, error);
        }
      }
    } catch (error) {
      console.error(`❌ Backup recovery failed for ${this.config.key}:`, error);
    }

    return null;
  }

  private recoverFromSession(): T | null {
    try {
      const sessionKey = `${this.config.key}_session`;
      const sessionData = sessionStorage.getItem(sessionKey);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (this.validateData(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error(`❌ Session recovery failed for ${this.config.key}:`, error);
    }

    return null;
  }

  private notifyRecovery(source: 'backup' | 'session' | 'default'): void {
    // In a real app, you might want to show a toast notification
    console.log(`🔔 Data recovery notification: ${this.config.key} recovered from ${source}`);
    
    // Store recovery event for diagnostics
    const recoveryEvent = {
      key: this.config.key,
      source,
      timestamp: new Date().toISOString()
    };
    
    const recoveryHistory = JSON.parse(localStorage.getItem('data_recovery_history') || '[]');
    recoveryHistory.push(recoveryEvent);
    
    // Keep only last 50 recovery events
    if (recoveryHistory.length > 50) {
      recoveryHistory.splice(0, recoveryHistory.length - 50);
    }
    
    localStorage.setItem('data_recovery_history', JSON.stringify(recoveryHistory));
  }

  public getRecoveryHistory(): any[] {
    try {
      return JSON.parse(localStorage.getItem('data_recovery_history') || '[]')
        .filter((event: any) => event.key === this.config.key);
    } catch (error) {
      return [];
    }
  }

  public getAvailableBackups(): string[] {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(`${this.config.key}_backup_`))
      .sort()
      .reverse();
  }

  public restoreFromBackup(backupKey: string): boolean {
    try {
      const backupData = JSON.parse(localStorage.getItem(backupKey) || '');
      if (backupData && backupData.data && this.validateData(backupData.data)) {
        this.saveData(backupData.data);
        console.log(`✅ Restored ${this.config.key} from backup: ${backupKey}`);
        return true;
      }
    } catch (error) {
      console.error(`❌ Failed to restore from backup ${backupKey}:`, error);
    }
    return false;
  }

  public destroy(): void {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
    }
    if (this.integrityCheckInterval) {
      clearInterval(this.integrityCheckInterval);
    }
  }

  // Override saveData to create backup before saving
  saveData(data: T): void {
    // Create backup before saving new data
    this.createBackupVersion();
    
    // Call parent saveData
    super.saveData(data);
  }
}
