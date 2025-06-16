
interface DBStore {
  name: string;
  keyPath: string;
  indexes?: { name: string; keyPath: string; unique?: boolean }[];
}

interface DBSchema {
  name: string;
  version: number;
  stores: DBStore[];
}

export class IndexedDBManager {
  private static instance: IndexedDBManager;
  private db: IDBDatabase | null = null;
  private schema: DBSchema;

  constructor() {
    this.schema = {
      name: 'lovable-app-db',
      version: 2, // Increment version to trigger upgrade
      stores: [
        {
          name: 'masterData',
          keyPath: 'id',
          indexes: [
            { name: 'type', keyPath: 'type' },
            { name: 'category', keyPath: 'category' }
          ]
        },
        {
          name: 'userProfiles',
          keyPath: 'id' // Changed from 'userId' to 'id' to match the data structure
        },
        {
          name: 'membershipData',
          keyPath: 'id',
          indexes: [
            { name: 'userId', keyPath: 'userId' },
            { name: 'status', keyPath: 'status' }
          ]
        },
        {
          name: 'competencyData',
          keyPath: 'id',
          indexes: [
            { name: 'userId', keyPath: 'userId' },
            { name: 'industrySegment', keyPath: 'industrySegment' }
          ]
        },
        {
          name: 'pricingConfigs',
          keyPath: 'id',
          indexes: [
            { name: 'country', keyPath: 'country' },
            { name: 'engagementModel', keyPath: 'engagementModel' }
          ]
        }
      ]
    };
  }

  static getInstance(): IndexedDBManager {
    if (!IndexedDBManager.instance) {
      IndexedDBManager.instance = new IndexedDBManager();
    }
    return IndexedDBManager.instance;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🗄️ Initializing IndexedDB...');
      
      const request = indexedDB.open(this.schema.name, this.schema.version);

      request.onerror = () => {
        console.error('❌ IndexedDB initialization failed:', request.error);
        reject(request.error);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('✅ IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log('🔄 IndexedDB schema upgrade needed');
        const db = (event.target as IDBOpenDBRequest).result;
        
        this.schema.stores.forEach(storeConfig => {
          // Delete existing store if it exists with wrong keyPath
          if (db.objectStoreNames.contains(storeConfig.name)) {
            console.log(`🗑️ Deleting existing object store: ${storeConfig.name}`);
            db.deleteObjectStore(storeConfig.name);
          }
          
          console.log(`📦 Creating object store: ${storeConfig.name} with keyPath: ${storeConfig.keyPath}`);
          const store = db.createObjectStore(storeConfig.name, { keyPath: storeConfig.keyPath });
          
          // Create indexes
          if (storeConfig.indexes) {
            storeConfig.indexes.forEach(index => {
              console.log(`🔍 Creating index: ${index.name} on ${storeConfig.name}`);
              store.createIndex(index.name, index.keyPath, { unique: index.unique || false });
            });
          }
        });
      };
    });
  }

  getDatabase(): IDBDatabase {
    if (!this.db) {
      throw new Error('IndexedDB not initialized. Call initialize() first.');
    }
    return this.db;
  }

  async isInitialized(): Promise<boolean> {
    try {
      return this.db !== null;
    } catch {
      return false;
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) return;
    
    console.log('🗑️ Clearing all IndexedDB data...');
    const transaction = this.db.transaction(this.schema.stores.map(s => s.name), 'readwrite');
    
    const promises = this.schema.stores.map(store => {
      const objectStore = transaction.objectStore(store.name);
      return new Promise<void>((resolve, reject) => {
        const request = objectStore.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    await Promise.all(promises);
    console.log('✅ All IndexedDB data cleared');
  }
}

export const indexedDBManager = IndexedDBManager.getInstance();
