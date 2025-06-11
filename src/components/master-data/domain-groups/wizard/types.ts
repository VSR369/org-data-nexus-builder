
export interface Category {
  id: string;
  name: string;
  description: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
}
