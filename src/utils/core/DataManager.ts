
interface DataManagerConfig<T> {
  key: string;
  defaultData: T;
  version: number;
}

export class DataManager<T> {
  public config: DataManagerConfig<T>; // Make config public so it can be accessed for migrations

  constructor(config: DataManagerConfig<T>) {
    this.config = config;
  }

  private getVersionKey(): string {
    return `${this.config.key}_version`;
  }

  private getInitializedKey(): string {
    return `${this.config.key}_initialized`;
  }

  private getCurrentVersion(): number {
    const stored = localStorage.getItem(this.getVersionKey());
    return stored ? parseInt(stored, 10) : 0;
  }

  private isVersionCurrent(): boolean {
    return this.getCurrentVersion() === this.config.version;
  }

  private isInitialized(): boolean {
    return localStorage.getItem(this.getInitializedKey()) === 'true';
  }

  protected markAsInitialized(): void {
    localStorage.setItem(this.getInitializedKey(), 'true');
  }

  protected updateVersion(): void {
    localStorage.setItem(this.getVersionKey(), this.config.version.toString());
  }

  // NEW: Backup existing data before any destructive operations
  private backupExistingData(): T | null {
    try {
      const stored = localStorage.getItem(this.config.key);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log(`📦 Backing up existing data for ${this.config.key}:`, parsed);
        localStorage.setItem(`${this.config.key}_backup`, stored);
        return parsed;
      }
    } catch (error) {
      console.error(`❌ Error backing up data for ${this.config.key}:`, error);
    }
    return null;
  }

  // NEW: Attempt to recover from backup
  private recoverFromBackup(): T | null {
    try {
      const backup = localStorage.getItem(`${this.config.key}_backup`);
      if (backup) {
        const parsed = JSON.parse(backup);
        console.log(`🔄 Recovering from backup for ${this.config.key}:`, parsed);
        return parsed;
      }
    } catch (error) {
      console.error(`❌ Error recovering backup for ${this.config.key}:`, error);
    }
    return null;
  }

  // NEW: Validate data structure without being destructive
  protected validateDataStructure(data: any): boolean {
    // Basic validation - can be overridden by subclasses
    return data !== null && data !== undefined;
  }

  loadData(): T {
    console.log(`=== DataManager.loadData() START for key: ${this.config.key} ===`);
    console.log(`Current version: ${this.getCurrentVersion()}, Expected version: ${this.config.version}`);
    console.log(`Is initialized: ${this.isInitialized()}, Is version current: ${this.isVersionCurrent()}`);
    
    try {
      // Always try to load existing data first
      const stored = localStorage.getItem(this.config.key);
      console.log(`📦 Raw stored data for ${this.config.key}:`, stored);
      
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        console.log(`✅ Successfully parsed data for ${this.config.key}:`, parsed);
        
        // Validate the data structure
        if (this.validateDataStructure(parsed)) {
          // If version mismatch but data is valid, just update version without clearing
          if (!this.isVersionCurrent()) {
            console.log(`🔄 Version mismatch for ${this.config.key}, but data is valid. Updating version only.`);
            this.updateVersion();
            this.markAsInitialized();
          }
          
          // Mark as initialized if not already
          if (!this.isInitialized()) {
            this.markAsInitialized();
          }
          
          console.log(`=== DataManager.loadData() END - Returned existing valid data ===`);
          return parsed;
        } else {
          console.log(`⚠️ Data structure validation failed for ${this.config.key}`);
        }
      }

      // If no valid data found, try backup recovery
      const backupData = this.recoverFromBackup();
      if (backupData && this.validateDataStructure(backupData)) {
        console.log(`🔄 Recovered valid data from backup for ${this.config.key}`);
        this.saveData(backupData);
        return backupData;
      }

      // Only use defaults if no existing data found
      console.log(`❌ No existing data found for ${this.config.key}. Using defaults.`);
      this.markAsInitialized();
      this.updateVersion();
      this.saveData(this.config.defaultData);
      console.log(`=== DataManager.loadData() END - Returned default data ===`);
      return this.config.defaultData;
      
    } catch (error) {
      console.error(`❌ Error loading data for ${this.config.key}:`, error);
      
      // Try backup recovery on error
      const backupData = this.recoverFromBackup();
      if (backupData && this.validateDataStructure(backupData)) {
        console.log(`🔄 Recovered from backup after error for ${this.config.key}`);
        this.saveData(backupData);
        return backupData;
      }
      
      // Final fallback to defaults
      console.log(`🔧 Using defaults after error for ${this.config.key}`);
      this.markAsInitialized();
      this.updateVersion();
      this.saveData(this.config.defaultData);
      return this.config.defaultData;
    }
  }

  saveData(data: T): void {
    try {
      console.log(`=== DataManager.saveData() START for key: ${this.config.key} ===`);
      console.log(`💾 Saving data:`, data);
      
      // Backup existing data before saving new data
      this.backupExistingData();
      
      const jsonString = JSON.stringify(data);
      console.log(`📝 JSON string to save: ${jsonString}`);
      
      localStorage.setItem(this.config.key, jsonString);
      this.updateVersion();
      this.markAsInitialized();
      
      console.log(`✅ Data saved successfully for ${this.config.key}`);
      console.log(`=== DataManager.saveData() END ===`);
    } catch (error) {
      console.error(`❌ Error saving data for ${this.config.key}:`, error);
    }
  }

  clearData(): void {
    console.log(`🗑️ Clearing all data for ${this.config.key}`);
    // Backup before clearing
    this.backupExistingData();
    localStorage.removeItem(this.config.key);
    localStorage.removeItem(this.getVersionKey());
    localStorage.removeItem(this.getInitializedKey());
    console.log(`✅ All data cleared for ${this.config.key}`);
  }

  resetToDefault(): T {
    console.log(`🔄 Resetting ${this.config.key} to default data`);
    this.backupExistingData();
    this.clearData();
    this.markAsInitialized();
    this.updateVersion();
    this.saveData(this.config.defaultData);
    return this.config.defaultData;
  }

  // Add method to check current localStorage state
  debugCurrentState(): void {
    console.log(`=== DEBUG STATE for ${this.config.key} ===`);
    console.log(`Main data:`, localStorage.getItem(this.config.key));
    console.log(`Version:`, localStorage.getItem(this.getVersionKey()));
    console.log(`Initialized:`, localStorage.getItem(this.getInitializedKey()));
    console.log(`Backup:`, localStorage.getItem(`${this.config.key}_backup`));
    console.log(`All localStorage keys:`, Object.keys(localStorage));
    console.log(`=== END DEBUG STATE ===`);
  }
}

export type { DataManagerConfig };
