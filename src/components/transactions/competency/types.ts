
export interface SubCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

export interface DomainGroup {
  id: string;
  name: string;
  industrySegment: string;
  categories: Category[];
}

export interface CompetencyCapability {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  isActive: boolean;
}

export interface CapabilityLevel {
  id: string;
  name: string;
  description: string;
  minScore: number;
  maxScore: number;
  color: string;
  order: number;
  isActive: boolean;
}

export interface CompetencyAssessment {
  groupId: string;
  categoryId: string;
  subCategoryId: string;
  capability: string;
}
