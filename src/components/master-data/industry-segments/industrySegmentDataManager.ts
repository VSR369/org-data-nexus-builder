
import { DataManager } from '@/utils/dataManager';
import { IndustrySegmentData } from '@/types/industrySegments';

const defaultIndustrySegmentData: IndustrySegmentData = {
  industrySegments: []
};

export const industrySegmentDataManager = new DataManager({
  key: 'master_data_industry_segments',
  defaultData: defaultIndustrySegmentData,
  version: 1
});
