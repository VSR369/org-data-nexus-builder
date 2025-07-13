
export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  version?: number;
  is_user_created?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  domain_group_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  version?: number;
  is_user_created?: boolean;
  subCategories?: SubCategory[];
}

export interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industry_segment_id: string;
  industrySegmentName?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  version?: number;
  is_user_created?: boolean;
  categories?: Category[];
}

export interface DomainGroupsData {
  domainGroups: DomainGroup[];
  categories: Category[];
  subCategories: SubCategory[];
}
