
import { DataManager } from '@/utils/dataManager';
import { IndustrySegmentData } from '@/types/industrySegments';

const defaultIndustrySegmentData: IndustrySegmentData = {
  industrySegments: []
};

class IndustrySegmentDataManager extends DataManager<IndustrySegmentData> {
  loadData(): IndustrySegmentData {
    const rawData = super.loadData();
    
    // If we get an array (legacy data), clear it and start fresh
    if (Array.isArray(rawData)) {
      console.log('🗑️ Removing legacy industry segments array data');
      this.clearData();
      this.saveData(defaultIndustrySegmentData);
      return defaultIndustrySegmentData;
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
  version: 2 // Increment version to force data reset
});
