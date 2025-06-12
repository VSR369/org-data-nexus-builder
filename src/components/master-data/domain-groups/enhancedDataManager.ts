
import { DataManager, DataManagerConfig } from '@/utils/core/DataManager';

export class EnhancedDataManager<T> extends DataManager<T> {
  constructor(config: DataManagerConfig<T>) {
    super(config);
  }

  // Override to provide better data structure validation
  protected validateDataStructure(data: any): boolean {
    return data && typeof data === 'object';
  }

  // Override to provide better migration logic
  protected migrateFromOldKeys(): T | null {
    return null; // To be overridden by subclasses
  }

  // Override to provide better recovery logic
  protected tryRecovery(): T | null {
    return null; // To be overridden by subclasses
  }

  // Override to provide better cleanup logic
  protected cleanupOldKeys(): void {
    // To be overridden by subclasses
  }

  // Override to provide better content validation
  protected hasValidContent(data: T): boolean {
    return data !== null && data !== undefined;
  }

  // Enhanced load method that tries multiple recovery strategies
  loadData(): T {
    console.log(`=== Enhanced DataManager.loadData() START for key: ${this.config.key} ===`);
    
    try {
      // First try normal data loading
      const stored = localStorage.getItem(this.config.key);
      console.log(`📦 Raw stored data: ${stored}`);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        if (this.validateDataStructure(parsed) && this.hasValidContent(parsed)) {
          console.log(`✅ Successfully loaded data: ${JSON.stringify(parsed, null, 2)}`);
          
          // Update version if needed
          if (this.getCurrentVersion() !== this.config.version) {
            this.updateVersion();
            this.markAsInitialized();
          }
          
          console.log(`=== Enhanced DataManager.loadData() END - Success for ${this.config.key} ===`);
          return parsed;
        } else {
          console.log(`⚠️ Data structure validation failed, trying recovery...`);
        }
      }

      // Try migration from old keys
      const migratedData = this.migrateFromOldKeys();
      if (migratedData && this.validateDataStructure(migratedData) && this.hasValidContent(migratedData)) {
        console.log(`🔄 Successfully migrated data from old keys`);
        this.saveData(migratedData);
        this.cleanupOldKeys();
        return migratedData;
      }

      // Try recovery mechanisms
      const recoveredData = this.tryRecovery();
      if (recoveredData && this.validateDataStructure(recoveredData) && this.hasValidContent(recoveredData)) {
        console.log(`🔄 Successfully recovered data`);
        this.saveData(recoveredData);
        return recoveredData;
      }

      // Fall back to parent class behavior (which now includes backup recovery)
      console.log(`⚠️ No recovery possible, falling back to parent class loadData`);
      return super.loadData();
      
    } catch (error) {
      console.error(`❌ Enhanced loadData error: ${error}`);
      return super.loadData();
    }
  }

  private getCurrentVersion(): number {
    const stored = localStorage.getItem(`${this.config.key}_version`);
    return stored ? parseInt(stored, 10) : 0;
  }

  private updateVersion(): void {
    localStorage.setItem(`${this.config.key}_version`, this.config.version.toString());
  }

  private markAsInitialized(): void {
    localStorage.setItem(`${this.config.key}_initialized`, 'true');
  }
}
