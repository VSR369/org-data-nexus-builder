
import { IndexedDBService } from '../storage/IndexedDBService';

export interface AsyncDataManagerConfig<T> {
  key: string;
  defaultData: T;
  version: number;
  storeName: string;
  validateData?: (data: any) => boolean;
  migrateData?: (oldData: any, oldVersion: number) => T;
}

interface StoredData<T> {
  id: string;
  data: T;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export class AsyncDataManager<T> {
  private config: AsyncDataManagerConfig<T>;
  private service: IndexedDBService<StoredData<T>>;
  private memoryCache: T | null = null;
  private isInitialized = false;

  constructor(config: AsyncDataManagerConfig<T>) {
    this.config = config;
    this.service = new IndexedDBService<StoredData<T>>({
      storeName: config.storeName
    });
  }

  private validateDataStructure(data: any): boolean {
    if (this.config.validateData) {
      return this.config.validateData(data);
    }
    return data !== null && data !== undefined;
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

  async loadData(): Promise<T> {
    console.log(`=== AsyncDataManager.loadData() START for key: ${this.config.key} ===`);
    
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
        // Handle version migration if needed
        if (storedData.version !== this.config.version && this.config.migrateData) {
          console.log(`🔄 Migrating data from version ${storedData.version} to ${this.config.version}`);
          const migratedData = this.config.migrateData(storedData.data, storedData.version);
          await this.saveData(migratedData);
          this.memoryCache = migratedData;
          this.isInitialized = true;
          return migratedData;
        }
        
        console.log(`✅ Successfully loaded data for ${this.config.key}`);
        this.memoryCache = storedData.data;
        this.isInitialized = true;
        return storedData.data;
      }

      // No valid data found, check environment
      if (process.env.NODE_ENV === 'development') {
        console.log(`🌱 Development mode: Using default data for ${this.config.key}`);
        await this.saveData(this.config.defaultData);
        this.memoryCache = this.config.defaultData;
        this.isInitialized = true;
        return this.config.defaultData;
      }

      // Production mode: return empty structure to prompt user
      console.log(`⚠️ Production mode: No data found for ${this.config.key}`);
      this.isInitialized = true;
      return this.config.defaultData;
      
    } catch (error) {
      console.error(`❌ Error loading data for ${this.config.key}:`, error);
      
      // Fallback to default data
      console.log(`🔧 Using defaults after error for ${this.config.key}`);
      this.memoryCache = this.config.defaultData;
      this.isInitialized = true;
      return this.config.defaultData;
    } finally {
      console.log(`=== AsyncDataManager.loadData() END ===`);
    }
  }

  async saveData(data: T): Promise<void> {
    try {
      console.log(`=== AsyncDataManager.saveData() START for key: ${this.config.key} ===`);
      console.log(`💾 Saving data:`, data);
      
      if (!this.validateDataStructure(data)) {
        throw new Error(`Invalid data structure for ${this.config.key}`);
      }
      
      const storedData = this.createStoredData(data);
      await this.service.put(storedData);
      
      // Update memory cache
      this.memoryCache = data;
      this.isInitialized = true;
      
      console.log(`✅ Data saved successfully for ${this.config.key}`);
      console.log(`=== AsyncDataManager.saveData() END ===`);
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

  async exists(): Promise<boolean> {
    try {
      const storedData = await this.service.getById(this.config.key);
      return !!storedData;
    } catch {
      return false;
    }
  }

  getMemoryCache(): T | null {
    return this.memoryCache;
  }

  isDataInitialized(): boolean {
    return this.isInitialized;
  }
}
