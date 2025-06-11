
import { DataManager } from '@/utils/dataManager';

// Base enhanced data manager with persistence improvements
export class EnhancedDataManager<T> extends DataManager<T> {
  // Override loadData to be more persistent and less destructive
  loadData(): T {
    console.log(`=== Enhanced DataManager.loadData() START for key: ${this.config.key} ===`);
    
    try {
      // First try to load from the main key
      const stored = localStorage.getItem(this.config.key);
      console.log('📦 Raw stored data:', stored);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('✅ Successfully loaded data:', parsed);
        
        // Validate the structure for the specific data type
        if (this.validateDataStructure(parsed)) {
          // Mark as initialized to prevent any clearing
          this.markAsInitialized();
          this.updateVersion();
          
          console.log(`=== Enhanced DataManager.loadData() END - Success for ${this.config.key} ===`);
          return parsed;
        }
      }

      // If no valid data, try to migrate from old keys
      const migrated = this.migrateFromOldKeys();
      if (migrated) {
        console.log('✅ Migrated data from old keys:', migrated);
        this.saveData(migrated);
        return migrated;
      }

      // Only use defaults if absolutely no data exists
      console.log('⚠️ No data found, using defaults');
      this.markAsInitialized();
      this.updateVersion();
      console.log(`=== Enhanced DataManager.loadData() END - Defaults for ${this.config.key} ===`);
      return this.config.defaultData;
      
    } catch (error) {
      console.error(`❌ Error loading data for ${this.config.key}:`, error);
      // Don't clear on error, try to recover
      const recovered = this.tryRecovery();
      return recovered || this.config.defaultData;
    }
  }

  // Method to be overridden by specific implementations for data validation
  protected validateDataStructure(data: any): boolean {
    return data && typeof data === 'object';
  }

  // Method to be overridden by specific implementations for migration
  protected migrateFromOldKeys(): T | null {
    return null;
  }

  // Method to be overridden by specific implementations for recovery
  protected tryRecovery(): T | null {
    return null;
  }

  // Enhanced save that preserves data integrity
  saveData(data: T): void {
    try {
      console.log(`=== Enhanced DataManager.saveData() START for ${this.config.key} ===`);
      console.log('💾 Saving data:', data);
      
      const jsonString = JSON.stringify(data);
      localStorage.setItem(this.config.key, jsonString);
      this.markAsInitialized();
      this.updateVersion();
      
      // Clean up old keys to prevent confusion
      this.cleanupOldKeys();
      
      console.log('✅ Enhanced save completed successfully');
      console.log(`=== Enhanced DataManager.saveData() END for ${this.config.key} ===`);
    } catch (error) {
      console.error(`❌ Error saving data for ${this.config.key}:`, error);
    }
  }

  // Method to be overridden by specific implementations for cleanup
  protected cleanupOldKeys(): void {
    // Default implementation - no cleanup
  }

  // Method to check if data exists without clearing it
  hasData(): boolean {
    try {
      const stored = localStorage.getItem(this.config.key);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validateDataStructure(parsed) && this.hasValidContent(parsed);
      }
      
      // Check old keys too
      const migrated = this.migrateFromOldKeys();
      return migrated && this.hasValidContent(migrated);
    } catch (error) {
      return false;
    }
  }

  // Method to be overridden by specific implementations to check for valid content
  protected hasValidContent(data: T): boolean {
    return !!data;
  }
}
