
import { DataManagerConfig } from './DataManager';

export interface UniversalDataConfig<T> extends DataManagerConfig<T> {
  seedFunction?: () => T;
  validationFunction?: (data: any) => boolean;
}

export class UniversalDataManager<T> {
  private config: UniversalDataConfig<T>;
  private memoryCache: T | null = null;
  private isInitialized = false;

  constructor(config: UniversalDataConfig<T>) {
    this.config = config;
    console.log(`🔧 UniversalDataManager initialized for ${config.key}`);
  }

  private getStorageKeys() {
    return {
      main: this.config.key,
      session: `${this.config.key}_session`,
      backup: `${this.config.key}_backup`,
      version: `${this.config.key}_version`,
      initialized: `${this.config.key}_initialized`
    };
  }

  private validateData(data: any): boolean {
    if (this.config.validationFunction) {
      return this.config.validationFunction(data);
    }
    return data !== null && data !== undefined;
  }

  private saveToStorage(data: T): void {
    const keys = this.getStorageKeys();
    const jsonData = JSON.stringify(data);
    
    try {
      // Triple-redundancy storage
      localStorage.setItem(keys.main, jsonData);
      sessionStorage.setItem(keys.session, jsonData);
      localStorage.setItem(keys.backup, jsonData);
      localStorage.setItem(keys.version, this.config.version.toString());
      localStorage.setItem(keys.initialized, 'true');
      
      // Memory cache
      this.memoryCache = data;
      
      console.log(`✅ Data saved with triple redundancy for ${this.config.key}`);
    } catch (error) {
      console.error(`❌ Error saving data for ${this.config.key}:`, error);
      throw error;
    }
  }

  private loadFromStorage(): T | null {
    const keys = this.getStorageKeys();
    
    // Try loading from multiple sources
    const sources = [
      { name: 'localStorage', getter: () => localStorage.getItem(keys.main) },
      { name: 'sessionStorage', getter: () => sessionStorage.getItem(keys.session) },
      { name: 'backup', getter: () => localStorage.getItem(keys.backup) },
      { name: 'memory', getter: () => this.memoryCache ? JSON.stringify(this.memoryCache) : null }
    ];

    for (const source of sources) {
      try {
        const stored = source.getter();
        if (stored) {
          const parsed = JSON.parse(stored);
          if (this.validateData(parsed)) {
            console.log(`✅ Data loaded from ${source.name} for ${this.config.key}`);
            this.memoryCache = parsed;
            return parsed;
          }
        }
      } catch (error) {
        console.warn(`⚠️ Failed to load from ${source.name} for ${this.config.key}:`, error);
      }
    }

    return null;
  }

  private seedData(): T {
    console.log(`🌱 Seeding default data for ${this.config.key}`);
    
    let data: T;
    if (this.config.seedFunction) {
      data = this.config.seedFunction();
    } else {
      data = this.config.defaultData;
    }
    
    this.saveToStorage(data);
    return data;
  }

  loadData(): T {
    console.log(`🔄 Loading data for ${this.config.key}`);
    
    // Try to load existing data
    const existingData = this.loadFromStorage();
    if (existingData) {
      this.isInitialized = true;
      return existingData;
    }

    // Seed if no data found
    console.log(`📦 No existing data found for ${this.config.key}, seeding defaults`);
    const seededData = this.seedData();
    this.isInitialized = true;
    return seededData;
  }

  saveData(data: T): void {
    console.log(`💾 Saving data for ${this.config.key}`);
    
    if (!this.validateData(data)) {
      throw new Error(`Invalid data structure for ${this.config.key}`);
    }
    
    this.saveToStorage(data);
  }

  forceReseed(): T {
    console.log(`🔄 Force reseeding data for ${this.config.key}`);
    return this.seedData();
  }

  clearAllData(): void {
    const keys = this.getStorageKeys();
    localStorage.removeItem(keys.main);
    sessionStorage.removeItem(keys.session);
    localStorage.removeItem(keys.backup);
    localStorage.removeItem(keys.version);
    localStorage.removeItem(keys.initialized);
    this.memoryCache = null;
    this.isInitialized = false;
    console.log(`🗑️ All data cleared for ${this.config.key}`);
  }

  getDataHealth(): { 
    localStorage: boolean; 
    sessionStorage: boolean; 
    backup: boolean; 
    memory: boolean;
    isValid: boolean;
  } {
    const keys = this.getStorageKeys();
    return {
      localStorage: !!localStorage.getItem(keys.main),
      sessionStorage: !!sessionStorage.getItem(keys.session),
      backup: !!localStorage.getItem(keys.backup),
      memory: !!this.memoryCache,
      isValid: this.isInitialized
    };
  }
}
