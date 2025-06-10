
export interface CompetencyCapability {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'business' | 'behavioral';
  ratingRange: string;
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
