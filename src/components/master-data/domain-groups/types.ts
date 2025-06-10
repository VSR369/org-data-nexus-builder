
export interface IndustrySegment {
  id: string;
  name: string;
  code: string;
}

export interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industrySegmentId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  domainGroupId: string;
  isActive: boolean;
  createdAt: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
}
