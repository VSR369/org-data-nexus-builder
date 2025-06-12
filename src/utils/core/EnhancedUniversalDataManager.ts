
import { UniversalDataManager, UniversalDataConfig } from './UniversalDataManager';

export interface EnhancedDataConfig<T> extends UniversalDataConfig<T> {
  migrationFunction?: () => T | null;
  recoveryFunction?: () => T | null;
  cleanupFunction?: () => void;
}

export class EnhancedUniversalDataManager<T> {
  private manager: UniversalDataManager<T>;
  private enhancedConfig: EnhancedDataConfig<T>;

  constructor(config: EnhancedDataConfig<T>) {
    this.enhancedConfig = config;
    this.manager = new UniversalDataManager(config);
    console.log(`🔧 EnhancedUniversalDataManager initialized for ${config.key}`);
  }

  private validateDataStructure(data: any): boolean {
    return data && typeof data === 'object';
  }

  private migrateFromOldKeys(): T | null {
    if (this.enhancedConfig.migrationFunction) {
      return this.enhancedConfig.migrationFunction();
    }
    return null;
  }

  private tryRecovery(): T | null {
    if (this.enhancedConfig.recoveryFunction) {
      return this.enhancedConfig.recoveryFunction();
    }
    return null;
  }

  private cleanupOldKeys(): void {
    if (this.enhancedConfig.cleanupFunction) {
      this.enhancedConfig.cleanupFunction();
    }
  }

  private hasValidContent(data: T): boolean {
    return data !== null && data !== undefined;
  }

  loadData(): T {
    console.log(`=== Enhanced DataManager.loadData() START for key: ${this.enhancedConfig.key} ===`);
    
    try {
      // First try normal data loading
      const stored = localStorage.getItem(this.enhancedConfig.key);
      console.log(`📦 Raw stored data: ${stored}`);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        if (this.validateDataStructure(parsed) && this.hasValidContent(parsed)) {
          console.log(`✅ Successfully loaded data: ${JSON.stringify(parsed, null, 2)}`);
          console.log(`=== Enhanced DataManager.loadData() END - Success for ${this.enhancedConfig.key} ===`);
          return parsed;
        } else {
          console.log(`⚠️ Data structure validation failed, trying recovery...`);
        }
      }

      // Try migration from old keys
      const migratedData = this.migrateFromOldKeys();
      if (migratedData && this.validateDataStructure(migratedData) && this.hasValidContent(migratedData)) {
        console.log(`🔄 Successfully migrated data from old keys`);
        this.manager.saveData(migratedData);
        this.cleanupOldKeys();
        return migratedData;
      }

      // Try recovery mechanisms
      const recoveredData = this.tryRecovery();
      if (recoveredData && this.validateDataStructure(recoveredData) && this.hasValidContent(recoveredData)) {
        console.log(`🔄 Successfully recovered data`);
        this.manager.saveData(recoveredData);
        return recoveredData;
      }

      // Fall back to manager's default behavior
      console.log(`⚠️ No recovery possible, falling back to default data loading`);
      return this.manager.loadData();
      
    } catch (error) {
      console.error(`❌ Enhanced loadData error: ${error}`);
      return this.manager.loadData();
    }
  }

  saveData(data: T): void {
    this.manager.saveData(data);
  }

  forceReseed(): T {
    return this.manager.forceReseed();
  }

  clearAllData(): void {
    this.manager.clearAllData();
  }

  getDataHealth() {
    return this.manager.getDataHealth();
  }
}
