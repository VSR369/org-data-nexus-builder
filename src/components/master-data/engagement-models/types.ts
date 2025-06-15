
export interface EngagementModel {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Remove the DEFAULT_ENGAGEMENT_MODELS export to avoid duplication
// The data manager will handle the initial seeding
