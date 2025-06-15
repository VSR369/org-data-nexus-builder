
export interface EngagementModel {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_ENGAGEMENT_MODELS: EngagementModel[] = [
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
