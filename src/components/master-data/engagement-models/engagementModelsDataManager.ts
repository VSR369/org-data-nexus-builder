
import { LegacyDataManager } from '@/utils/core/DataManager';
import { EngagementModel } from './types';

const defaultEngagementModels: EngagementModel[] = [
  {
    id: 'marketplace',
    name: 'Market Place',
    description: 'A platform where solution seekers and providers connect directly for marketplace transactions',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'aggregator',
    name: 'Aggregator',
    description: 'Aggregation services that collect and organize solutions from multiple sources',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const engagementModelsDataManager = new LegacyDataManager<EngagementModel[]>({
  key: 'master_data_engagement_models',
  defaultData: defaultEngagementModels,
  version: 2 // Increment version to force refresh
});

// Helper function to get clean engagement models without duplicates
export const getCleanEngagementModels = (): EngagementModel[] => {
  try {
    console.log('🔄 Loading engagement models from data manager...');
    const rawData = engagementModelsDataManager.loadData();
    console.log('📊 Raw data from manager:', rawData);
    
    // Type check: Ensure we have an array
    if (!Array.isArray(rawData)) {
      console.warn('⚠️ Data manager returned non-array data:', typeof rawData, rawData);
      console.log('🔄 Initializing with default engagement models');
      engagementModelsDataManager.saveData(defaultEngagementModels);
      return defaultEngagementModels;
    }
    
    // Validate array contents
    const validModels = rawData.filter(model => 
      model && 
      typeof model === 'object' && 
      typeof model.id === 'string' && 
      typeof model.name === 'string'
    );
    
    if (validModels.length === 0) {
      console.warn('⚠️ No valid engagement models found in data');
      console.log('🔄 Resetting to default engagement models');
      engagementModelsDataManager.saveData(defaultEngagementModels);
      return defaultEngagementModels;
    }
    
    // Remove duplicates based on name and ensure we have exactly 4 models
    const uniqueModels = validModels.filter((model, index, self) => 
      index === self.findIndex(m => m.name.toLowerCase() === model.name.toLowerCase())
    );
    
    console.log('✅ Found', uniqueModels.length, 'unique engagement models');
    
    // If we don't have exactly 2 models or have duplicates, reset to default
    if (uniqueModels.length !== 2) {
      console.log('🔄 Detected missing or duplicate engagement models, resetting to default 2 models');
      engagementModelsDataManager.saveData(defaultEngagementModels);
      return defaultEngagementModels;
    }
    
    return uniqueModels;
    
  } catch (error) {
    console.error('❌ Error loading engagement models:', error);
    console.log('🔄 Falling back to default engagement models');
    engagementModelsDataManager.saveData(defaultEngagementModels);
    return defaultEngagementModels;
  }
};
