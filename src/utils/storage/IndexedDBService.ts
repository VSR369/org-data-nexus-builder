
import { indexedDBManager } from './IndexedDBManager';

export interface IndexedDBOptions {
  storeName: string;
  timeout?: number;
}

export class IndexedDBService<T> {
  private options: IndexedDBOptions;

  constructor(options: IndexedDBOptions) {
    this.options = {
      timeout: 5000,
      ...options
    };
  }

  private async getObjectStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = indexedDBManager.getDatabase();
    const transaction = db.transaction([this.options.storeName], mode);
    return transaction.objectStore(this.options.storeName);
  }

  private async executeWithTimeout<R>(operation: Promise<R>): Promise<R> {
    return Promise.race([
      operation,
      new Promise<R>((_, reject) => 
        setTimeout(() => reject(new Error('IndexedDB operation timeout')), this.options.timeout)
      )
    ]);
  }

  async getAll(): Promise<T[]> {
    console.log(`📤 IndexedDB: Getting all from ${this.options.storeName}`);
    
    const operation = new Promise<T[]>((resolve, reject) => {
      this.getObjectStore('readonly').then(store => {
        const request = store.getAll();
        request.onsuccess = () => {
          console.log(`✅ IndexedDB: Retrieved ${request.result.length} items from ${this.options.storeName}`);
          resolve(request.result);
        };
        request.onerror = () => reject(request.error);
      }).catch(reject);
    });

    return this.executeWithTimeout(operation);
  }

  async getById(id: string | number): Promise<T | undefined> {
    console.log(`📤 IndexedDB: Getting item ${id} from ${this.options.storeName}`);
    
    const operation = new Promise<T | undefined>((resolve, reject) => {
      this.getObjectStore('readonly').then(store => {
        const request = store.get(id);
        request.onsuccess = () => {
          console.log(`✅ IndexedDB: Retrieved item ${id} from ${this.options.storeName}`);
          resolve(request.result);
        };
        request.onerror = () => reject(request.error);
      }).catch(reject);
    });

    return this.executeWithTimeout(operation);
  }

  async put(data: T): Promise<void> {
    console.log(`💾 IndexedDB: Saving to ${this.options.storeName}:`, data);
    
    const operation = new Promise<void>((resolve, reject) => {
      this.getObjectStore('readwrite').then(store => {
        const request = store.put(data);
        request.onsuccess = () => {
          console.log(`✅ IndexedDB: Saved to ${this.options.storeName}`);
          resolve();
        };
        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          if (error?.name === 'QuotaExceededError') {
            console.error('❌ Storage quota exceeded');
            reject(new Error('Storage quota exceeded. Please clear some data.'));
          } else {
            reject(error);
          }
        };
      }).catch(reject);
    });

    return this.executeWithTimeout(operation);
  }

  async delete(id: string | number): Promise<void> {
    console.log(`🗑️ IndexedDB: Deleting ${id} from ${this.options.storeName}`);
    
    const operation = new Promise<void>((resolve, reject) => {
      this.getObjectStore('readwrite').then(store => {
        const request = store.delete(id);
        request.onsuccess = () => {
          console.log(`✅ IndexedDB: Deleted ${id} from ${this.options.storeName}`);
          resolve();
        };
        request.onerror = () => reject(request.error);
      }).catch(reject);
    });

    return this.executeWithTimeout(operation);
  }

  async clear(): Promise<void> {
    console.log(`🗑️ IndexedDB: Clearing all data from ${this.options.storeName}`);
    
    const operation = new Promise<void>((resolve, reject) => {
      this.getObjectStore('readwrite').then(store => {
        const request = store.clear();
        request.onsuccess = () => {
          console.log(`✅ IndexedDB: Cleared all data from ${this.options.storeName}`);
          resolve();
        };
        request.onerror = () => reject(request.error);
      }).catch(reject);
    });

    return this.executeWithTimeout(operation);
  }

  async count(): Promise<number> {
    const operation = new Promise<number>((resolve, reject) => {
      this.getObjectStore('readonly').then(store => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }).catch(reject);
    });

    return this.executeWithTimeout(operation);
  }

  async getByIndex(indexName: string, value: any): Promise<T[]> {
    console.log(`🔍 IndexedDB: Querying ${this.options.storeName} by ${indexName}:`, value);
    
    const operation = new Promise<T[]>((resolve, reject) => {
      this.getObjectStore('readonly').then(store => {
        const index = store.index(indexName);
        const request = index.getAll(value);
        request.onsuccess = () => {
          console.log(`✅ IndexedDB: Found ${request.result.length} items in ${this.options.storeName}`);
          resolve(request.result);
        };
        request.onerror = () => reject(request.error);
      }).catch(reject);
    });

    return this.executeWithTimeout(operation);
  }
}
