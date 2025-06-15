
import { DataManager } from '@/utils/core/DataManager';
import { EngagementModel } from './types';

// Define the default models here only, not exported to avoid duplication
const DEFAULT_ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    id: '1',
    name: 'Market Place',
    description: 'Standard marketplace engagement model',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Aggregator',
    description: 'Aggregator engagement model',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Market Place Plus Aggregator',
    description: 'Combined marketplace and aggregator model',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export interface EngagementModelsData {
  engagementModels: EngagementModel[];
}

class EngagementModelsDataManager extends DataManager<EngagementModelsData> {
  constructor() {
    super({
      key: 'master_data_engagement_models',
      defaultData: {
        engagementModels: DEFAULT_ENGAGEMENT_MODELS
      },
      version: 1
    });
  }

  protected validateDataStructure(data: any): boolean {
    return data && 
           typeof data === 'object' && 
           Array.isArray(data.engagementModels) &&
           data.engagementModels.every((model: any) => 
             model && 
             typeof model.id === 'string' && 
             typeof model.name === 'string' && 
             typeof model.description === 'string' &&
             typeof model.isActive === 'boolean'
           );
  }

  getEngagementModels(): EngagementModel[] {
    const data = this.loadData();
    
    // Get active models first
    const activeModels = data.engagementModels.filter(model => model.isActive);
    
    // Advanced deduplication: remove duplicates based on normalized name
    const uniqueModels = activeModels.reduce((acc: EngagementModel[], current) => {
      const normalizedName = current.name.toLowerCase().trim();
      const exists = acc.find(model => 
        model.name.toLowerCase().trim() === normalizedName
      );
      
      if (!exists) {
        acc.push(current);
      } else {
        console.log('🔄 DataManager: Duplicate engagement model filtered out:', current.name);
      }
      return acc;
    }, []);
    
    console.log('🔄 DataManager: Loaded unique engagement models:', uniqueModels.length);
    return uniqueModels;
  }

  addEngagementModel(model: Omit<EngagementModel, 'id' | 'createdAt' | 'updatedAt'>): EngagementModel {
    const data = this.loadData();
    
    // Check for duplicate names before adding
    const normalizedName = model.name.toLowerCase().trim();
    const existingModel = data.engagementModels.find(existing => 
      existing.name.toLowerCase().trim() === normalizedName
    );
    
    if (existingModel) {
      throw new Error(`Engagement model with name '${model.name}' already exists`);
    }
    
    const newModel: EngagementModel = {
      ...model,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.engagementModels.push(newModel);
    this.saveData(data);
    return newModel;
  }

  updateEngagementModel(id: string, updates: Partial<Omit<EngagementModel, 'id' | 'createdAt'>>): EngagementModel | null {
    const data = this.loadData();
    const index = data.engagementModels.findIndex(model => model.id === id);
    
    if (index === -1) return null;
    
    data.engagementModels[index] = {
      ...data.engagementModels[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveData(data);
    return data.engagementModels[index];
  }

  deleteEngagementModel(id: string): boolean {
    const data = this.loadData();
    const index = data.engagementModels.findIndex(model => model.id === id);
    
    if (index === -1) return false;
    
    data.engagementModels.splice(index, 1);
    this.saveData(data);
    return true;
  }
}

export const engagementModelsDataManager = new EngagementModelsDataManager();
