export class OrganizationTypeService {
  static getOrganizationTypes(): string[] {
    console.log('🔍 Getting organization types...');
    
    // CHECK FOR CUSTOM-ONLY MODE FIRST
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    if (isCustomMode) {
      console.log('🎯 Custom-only mode detected, loading custom organization types...');
      const customData = localStorage.getItem('custom_organizationTypes');
      if (customData) {
        try {
          const parsed = JSON.parse(customData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('✅ Using custom organization types:', parsed.length);
            return parsed;
          }
        } catch (error) {
          console.error('❌ Failed to parse custom organization types data:', error);
        }
      }
    }
    
    // FALLBACK: Use raw localStorage storage
    const rawData = localStorage.getItem('master_data_organization_types');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        
        // Handle wrapped format (legacy from MasterDataPersistenceManager)
        if (parsed && typeof parsed === 'object' && parsed.data && Array.isArray(parsed.data)) {
          console.log('⚠️ Found wrapped organization types data, unwrapping...');
          const unwrapped = parsed.data;
          // Store in raw format for future use
          localStorage.setItem('master_data_organization_types', JSON.stringify(unwrapped));
          console.log('✅ Unwrapped and stored organization types in raw format');
          return unwrapped;
        }
        
        // Handle raw array format (preferred)
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('✅ Using raw organization types data:', parsed.length);
          return parsed;
        }
        
        console.log('⚠️ Invalid organization types data structure, using fallback');
      } catch (error) {
        console.error('❌ Failed to parse organization types data:', error);
      }
    }

    // Use emergency fallback and store it
    console.log('📦 No valid data found, using emergency fallback organization types');
    const fallbackData = [
      'Large Enterprise',
      'Start-up',
      'MSME',
      'Academic Institution',
      'Government Department / PSU'
    ];
    localStorage.setItem('master_data_organization_types', JSON.stringify(fallbackData));
    return fallbackData;
  }
  
  static saveOrganizationTypes(types: string[]): void {
    console.log('💾 Saving organization types in raw format:', types.length);
    localStorage.setItem('master_data_organization_types', JSON.stringify(types));
  }
}