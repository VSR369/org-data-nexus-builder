
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
    id: 'marketplace-aggregator',
    name: 'Market Place & Aggregator',
    description: 'Combined marketplace and aggregation services for comprehensive solution management',
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
  },
  {
    id: 'platform-service',
    name: 'Platform as a Service',
    description: 'Complete platform infrastructure and services for solution development and deployment',
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
  const models = engagementModelsDataManager.loadData();
  
  // Remove duplicates based on name and ensure we have exactly 4 models
  const uniqueModels = models.filter((model, index, self) => 
    index === self.findIndex(m => m.name.toLowerCase() === model.name.toLowerCase())
  );
  
  // If we don't have exactly 4 models or have duplicates, reset to default
  if (uniqueModels.length !== 4) {
    console.log('🔄 Detected duplicate or missing engagement models, resetting to default 4 models');
    engagementModelsDataManager.saveData(defaultEngagementModels);
    return defaultEngagementModels;
  }
  
  return uniqueModels;
};
