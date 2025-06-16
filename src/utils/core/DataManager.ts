
import { IndexedDBManager } from './IndexedDBManager';

export interface DataManagerConfig<T> {
  key: string;
  defaultData: T;
  version: number;
  preserveUserData?: boolean;
}

export class DataManager<T> {
  private config: DataManagerConfig<T>;
  private cache: T | null = null;
  private isLoading = false;

  constructor(config: DataManagerConfig<T>) {
    this.config = config;
  }

  // Async version for new components
  async loadData(): Promise<T> {
    if (this.cache !== null && !this.isLoading) {
      return this.cache;
    }

    if (this.isLoading) {
      // Wait for current loading to finish
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      return this.cache || this.config.defaultData;
    }

    this.isLoading = true;
    
    try {
      const data = await IndexedDBManager.getData<T>(this.config.key);
      
      if (data === null || data === undefined) {
        console.log(`📂 No data found for ${this.config.key}, using defaults`);
        this.cache = this.config.defaultData;
        await this.saveData(this.config.defaultData);
      } else {
        this.cache = data;
      }
      
      return this.cache;
    } catch (error) {
      console.error(`❌ Error loading data for ${this.config.key}:`, error);
      this.cache = this.config.defaultData;
      return this.cache;
    } finally {
      this.isLoading = false;
    }
  }

  // Synchronous version for legacy components (uses cache or default)
  loadDataSync(): T {
    if (this.cache !== null) {
      return this.cache;
    }
    
    // Start async load in background
    this.loadData().catch(console.error);
    
    // Return default immediately for sync calls
    return this.config.defaultData;
  }

  async saveData(data: T): Promise<void> {
    try {
      await IndexedDBManager.setData(this.config.key, data);
      this.cache = data;
      console.log(`💾 Saved data for ${this.config.key}`);
    } catch (error) {
      console.error(`❌ Error saving data for ${this.config.key}:`, error);
      throw error;
    }
  }

  saveDataSync(data: T): void {
    this.cache = data;
    // Save async in background
    this.saveData(data).catch(console.error);
  }

  resetToDefault(): T {
    this.cache = this.config.defaultData;
    this.saveDataSync(this.config.defaultData);
    return this.config.defaultData;
  }

  clearCache(): void {
    this.cache = null;
  }
}

// Legacy compatibility for components that expect sync behavior
export class LegacyDataManager<T> extends DataManager<T> {
  loadData(): T {
    return this.loadDataSync();
  }

  saveData(data: T): void {
    this.saveDataSync(data);
  }
}

// Global cache manager for coordinating updates
export class GlobalCacheManager {
  private static registeredKeys: Set<string> = new Set();

  static registerKey(key: string): void {
    this.registeredKeys.add(key);
  }

  static clearAllCaches(): void {
    // This would clear caches if we implement per-instance cache clearing
    console.log('🧹 Clearing all data manager caches');
  }
}
