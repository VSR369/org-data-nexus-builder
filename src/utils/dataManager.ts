
interface DataManagerConfig<T> {
  key: string;
  defaultData: T;
  version: number;
}

export class DataManager<T> {
  private config: DataManagerConfig<T>;

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

  private markAsInitialized(): void {
    localStorage.setItem(this.getInitializedKey(), 'true');
  }

  private updateVersion(): void {
    localStorage.setItem(this.getVersionKey(), this.config.version.toString());
  }

  loadData(): T {
    console.log(`DataManager.loadData() called for key: ${this.config.key}`);
    
    try {
      // Check if version is current, if not, clear old data
      if (!this.isVersionCurrent()) {
        console.log(`Version mismatch for ${this.config.key}. Clearing old data.`);
        this.clearData();
        this.updateVersion();
        this.markAsInitialized();
        this.saveData(this.config.defaultData);
        return this.config.defaultData;
      }

      // If never initialized, use default data and mark as initialized
      if (!this.isInitialized()) {
        console.log(`${this.config.key} not initialized. Using default data.`);
        this.markAsInitialized();
        this.saveData(this.config.defaultData);
        return this.config.defaultData;
      }

      // Try to load saved data
      const stored = localStorage.getItem(this.config.key);
      console.log(`Raw stored data for ${this.config.key}:`, stored);
      
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        console.log(`Parsed data for ${this.config.key}:`, parsed);
        console.log(`Data type: ${typeof parsed}, Array: ${Array.isArray(parsed)}, Length: ${Array.isArray(parsed) ? parsed.length : 'N/A'}`);
        return parsed;
      }
    } catch (error) {
      console.error(`Error loading data for ${this.config.key}:`, error);
      this.clearData();
    }
    
    // Fallback to default data
    console.log(`Falling back to default data for ${this.config.key}`);
    this.markAsInitialized();
    this.saveData(this.config.defaultData);
    return this.config.defaultData;
  }

  saveData(data: T): void {
    try {
      console.log(`DataManager.saveData() called for key: ${this.config.key}`);
      console.log(`Saving data:`, data);
      console.log(`Data type: ${typeof data}, Array: ${Array.isArray(data)}, Length: ${Array.isArray(data) ? (data as any).length : 'N/A'}`);
      
      localStorage.setItem(this.config.key, JSON.stringify(data));
      this.updateVersion();
      this.markAsInitialized();
      
      console.log(`Data saved successfully for ${this.config.key}`);
      
      // Verify the save worked
      const verification = localStorage.getItem(this.config.key);
      console.log(`Verification - stored data:`, verification);
    } catch (error) {
      console.error(`Error saving data for ${this.config.key}:`, error);
    }
  }

  clearData(): void {
    console.log(`Clearing all data for ${this.config.key}`);
    localStorage.removeItem(this.config.key);
    localStorage.removeItem(this.getVersionKey());
    localStorage.removeItem(this.getInitializedKey());
  }

  resetToDefault(): T {
    console.log(`Resetting ${this.config.key} to default data`);
    this.clearData();
    this.markAsInitialized();
    this.saveData(this.config.defaultData);
    return this.config.defaultData;
  }
}

// Global cache manager
export class GlobalCacheManager {
  private static keys = new Set<string>();

  static registerKey(key: string): void {
    this.keys.add(key);
  }

  static clearAllCache(): void {
    this.keys.forEach(key => {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_version`);
      localStorage.removeItem(`${key}_initialized`);
    });
    
    // Also clear old keys that might be lingering
    localStorage.removeItem('industrySegments');
    
    console.log('All master data cache cleared');
  }

  static getStoredKeys(): string[] {
    return Array.from(this.keys);
  }
}
