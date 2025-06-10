
import { useDataPersistence } from './useDataPersistence';
import { useDomainGroupCRUD } from './useDomainGroupCRUD';
import { useCategoryCRUD } from './useCategoryCRUD';
import { useSubCategoryCRUD } from './useSubCategoryCRUD';
import { useSelectionState } from './useSelectionState';

export const useDomainGroupsData = () => {
  const {
    industrySegments,
    domainGroups,
    categories,
    subCategories,
    saveIndustrySegments,
    saveDomainGroups,
    saveCategories,
    saveSubCategories,
    loadAllData
  } = useDataPersistence();

  const {
    selectedIndustrySegment,
    selectedDomainGroup,
    selectedCategory,
    setSelectedIndustrySegment,
    setSelectedDomainGroup,
    setSelectedCategory
  } = useSelectionState();

  const {
    addDomainGroup,
    updateDomainGroup,
    deleteDomainGroup
  } = useDomainGroupCRUD({
    domainGroups,
    categories,
    subCategories,
    saveDomainGroups,
    saveCategories,
    saveSubCategories
  });

  const {
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategoryCRUD({
    categories,
    subCategories,
    saveCategories,
    saveSubCategories
  });

  const {
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  } = useSubCategoryCRUD({
    subCategories,
    saveSubCategories
  });

  return {
    // Data
    industrySegments,
    domainGroups,
    categories,
    subCategories,
    
    // Selection state
    selectedIndustrySegment,
    selectedDomainGroup,
    selectedCategory,
    setSelectedIndustrySegment,
    setSelectedDomainGroup,
    setSelectedCategory,
    
    // Save functions
    saveIndustrySegments,
    saveDomainGroups,
    saveCategories,
    saveSubCategories,
    loadAllData,
    
    // CRUD operations
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
