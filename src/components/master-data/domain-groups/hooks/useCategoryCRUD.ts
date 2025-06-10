
import { Category, SubCategory } from '../types';

interface UseCategoryCRUDProps {
  categories: Category[];
  subCategories: SubCategory[];
  saveCategories: (cats: Category[]) => void;
  saveSubCategories: (subCats: SubCategory[]) => void;
}

export const useCategoryCRUD = ({
  categories,
  subCategories,
  saveCategories,
  saveSubCategories
}: UseCategoryCRUDProps) => {
  const addCategory = (category: Omit<Category, 'id' | 'createdAt' | 'subCategories'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      subCategories: []
    };
    const updatedCategories = [...categories, newCategory];
    saveCategories(updatedCategories);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updatedCategories = categories.map(category =>
      category.id === id ? { ...category, ...updates } : category
    );
    saveCategories(updatedCategories);
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    saveCategories(updatedCategories);
    
    // Also remove related subcategories
    const updatedSubCategories = subCategories.filter(subCat => subCat.categoryId !== id);
    saveSubCategories(updatedSubCategories);
  };

  return {
    addCategory,
    updateCategory,
    deleteCategory
  };
};
