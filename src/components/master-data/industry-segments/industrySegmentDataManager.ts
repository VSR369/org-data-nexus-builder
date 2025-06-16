
import { LegacyDataManager } from '@/utils/core/DataManager';
import { IndustrySegmentData } from '@/types/industrySegments';

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
}

export const industrySegmentDataManager = new IndustrySegmentDataManager({
  key: 'master_data_industry_segments',
  defaultData: defaultIndustrySegmentData,
  version: 3
});
