import { IndustrySegmentData } from '@/types/industrySegments';

export class IndustrySegmentService {
  static getIndustrySegments(): IndustrySegmentData {
    console.log('🔍 Getting industry segments...');
    
    // CHECK FOR CUSTOM-ONLY MODE FIRST
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    if (isCustomMode) {
      console.log('🎯 Custom-only mode detected, loading custom industry segments...');
      const customData = localStorage.getItem('custom_industrySegments');
      if (customData !== null) {
        try {
          const parsed = JSON.parse(customData);
          if (parsed && parsed.industrySegments && Array.isArray(parsed.industrySegments)) {
            console.log('✅ Using custom industry segments (including empty array):', parsed.industrySegments.length);
            return parsed; // Return even if empty array - this preserves deletions
          }
        } catch (error) {
          console.error('❌ Failed to parse custom industry segments data:', error);
        }
      }
    }
    
    // FALLBACK: Use raw localStorage storage
    const rawData = localStorage.getItem('master_data_industry_segments');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        
        // Handle wrapped format (legacy from MasterDataPersistenceManager)
        if (parsed && typeof parsed === 'object' && parsed.data && parsed.data.industrySegments && Array.isArray(parsed.data.industrySegments)) {
          console.log('⚠️ Found wrapped industry segments data, unwrapping...');
          const unwrapped = parsed.data;
          // Store in raw format for future use
          localStorage.setItem('master_data_industry_segments', JSON.stringify(unwrapped));
          console.log('✅ Unwrapped and stored industry segments in raw format');
          return unwrapped;
        }
        
        // Handle raw object format (preferred)
        if (parsed && parsed.industrySegments && Array.isArray(parsed.industrySegments) && parsed.industrySegments.length > 0) {
          console.log('✅ Using raw industry segments data:', parsed.industrySegments.length);
          return parsed;
        }
        
        console.log('⚠️ Invalid industry segments data structure, using fallback');
      } catch (error) {
        console.error('❌ Failed to parse industry segments data:', error);
      }
    }

    // Use emergency fallback and store it
    console.log('📦 No valid data found, using emergency fallback industry segments');
    const fallbackData = { 
      industrySegments: [
        { id: '1', industrySegment: 'Life Sciences', description: '' },
        { id: '2', industrySegment: 'Logistics & Supply Chain', description: '' },
        { id: '3', industrySegment: 'Manufacturing (Smart, Process, Discrete)', description: '' }
      ]
    };
    localStorage.setItem('master_data_industry_segments', JSON.stringify(fallbackData));
    return fallbackData;
  }
  
  static saveIndustrySegments(data: IndustrySegmentData): void {
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    
    if (isCustomMode) {
      console.log('💾 Custom-only mode: Saving industry segments to custom_industrySegments:', data.industrySegments.length);
      localStorage.setItem('custom_industrySegments', JSON.stringify(data));
      
      // Validation: Read back to ensure it was saved correctly
      const readBack = localStorage.getItem('custom_industrySegments');
      if (readBack !== null) {
        try {
          const parsed = JSON.parse(readBack);
          if (parsed && parsed.industrySegments && Array.isArray(parsed.industrySegments) && parsed.industrySegments.length === data.industrySegments.length) {
            console.log('✅ Custom industry segments save validated successfully');
          } else {
            console.error('❌ Custom industry segments save validation failed - length mismatch');
          }
        } catch (error) {
          console.error('❌ Custom industry segments save validation failed - parse error:', error);
        }
      } else {
        console.error('❌ Custom industry segments save validation failed - null readback');
      }
    } else {
      console.log('💾 Mixed mode: Saving industry segments to master_data_industry_segments:', data.industrySegments.length);
      localStorage.setItem('master_data_industry_segments', JSON.stringify(data));
    }
  }
}