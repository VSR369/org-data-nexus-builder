
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

  private getCurrentVersion(): number {
    const stored = localStorage.getItem(this.getVersionKey());
    return stored ? parseInt(stored, 10) : 0;
  }

  private isVersionCurrent(): boolean {
    return this.getCurrentVersion() === this.config.version;
  }

  private updateVersion(): void {
    localStorage.setItem(this.getVersionKey(), this.config.version.toString());
  }

  loadData(): T {
    try {
      // Check if version is current, if not, clear old data
      if (!this.isVersionCurrent()) {
        this.clearData();
        this.updateVersion();
        return this.config.defaultData;
      }

      const stored = localStorage.getItem(this.config.key);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed;
      }
    } catch (error) {
      console.error(`Error loading data for ${this.config.key}:`, error);
      this.clearData();
    }
    
    return this.config.defaultData;
  }

  saveData(data: T): void {
    try {
      localStorage.setItem(this.config.key, JSON.stringify(data));
      this.updateVersion();
    } catch (error) {
      console.error(`Error saving data for ${this.config.key}:`, error);
    }
  }

  clearData(): void {
    localStorage.removeItem(this.config.key);
    localStorage.removeItem(this.getVersionKey());
  }

  resetToDefault(): T {
    this.clearData();
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
    });
    console.log('All master data cache cleared');
  }

  static getStoredKeys(): string[] {
    return Array.from(this.keys);
  }
}
