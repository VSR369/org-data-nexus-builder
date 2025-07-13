import { supabaseMasterDataService } from '@/services/SupabaseMasterDataService';

export class OrganizationTypeService {
  static async getOrganizationTypes(): Promise<string[]> {
    try {
      const organizationTypes = await supabaseMasterDataService.getOrganizationTypes();
      console.log('✅ OrganizationTypeService: Using Supabase organization types:', organizationTypes.map(o => o.name));
      return organizationTypes.map(o => o.name);
    } catch (error) {
      console.error('❌ OrganizationTypeService: Error fetching organization types from Supabase:', error);
      // Return fallback data instead of localStorage
      return [
        'Large Enterprise',
        'Start-up',
        'MSME',
        'Academic Institution',
        'Research Institution',
        'Non-Profit Organization / NGO',
        'Government Department / PSU',
        'Industry Association / Consortium',
        'Freelancer / Individual Consultant',
        'Think Tank / Policy Institute'
      ];
    }
  }

  static getOrganizationTypesSync(): string[] {
    console.log('⚠️ OrganizationTypeService.getOrganizationTypesSync is deprecated - use async getOrganizationTypes() instead');
    // Return fallback only - no localStorage access
    return [
      'Large Enterprise',
      'Start-up',
      'MSME',
      'Academic Institution',
      'Research Institution',
      'Non-Profit Organization / NGO',
      'Government Department / PSU',
      'Industry Association / Consortium',
      'Freelancer / Individual Consultant',
      'Think Tank / Policy Institute'
    ];
  }
  
  static async saveOrganizationTypes(types: string[]): Promise<boolean> {
    try {
      // Convert strings to MasterDataItem format
      const items = types.map(name => ({ name, is_user_created: true }));
      const success = await supabaseMasterDataService.saveOrganizationTypes(items);
      
      if (success) {
        // Also save to localStorage for backward compatibility
        console.log('💾 Saving organization types in raw format:', types.length);
        localStorage.setItem('master_data_organization_types', JSON.stringify(types));
      }
      
      return success;
    } catch (error) {
      console.error('❌ Error saving organization types:', error);
      return false;
    }
  }
}