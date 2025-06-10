
export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
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
  subCategories?: SubCategory[];
}

export interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industrySegmentId: string;
  industrySegmentName?: string;
  isActive: boolean;
  createdAt: string;
  categories?: Category[];
}

export interface DomainGroupsData {
  domainGroups: DomainGroup[];
  categories: Category[];
  subCategories: SubCategory[];
}
