
// Re-export everything from the core modules
export { DataManager } from './core/DataManager';
export { GlobalCacheManager } from './core/GlobalCacheManager';
export type { DataManagerConfig } from './core/DataManager';

// Removed the automatic clearing that was causing data loss
// GlobalCacheManager.clearDomainGroupsData(); // This was the culprit!
