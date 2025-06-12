
// Re-export everything from the core modules
export { DataManager } from './core/DataManager';
export { GlobalCacheManager } from './core/GlobalCacheManager';
export { UniversalDataManager } from './core/UniversalDataManager';
export { seedingService } from './core/UniversalSeedingService';
export type { DataManagerConfig } from './core/DataManager';
export type { UniversalDataConfig } from './core/UniversalDataManager';

// Initialize the universal persistence system
console.log('🚀 Universal Data Persistence System Initialized');
