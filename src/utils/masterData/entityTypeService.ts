
import { MasterDataPersistenceManager } from '../masterDataPersistenceManager';
import { entityTypeConfig } from './configs';
import { emergencyFallbackEntityTypes } from './fallbackData';

export class EntityTypeService {
  static getEntityTypes(): string[] {
    console.log('🔍 Getting entity types...');
    
    // Check if we have user data (stored as string array)
    const hasUserData = MasterDataPersistenceManager.hasUserData(entityTypeConfig);
    if (hasUserData) {
      const stored = localStorage.getItem('master_data_entity_types');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.data && Array.isArray(parsed.data)) {
            console.log('✅ Using user-created entity types:', parsed.data.length);
            return parsed.data;
          }
        } catch (error) {
          console.error('❌ Failed to parse entity types:', error);
        }
      }
    }

    // Check legacy format
    const legacyData = localStorage.getItem('master_data_entity_types');
    if (legacyData) {
      try {
        const parsed = JSON.parse(legacyData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('⚠️ Found legacy entity types, treating as user data');
          return parsed;
        }
      } catch (error) {
        console.error('❌ Failed to parse legacy entity types:', error);
      }
    }

    console.log('📦 No user data found, using emergency fallback entity types');
    return emergencyFallbackEntityTypes;
  }
}
