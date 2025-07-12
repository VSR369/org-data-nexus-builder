// Entity Types Restoration Utility
import { LegacyDataManager } from '@/utils/core/DataManager';

const entityTypesDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: ['Commercial', 'Non-Profit Organization', 'Society', 'Trust'],
  version: 1
});

export class EntityTypesRestorer {
  
  static restoreEntityTypes() {
    console.log('🔄 Starting Entity Types restoration...');
    
    // Check for existing data in various possible keys
    const possibleKeys = [
      'master_data_entity_types',
      'entityTypes',
      'entity_types',
      'custom_entityTypes'
    ];
    
    let foundData: string[] | null = null;
    let sourceKey = '';
    
    // Try to find existing entity types data
    for (const key of possibleKeys) {
      const stored = localStorage.getItem(key);
      if (stored && stored !== 'null' && stored !== '[]' && stored !== 'undefined') {
        try {
          const parsed = JSON.parse(stored);
          
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Handle both string[] and object[] formats
            if (typeof parsed[0] === 'string') {
              foundData = parsed;
              sourceKey = key;
              break;
            } else if (typeof parsed[0] === 'object' && parsed[0].name) {
              // Convert object format to string array
              foundData = parsed.map((item: any) => item.name || item.entityType || item.type);
              sourceKey = key;
              break;
            }
          }
        } catch (error) {
          console.warn(`Failed to parse data from ${key}:`, error);
        }
      }
    }
    
    // Restore the data
    if (foundData && foundData.length > 0) {
      console.log(`✅ Found Entity Types data in ${sourceKey}:`, foundData);
      entityTypesDataManager.saveData(foundData);
      
      // Also ensure it's saved in the standard key
      localStorage.setItem('master_data_entity_types', JSON.stringify(foundData));
      
      return {
        success: true,
        restored: foundData,
        count: foundData.length,
        source: sourceKey
      };
    } else {
      // Use default data
      const defaultData = ['Commercial', 'Non-Profit Organization', 'Society', 'Trust'];
      console.log('⚠️ No custom Entity Types found, using defaults:', defaultData);
      entityTypesDataManager.saveData(defaultData);
      
      return {
        success: true,
        restored: defaultData,
        count: defaultData.length,
        source: 'defaults'
      };
    }
  }
  
  static getEntityTypes(): string[] {
    return entityTypesDataManager.loadData() || ['Commercial', 'Non-Profit Organization', 'Society', 'Trust'];
  }
  
  static addEntityType(entityType: string): boolean {
    try {
      const current = this.getEntityTypes();
      if (!current.includes(entityType.trim())) {
        const updated = [...current, entityType.trim()];
        entityTypesDataManager.saveData(updated);
        console.log(`✅ Added entity type: ${entityType}`);
        return true;
      } else {
        console.log(`⚠️ Entity type already exists: ${entityType}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error adding entity type:', error);
      return false;
    }
  }
  
  static removeEntityType(entityType: string): boolean {
    try {
      const current = this.getEntityTypes();
      const updated = current.filter(et => et !== entityType);
      entityTypesDataManager.saveData(updated);
      console.log(`🗑️ Removed entity type: ${entityType}`);
      return true;
    } catch (error) {
      console.error('❌ Error removing entity type:', error);
      return false;
    }
  }
  
  static diagnoseEntityTypesData() {
    console.log('🔍 Diagnosing Entity Types data...');
    
    const possibleKeys = [
      'master_data_entity_types',
      'entityTypes', 
      'entity_types',
      'custom_entityTypes'
    ];
    
    const diagnosis = {
      keys: [] as any[],
      recommendations: [] as string[]
    };
    
    for (const key of possibleKeys) {
      const stored = localStorage.getItem(key);
      const info = {
        key,
        exists: !!stored,
        value: stored,
        parsed: null as any,
        valid: false,
        count: 0
      };
      
      if (stored && stored !== 'null' && stored !== '[]') {
        try {
          info.parsed = JSON.parse(stored);
          if (Array.isArray(info.parsed)) {
            info.valid = true;
            info.count = info.parsed.length;
          }
        } catch (error) {
          // Invalid JSON
        }
      }
      
      diagnosis.keys.push(info);
    }
    
    console.table(diagnosis.keys);
    return diagnosis;
  }
}

// Auto-run restoration on import
if (typeof window !== 'undefined') {
  console.log('🔄 Entity Types Restorer loaded, checking for restoration needs...');
  setTimeout(() => {
    const result = EntityTypesRestorer.restoreEntityTypes();
    console.log('📊 Entity Types restoration result:', result);
  }, 500);
}