
export interface CompetencyCapability {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'business' | 'behavioral';
  ratingRange: string;
  isActive: boolean;
  color?: string;
}

export interface CapabilityLevel {
  id: string;
  label: string;
  minScore: number;
  maxScore: number;
  color: string;
  order: number;
  isActive: boolean;
}

export interface RatingScale {
  id: string;
  name: string;
  description: string;
  levels: RatingLevel[];
}

export interface RatingLevel {
  value: number;
  label: string;
  description: string;
}

export interface FormData {
  name: string;
  description: string;
  ratingRange: string;
  color: string;
}

export interface CapabilityLevelFormData {
  label: string;
  minScore: number;
  maxScore: number;
  color: string;
}

export interface ColorOption {
  value: string;
  label: string;
}
