import { IndustrySegmentData } from '@/types/industrySegments';

export class IndustrySegmentService {
  static getIndustrySegments(): IndustrySegmentData {
    console.log('🔍 Getting industry segments...');
    
    // CHECK FOR CUSTOM-ONLY MODE FIRST
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    if (isCustomMode) {
      console.log('🎯 Custom-only mode detected, loading custom industry segments...');
      const customData = localStorage.getItem('custom_industrySegments');
      if (customData) {
        try {
          const parsed = JSON.parse(customData);
          if (parsed && parsed.industrySegments && Array.isArray(parsed.industrySegments) && parsed.industrySegments.length > 0) {
            console.log('✅ Using custom industry segments:', parsed.industrySegments.length);
            return parsed;
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
    console.log('💾 Saving industry segments in raw format:', data.industrySegments.length);
    localStorage.setItem('master_data_industry_segments', JSON.stringify(data));
  }
}