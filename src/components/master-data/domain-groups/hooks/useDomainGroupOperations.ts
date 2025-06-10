
import { DomainGroup, Category, SubCategory } from '../types';

export const useDomainGroupOperations = (
  domainGroups: DomainGroup[],
  setDomainGroups: React.Dispatch<React.SetStateAction<DomainGroup[]>>
) => {
  const addDomainGroup = (group: Omit<DomainGroup, 'id' | 'createdAt' | 'categories'>) => {
    const newId = `${group.industrySegmentId}-${Date.now()}`;
    const newGroup: DomainGroup = {
      ...group,
      id: newId,
      createdAt: new Date().toISOString(),
      categories: []
    };
    setDomainGroups(prev => [...prev, newGroup]);
  };

  const updateDomainGroup = (id: string, updates: Partial<DomainGroup>) => {
    setDomainGroups(prev => prev.map(group => 
      group.id === id ? { ...group, ...updates } : group
    ));
  };

  const deleteDomainGroup = (id: string) => {
    setDomainGroups(prev => prev.filter(group => group.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id' | 'createdAt' | 'subCategories'>) => {
    const newId = `${category.domainGroupId}-cat-${Date.now()}`;
    const newCategory: Category = {
      ...category,
      id: newId,
      createdAt: new Date().toISOString(),
      subCategories: []
    };
    
    setDomainGroups(prev => prev.map(group => 
      group.id === category.domainGroupId 
        ? { ...group, categories: [...group.categories, newCategory] }
        : group
    ));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setDomainGroups(prev => prev.map(group => ({
      ...group,
      categories: group.categories.map(cat => 
        cat.id === id ? { ...cat, ...updates } : cat
      )
    })));
  };

  const deleteCategory = (categoryId: string) => {
    setDomainGroups(prev => prev.map(group => ({
      ...group,
      categories: group.categories.filter(cat => cat.id !== categoryId)
    })));
  };

  const addSubCategory = (subCategory: Omit<SubCategory, 'id' | 'createdAt'>) => {
    const newId = `${subCategory.categoryId}-sub-${Date.now()}`;
    const newSubCategory: SubCategory = {
      ...subCategory,
      id: newId,
      createdAt: new Date().toISOString()
    };
    
    setDomainGroups(prev => prev.map(group => ({
      ...group,
      categories: group.categories.map(cat => 
        cat.id === subCategory.categoryId 
          ? { ...cat, subCategories: [...cat.subCategories, newSubCategory] }
          : cat
      )
    })));
  };

  const updateSubCategory = (id: string, updates: Partial<SubCategory>) => {
    setDomainGroups(prev => prev.map(group => ({
      ...group,
      categories: group.categories.map(cat => ({
        ...cat,
        subCategories: cat.subCategories.map(sub => 
          sub.id === id ? { ...sub, ...updates } : sub
        )
      }))
    })));
  };

  const deleteSubCategory = (subCategoryId: string) => {
    setDomainGroups(prev => prev.map(group => ({
      ...group,
      categories: group.categories.map(cat => ({
        ...cat,
        subCategories: cat.subCategories.filter(sub => sub.id !== subCategoryId)
      }))
    })));
  };

  return {
    addDomainGroup,
    updateDomainGroup,
    deleteDomainGroup,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  };
};
