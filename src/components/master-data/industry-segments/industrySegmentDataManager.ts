
import { LegacyDataManager } from '@/utils/core/DataManager';
import { IndustrySegmentData } from '@/types/industrySegments';
// Industry segment service removed - use Supabase hooks instead

const defaultIndustrySegmentData: IndustrySegmentData = {
  industrySegments: [
    {
      id: '1',
      industrySegment: 'Life Sciences',
      description: ''
    },
    {
      id: '2', 
      industrySegment: 'Logistics & Supply Chain',
      description: ''
    },
    {
      id: '3',
      industrySegment: 'Manufacturing (Smart, Process, Discrete)',
      description: ''
    }
  ]
};

class IndustrySegmentDataManager extends LegacyDataManager<IndustrySegmentData> {
  loadData(): IndustrySegmentData {
    // CHECK FOR CUSTOM-ONLY MODE FIRST
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    if (isCustomMode) {
      console.log('⚠️ Custom mode deprecated - use Supabase hooks instead');
      return defaultIndustrySegmentData;
    }
    
    const rawData = super.loadData();
    
    // If we get an array (legacy data), convert to new format
    if (Array.isArray(rawData)) {
      console.log('🗑️ Converting legacy industry segments array data');
      const convertedData = { industrySegments: rawData };
      this.saveData(convertedData);
      return convertedData;
    }
    
    // Ensure we have the correct structure
    if (!rawData || !rawData.industrySegments || !Array.isArray(rawData.industrySegments)) {
      console.log('🔧 Invalid data structure, resetting to default');
      this.saveData(defaultIndustrySegmentData);
      return defaultIndustrySegmentData;
    }
    
    return rawData;
  }

  saveData(data: IndustrySegmentData): void {
    // CHECK FOR CUSTOM-ONLY MODE FIRST
    const isCustomMode = localStorage.getItem('master_data_mode') === 'custom_only';
    if (isCustomMode) {
      console.log('⚠️ Custom mode deprecated - use Supabase hooks instead');
      return;
    }
    
    // Use parent class method for mixed mode
    super.saveData(data);
  }
}

export const industrySegmentDataManager = new IndustrySegmentDataManager({
  key: 'master_data_industry_segments',
  defaultData: defaultIndustrySegmentData,
  version: 3
});
