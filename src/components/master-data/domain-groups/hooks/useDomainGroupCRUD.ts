
import { DomainGroup, Category, SubCategory } from '../types';

interface UseDomainGroupCRUDProps {
  domainGroups: DomainGroup[];
  categories: Category[];
  subCategories: SubCategory[];
  saveDomainGroups: (groups: DomainGroup[]) => void;
  saveCategories: (cats: Category[]) => void;
  saveSubCategories: (subCats: SubCategory[]) => void;
}

export const useDomainGroupCRUD = ({
  domainGroups,
  categories,
  subCategories,
  saveDomainGroups,
  saveCategories,
  saveSubCategories
}: UseDomainGroupCRUDProps) => {
  const addDomainGroup = (group: Omit<DomainGroup, 'id' | 'createdAt' | 'categories'>) => {
    const newGroup: DomainGroup = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      categories: []
    };
    const updatedGroups = [...domainGroups, newGroup];
    saveDomainGroups(updatedGroups);
  };

  const updateDomainGroup = (id: string, updates: Partial<DomainGroup>) => {
    const updatedGroups = domainGroups.map(group =>
      group.id === id ? { ...group, ...updates } : group
    );
    saveDomainGroups(updatedGroups);
  };

  const deleteDomainGroup = (id: string) => {
    const updatedGroups = domainGroups.filter(group => group.id !== id);
    saveDomainGroups(updatedGroups);
    
    // Also remove related categories and subcategories
    const updatedCategories = categories.filter(cat => cat.domainGroupId !== id);
    saveCategories(updatedCategories);
    
    const categoryIds = categories.filter(cat => cat.domainGroupId === id).map(cat => cat.id);
    const updatedSubCategories = subCategories.filter(subCat => !categoryIds.includes(subCat.categoryId));
    saveSubCategories(updatedSubCategories);
  };

  return {
    addDomainGroup,
    updateDomainGroup,
    deleteDomainGroup
  };
};
