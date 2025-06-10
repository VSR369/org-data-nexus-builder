
import { SubCategory } from '../types';

interface UseSubCategoryCRUDProps {
  subCategories: SubCategory[];
  saveSubCategories: (subCats: SubCategory[]) => void;
}

export const useSubCategoryCRUD = ({
  subCategories,
  saveSubCategories
}: UseSubCategoryCRUDProps) => {
  const addSubCategory = (subCategory: Omit<SubCategory, 'id' | 'createdAt'>) => {
    const newSubCategory: SubCategory = {
      ...subCategory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedSubCategories = [...subCategories, newSubCategory];
    saveSubCategories(updatedSubCategories);
  };

  const updateSubCategory = (id: string, updates: Partial<SubCategory>) => {
    const updatedSubCategories = subCategories.map(subCategory =>
      subCategory.id === id ? { ...subCategory, ...updates } : subCategory
    );
    saveSubCategories(updatedSubCategories);
  };

  const deleteSubCategory = (id: string) => {
    const updatedSubCategories = subCategories.filter(subCategory => subCategory.id !== id);
    saveSubCategories(updatedSubCategories);
  };

  return {
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  };
};
