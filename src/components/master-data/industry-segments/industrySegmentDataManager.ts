
import { DataManager } from '@/utils/dataManager';
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

class IndustrySegmentDataManager extends DataManager<IndustrySegmentData> {
  async loadData(): Promise<IndustrySegmentData> {
    const rawData = await super.loadData();
    
    // If we get an array (legacy data), clear it and start fresh
    if (Array.isArray(rawData)) {
      console.log('🗑️ Removing legacy industry segments array data');
      await this.clearData();
      await this.saveData(defaultIndustrySegmentData);
      return defaultIndustrySegmentData;
    }
    
    // Ensure we have the correct structure
    if (!rawData || !rawData.industrySegments || !Array.isArray(rawData.industrySegments)) {
      console.log('🔧 Invalid data structure, resetting to default');
      await this.saveData(defaultIndustrySegmentData);
      return defaultIndustrySegmentData;
    }
    
    return rawData;
  }
}

export const industrySegmentDataManager = new IndustrySegmentDataManager({
  key: 'master_data_industry_segments',
  defaultData: defaultIndustrySegmentData,
  version: 3 // Increment version to force data reset with new segments
});
