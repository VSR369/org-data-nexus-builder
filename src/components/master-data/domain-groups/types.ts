
export interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industrySegmentId: string;
  isActive: boolean;
  createdAt: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  domainGroupId: string;
  isActive: boolean;
  createdAt: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
}
