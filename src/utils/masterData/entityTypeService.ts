
import { supabaseMasterDataService } from '@/services/SupabaseMasterDataService';

export class EntityTypeService {
  static async getEntityTypes(): Promise<string[]> {
    try {
      const entityTypes = await supabaseMasterDataService.getEntityTypes();
      console.log('✅ EntityTypeService: Using Supabase entity types:', entityTypes.map(e => e.name));
      return entityTypes.map(e => e.name);
    } catch (error) {
      console.error('❌ EntityTypeService: Error fetching entity types from Supabase:', error);
      // Return fallback data instead of localStorage
      return [
        'Commercial',
        'Non-Profit Organization',
        'Society',
        'Trust',
        'Private Limited Company',
        'Public Limited Company',
        'Partnership Firm',
        'Limited Liability Partnership (LLP)',
        'Sole Proprietorship'
      ];
    }
  }

  static getEntityTypesSync(): string[] {
    console.log('⚠️ EntityTypeService.getEntityTypesSync is deprecated - use async getEntityTypes() instead');
    // Return fallback only - no localStorage access
    return [
      'Commercial',
      'Non-Profit Organization',
      'Society',
      'Trust',
      'Private Limited Company',
      'Public Limited Company',
      'Partnership Firm',
      'Limited Liability Partnership (LLP)',
      'Sole Proprietorship'
    ];
  }

  static async saveEntityTypes(types: string[]): Promise<boolean> {
    try {
      const items = types.map(name => ({ name, is_user_created: true }));
      const success = await supabaseMasterDataService.saveEntityTypes(items);
      
      if (success) {
        console.log('✅ EntityTypeService: Saved entity types to Supabase:', types.length);
      }
      
      return success;
    } catch (error) {
      console.error('❌ EntityTypeService: Error saving entity types:', error);
      return false;
    }
  }
}
