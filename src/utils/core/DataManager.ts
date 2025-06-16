
import { IndexedDBService } from '../storage/IndexedDBService';

interface DataManagerConfig<T> {
  key: string;
  defaultData: T;
  version: number;
}

interface StoredData<T> {
  id: string;
  data: T;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export class DataManager<T> {
  public config: DataManagerConfig<T>;
  private service: IndexedDBService<StoredData<T>>;
  private memoryCache: T | null = null;
  private isInitialized = false;

  constructor(config: DataManagerConfig<T>) {
    this.config = config;
    this.service = new IndexedDBService<StoredData<T>>({
      storeName: 'masterData'
    });
  }

  private getVersionKey(): string {
    return `${this.config.key}_version`;
  }

  private getInitializedKey(): string {
    return `${this.config.key}_initialized`;
  }

  private createStoredData(data: T): StoredData<T> {
    const now = new Date().toISOString();
    return {
      id: this.config.key,
      data,
      version: this.config.version,
      createdAt: now,
      updatedAt: now
    };
  }

  protected validateDataStructure(data: any): boolean {
    return data !== null && data !== undefined;
  }

  async loadData(): Promise<T> {
    console.log(`=== DataManager.loadData() START for key: ${this.config.key} ===`);
    
    try {
      // Check memory cache first
      if (this.memoryCache && this.isInitialized) {
        console.log(`✅ Returning cached data for ${this.config.key}`);
        return this.memoryCache;
      }

      // Try to load from IndexedDB
      const storedData = await this.service.getById(this.config.key);
      console.log(`📦 Raw stored data for ${this.config.key}:`, storedData);
      
      if (storedData && this.validateDataStructure(storedData.data)) {
        console.log(`✅ Successfully loaded data for ${this.config.key}`);
        this.memoryCache = storedData.data;
        this.isInitialized = true;
        return storedData.data;
      }

      // Try migration from localStorage
      const migrationData = await this.migrateFromLocalStorage();
      if (migrationData) {
        await this.saveData(migrationData);
        this.memoryCache = migrationData;
        this.isInitialized = true;
        return migrationData;
      }

      // Fallback to defaults
      console.log(`❌ No existing data found for ${this.config.key}. Using defaults.`);
      await this.saveData(this.config.defaultData);
      this.memoryCache = this.config.defaultData;
      this.isInitialized = true;
      return this.config.defaultData;
      
    } catch (error) {
      console.error(`❌ Error loading data for ${this.config.key}:`, error);
      this.memoryCache = this.config.defaultData;
      this.isInitialized = true;
      return this.config.defaultData;
    } finally {
      console.log(`=== DataManager.loadData() END ===`);
    }
  }

  async saveData(data: T): Promise<void> {
    try {
      console.log(`=== DataManager.saveData() START for key: ${this.config.key} ===`);
      console.log(`💾 Saving data:`, data);
      
      if (!this.validateDataStructure(data)) {
        throw new Error(`Invalid data structure for ${this.config.key}`);
      }
      
      const storedData = this.createStoredData(data);
      await this.service.put(storedData);
      
      this.memoryCache = data;
      this.isInitialized = true;
      
      console.log(`✅ Data saved successfully for ${this.config.key}`);
      console.log(`=== DataManager.saveData() END ===`);
    } catch (error) {
      console.error(`❌ Error saving data for ${this.config.key}:`, error);
      throw error;
    }
  }

  async clearData(): Promise<void> {
    console.log(`🗑️ Clearing all data for ${this.config.key}`);
    try {
      await this.service.delete(this.config.key);
      this.memoryCache = null;
      this.isInitialized = false;
      console.log(`✅ All data cleared for ${this.config.key}`);
    } catch (error) {
      console.error(`❌ Error clearing data for ${this.config.key}:`, error);
      throw error;
    }
  }

  async resetToDefault(): Promise<T> {
    console.log(`🔄 Resetting ${this.config.key} to default data`);
    await this.clearData();
    await this.saveData(this.config.defaultData);
    return this.config.defaultData;
  }

  private async migrateFromLocalStorage(): Promise<T | null> {
    try {
      console.log(`🔄 Attempting localStorage migration for ${this.config.key}`);
      
      // Try main key
      const stored = localStorage.getItem(this.config.key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (this.validateDataStructure(parsed)) {
          console.log(`✅ Migrated data from localStorage for ${this.config.key}`);
          // Clean up localStorage after successful migration
          localStorage.removeItem(this.config.key);
          localStorage.removeItem(this.getVersionKey());
          localStorage.removeItem(this.getInitializedKey());
          return parsed;
        }
      }

      // Try backup
      const backup = localStorage.getItem(`${this.config.key}_backup`);
      if (backup) {
        const parsed = JSON.parse(backup);
        if (this.validateDataStructure(parsed)) {
          console.log(`✅ Migrated backup data from localStorage for ${this.config.key}`);
          localStorage.removeItem(`${this.config.key}_backup`);
          return parsed;
        }
      }

      return null;
    } catch (error) {
      console.error(`❌ Error during localStorage migration for ${this.config.key}:`, error);
      return null;
    }
  }

  // Legacy sync methods for backward compatibility
  loadDataSync(): T {
    if (this.memoryCache && this.isInitialized) {
      return this.memoryCache;
    }
    return this.config.defaultData;
  }

  saveDataSync(data: T): void {
    this.memoryCache = data;
    // Fire and forget async save
    this.saveData(data).catch(error => {
      console.error(`❌ Background save failed for ${this.config.key}:`, error);
    });
  }

  debugCurrentState(): void {
    console.log(`=== DEBUG STATE for ${this.config.key} ===`);
    console.log(`Memory cache:`, this.memoryCache);
    console.log(`Is initialized:`, this.isInitialized);
    console.log(`=== END DEBUG STATE ===`);
  }
}

export type { DataManagerConfig };
