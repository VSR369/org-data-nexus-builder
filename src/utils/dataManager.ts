
// Legacy exports for backward compatibility
export { DataManager } from './core/DataManager';
export { GlobalCacheManager } from './core/GlobalCacheManager';
export { UniversalDataManager } from './core/UniversalDataManager';
export { seedingService } from './core/UniversalSeedingService';
export type { DataManagerConfig } from './core/DataManager';
export type { UniversalDataConfig } from './core/UniversalDataManager';

// New async exports
export { AsyncDataManager } from './core/AsyncDataManager';
export type { AsyncDataManagerConfig } from './core/AsyncDataManager';
export { IndexedDBService } from './storage/IndexedDBService';
export { indexedDBManager } from './storage/IndexedDBManager';

// Initialize the universal persistence system
console.log('🚀 Universal Data Persistence System Initialized (with IndexedDB support)');
