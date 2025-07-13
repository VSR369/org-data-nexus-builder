/**
 * Utility to clear all browser storage related to pricing configurations
 * This ensures no cached/stored pricing data interferes with Supabase as single source of truth
 */

export class BrowserStorageCleaner {
  /**
   * Clear all pricing-related data from browser storage
   */
  static clearAllPricingData(): void {
    try {
      console.log('🧹 Clearing all browser storage for pricing data...');
      
      // Clear localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('pricing') ||
          key.includes('config') ||
          key.includes('Pricing') ||
          key.includes('Config') ||
          key.includes('PRICING') ||
          key.includes('CONFIG')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed localStorage key: ${key}`);
      });
      
      // Clear sessionStorage
      const sessionKeysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (
          key.includes('pricing') ||
          key.includes('config') ||
          key.includes('Pricing') ||
          key.includes('Config') ||
          key.includes('PRICING') ||
          key.includes('CONFIG')
        )) {
          sessionKeysToRemove.push(key);
        }
      }
      
      sessionKeysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Removed sessionStorage key: ${key}`);
      });
      
      console.log('✅ Browser storage cleared successfully');
      
    } catch (error) {
      console.error('❌ Error clearing browser storage:', error);
    }
  }
  
  /**
   * Clear all browser storage (nuclear option)
   */
  static clearAllStorage(): void {
    try {
      console.log('🧹 Nuclear option: Clearing ALL browser storage...');
      localStorage.clear();
      sessionStorage.clear();
      console.log('✅ All browser storage cleared');
    } catch (error) {
      console.error('❌ Error clearing all browser storage:', error);
    }
  }
}