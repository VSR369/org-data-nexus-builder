
import { DomainGroupsData, DomainGroup, Category, SubCategory } from '@/types/domainGroups';
import { domainGroupsDataManager } from '../domainGroupsDataManager';
import { industrySegmentDataManager } from '../industrySegmentDataManager';
import { HierarchyData, SavedExcelDocument } from './excelProcessing';

export const convertToMasterDataFormat = (hierarchyData: HierarchyData, savedDocument: SavedExcelDocument | null) => {
  if (!hierarchyData || Object.keys(hierarchyData).length === 0) {
    throw new Error("No Excel data to convert to master data format");
  }

  // Load existing data
  const existingData = domainGroupsDataManager.loadData();
  const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
  
  const newDomainGroups: DomainGroup[] = [];
  const newCategories: Category[] = [];
  const newSubCategories: SubCategory[] = [];
  
  let domainGroupCounter = existingData.domainGroups.length + 1;
  let categoryCounter = existingData.categories.length + 1;
  let subCategoryCounter = existingData.subCategories.length + 1;

  Object.entries(hierarchyData).forEach(([industrySegmentName, domainGroups]) => {
    // Find or create industry segment
    let industrySegment = industrySegments.find(is => is.industrySegment === industrySegmentName);
    if (!industrySegment) {
      console.warn(`Industry segment "${industrySegmentName}" not found in master data`);
      return; // Skip if industry segment doesn't exist
    }

    Object.entries(domainGroups).forEach(([domainGroupName, categories]) => {
      // Check if domain group already exists
      const existingDomainGroup = existingData.domainGroups.find(
        dg => dg.name === domainGroupName && dg.industrySegmentId === industrySegment!.id
      );
      
      if (existingDomainGroup) {
        console.log(`Domain group "${domainGroupName}" already exists, skipping`);
        return;
      }

      const domainGroupId = `dg_${domainGroupCounter++}`;
      const newDomainGroup: DomainGroup = {
        id: domainGroupId,
        name: domainGroupName,
        description: `Imported from Excel: ${savedDocument?.fileName || 'Unknown file'}`,
        industrySegmentId: industrySegment!.id,
        industrySegmentName: industrySegmentName,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      newDomainGroups.push(newDomainGroup);

      Object.entries(categories).forEach(([categoryName, subCategories]) => {
        const categoryId = `cat_${categoryCounter++}`;
        const newCategory: Category = {
          id: categoryId,
          name: categoryName,
          description: `Imported from Excel`,
          domainGroupId: domainGroupId,
          isActive: true,
          createdAt: new Date().toISOString()
        };
        newCategories.push(newCategory);

        subCategories.forEach(subCategoryName => {
          const subCategoryId = `sub_${subCategoryCounter++}`;
          const newSubCategory: SubCategory = {
            id: subCategoryId,
            name: subCategoryName,
            description: `Imported from Excel`,
            categoryId: categoryId,
            isActive: true,
            createdAt: new Date().toISOString()
          };
          newSubCategories.push(newSubCategory);
        });
      });
    });
  });

  // Merge with existing data
  const updatedData: DomainGroupsData = {
    domainGroups: [...existingData.domainGroups, ...newDomainGroups],
    categories: [...existingData.categories, ...newCategories],
    subCategories: [...existingData.subCategories, ...newSubCategories]
  };

  // Save to master data
  domainGroupsDataManager.saveData(updatedData);

  console.log('✅ Excel data converted and saved to master data format:', {
    domainGroups: newDomainGroups.length,
    categories: newCategories.length,
    subCategories: newSubCategories.length
  });

  return {
    domainGroups: newDomainGroups.length,
    categories: newCategories.length,
    subCategories: newSubCategories.length
  };
};
