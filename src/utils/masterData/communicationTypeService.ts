export interface CommunicationChannel {
  id: string;
  name: string;
  link: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const emergencyFallbackCommunicationChannels: CommunicationChannel[] = [];

export class CommunicationTypeService {
  static getCommunicationChannels(): CommunicationChannel[] {
    console.log('🔍 Getting communication channels...');
    
    // CHECK FOR CUSTOM-ONLY MODE FIRST
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    if (isCustomMode) {
      console.log('🎯 Custom-only mode detected, loading custom communication channels...');
      const customData = localStorage.getItem('custom_communicationTypes');
      if (customData !== null) {
        try {
          const parsed = JSON.parse(customData);
          if (Array.isArray(parsed)) {
            console.log('✅ Using custom communication channels (including empty array):', parsed.length);
            return parsed; // Return even if empty array - this preserves deletions
          }
        } catch (error) {
          console.error('❌ Failed to parse custom communication channels data:', error);
        }
      }
      
      // In custom-only mode, don't fall back to defaults if no custom data
      console.log('🚫 Custom-only mode: No custom communication channels found, returning empty array');
      return [];
    }
    
    // FALLBACK: Use raw localStorage storage
    const rawData = localStorage.getItem('master_data_communication_channels');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        
        // Handle wrapped format (legacy from MasterDataPersistenceManager)
        if (parsed && typeof parsed === 'object' && parsed.data && Array.isArray(parsed.data)) {
          console.log('⚠️ Found wrapped communication channels data, unwrapping...');
          const unwrapped = parsed.data;
          // Store in raw format for future use
          localStorage.setItem('master_data_communication_channels', JSON.stringify(unwrapped));
          console.log('✅ Unwrapped and stored communication channels in raw format');
          return unwrapped;
        }
        
        // Handle raw array format (preferred)
        if (Array.isArray(parsed)) {
          console.log('✅ Using raw communication channels data:', parsed.length);
          return parsed;
        }
        
        console.log('⚠️ Invalid communication channels data structure, using fallback');
      } catch (error) {
        console.error('❌ Failed to parse communication channels data:', error);
      }
    }

    // Use emergency fallback only in mixed mode
    console.log('📦 Mixed mode: No valid data found, using emergency fallback communication channels');
    localStorage.setItem('master_data_communication_channels', JSON.stringify(emergencyFallbackCommunicationChannels));
    return emergencyFallbackCommunicationChannels;
  }
  
  static saveCommunicationChannels(channels: CommunicationChannel[]): void {
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    
    if (isCustomMode) {
      console.log('💾 Custom-only mode: Saving communication channels to custom_communicationTypes:', channels.length);
      localStorage.setItem('custom_communicationTypes', JSON.stringify(channels));
      
      // Validation: Read back to ensure it was saved correctly
      const readBack = localStorage.getItem('custom_communicationTypes');
      if (readBack !== null) {
        try {
          const parsed = JSON.parse(readBack);
          if (Array.isArray(parsed) && parsed.length === channels.length) {
            console.log('✅ Custom communication channels save validated successfully');
          } else {
            console.error('❌ Custom communication channels save validation failed - length mismatch');
          }
        } catch (error) {
          console.error('❌ Custom communication channels save validation failed - parse error:', error);
        }
      } else {
        console.error('❌ Custom communication channels save validation failed - null readback');
      }
    } else {
      console.log('💾 Mixed mode: Saving communication channels to master_data_communication_channels:', channels.length);
      localStorage.setItem('master_data_communication_channels', JSON.stringify(channels));
    }
  }
}