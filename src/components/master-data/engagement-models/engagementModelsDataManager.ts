
import { DataManager } from '@/utils/core/DataManager';
import { EngagementModel, DEFAULT_ENGAGEMENT_MODELS } from './types';

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
    return data.engagementModels || [];
  }

  addEngagementModel(model: Omit<EngagementModel, 'id' | 'createdAt' | 'updatedAt'>): EngagementModel {
    const data = this.loadData();
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
