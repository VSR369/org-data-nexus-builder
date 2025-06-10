
import { DataManager } from '@/utils/dataManager';
import { IndustrySegmentData } from '@/types/industrySegments';

const defaultIndustrySegmentData: IndustrySegmentData = {
  industrySegments: []
};

class IndustrySegmentDataManager extends DataManager<IndustrySegmentData> {
  loadData(): IndustrySegmentData {
    const rawData = super.loadData();
    
    // Handle legacy data migration - if we get an array of strings, convert it
    if (Array.isArray(rawData)) {
      console.log('🔄 Migrating legacy industry segments data');
      const migratedData: IndustrySegmentData = {
        industrySegments: rawData.map((segmentName: string, index: number) => ({
          id: (Date.now() + index).toString(),
          industrySegment: segmentName,
          description: ''
        }))
      };
      
      // Save the migrated data
      this.saveData(migratedData);
      return migratedData;
    }
    
    // If data is already in the correct format, return it
    return rawData;
  }
}

export const industrySegmentDataManager = new IndustrySegmentDataManager({
  key: 'master_data_industry_segments',
  defaultData: defaultIndustrySegmentData,
  version: 1
});
