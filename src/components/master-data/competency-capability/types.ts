
export interface CompetencyCapability {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  isActive: boolean;
  ratingRange: string;
}

export interface ColorOption {
  value: string;
  label: string;
}

export interface FormData {
  name: string;
  description: string;
  color: string;
  ratingRange: string;
}
