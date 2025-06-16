
import { indexedDBManager } from '../storage/IndexedDBManager';

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
      // Check if IndexedDB is available and initialized
      if (await indexedDBManager.isInitialized()) {
        const stored = localStorage.getItem(this.config.key);
        const data = stored ? JSON.parse(stored) : null;
        
        if (data === null || data === undefined) {
          console.log(`📂 No data found for ${this.config.key}, using defaults`);
          this.cache = this.config.defaultData;
          await this.saveData(this.config.defaultData);
        } else {
          this.cache = data;
        }
      } else {
        // Fallback to localStorage if IndexedDB not available
        const stored = localStorage.getItem(this.config.key);
        this.cache = stored ? JSON.parse(stored) : this.config.defaultData;
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
    
    // Try to load from localStorage synchronously
    try {
      const stored = localStorage.getItem(this.config.key);
      if (stored) {
        this.cache = JSON.parse(stored);
        return this.cache;
      }
    } catch (error) {
      console.warn(`⚠️ Error loading sync data for ${this.config.key}:`, error);
    }
    
    // Return default if no cached data
    this.cache = this.config.defaultData;
    return this.config.defaultData;
  }

  async saveData(data: T): Promise<void> {
    try {
      // Save to localStorage (immediate)
      localStorage.setItem(this.config.key, JSON.stringify(data));
      this.cache = data;
      console.log(`💾 Saved data for ${this.config.key}`);
    } catch (error) {
      console.error(`❌ Error saving data for ${this.config.key}:`, error);
      throw error;
    }
  }

  saveDataSync(data: T): void {
    try {
      localStorage.setItem(this.config.key, JSON.stringify(data));
      this.cache = data;
      console.log(`💾 Saved sync data for ${this.config.key}`);
    } catch (error) {
      console.error(`❌ Error saving sync data for ${this.config.key}:`, error);
    }
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
export class LegacyDataManager<T> {
  private dataManager: DataManager<T>;

  constructor(config: DataManagerConfig<T>) {
    this.dataManager = new DataManager(config);
  }

  loadData(): T {
    return this.dataManager.loadDataSync();
  }

  saveData(data: T): void {
    this.dataManager.saveDataSync(data);
  }

  resetToDefault(): T {
    return this.dataManager.resetToDefault();
  }

  clearCache(): void {
    this.dataManager.clearCache();
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
