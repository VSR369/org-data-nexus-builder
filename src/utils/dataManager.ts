
// Re-export everything from the core modules
export { DataManager } from './core/DataManager';
export { GlobalCacheManager } from './core/GlobalCacheManager';
export type { DataManagerConfig } from './core/DataManager';

// Clear domain groups data immediately when this module loads
import { GlobalCacheManager } from './core/GlobalCacheManager';
GlobalCacheManager.clearDomainGroupsData();
