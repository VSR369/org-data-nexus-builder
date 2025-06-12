
import { DomainGroupsData, DomainGroup, Category, SubCategory } from '@/types/domainGroups';
import { domainGroupsDataManager } from '../domainGroupsDataManager';
import { industrySegmentDataManager } from '../industrySegmentDataManager';
import { HierarchyData, SavedExcelDocument } from './excelProcessing';

interface IntegrationResult {
  domainGroups: number;
  categories: number;
  subCategories: number;
  mergedCategories: number;
  mergedSubCategories: number;
  skippedDuplicates: number;
}

export const convertToMasterDataFormat = (
  hierarchyData: HierarchyData, 
  savedDocument: SavedExcelDocument | null
): IntegrationResult => {
  if (!hierarchyData || Object.keys(hierarchyData).length === 0) {
    throw new Error("No Excel data to convert to master data format");
  }

  console.log('🔄 Converting Excel data to master data format with intelligent merging...');

  // Load existing data
  const existingData = domainGroupsDataManager.loadData();
  const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
  
  console.log('📦 Existing data:', existingData);
  console.log('📦 Industry segments:', industrySegments);
  
  const newDomainGroups: DomainGroup[] = [];
  const newCategories: Category[] = [];
  const newSubCategories: SubCategory[] = [];
  
  let domainGroupCounter = existingData.domainGroups.length + 1;
  let categoryCounter = existingData.categories.length + 1;
  let subCategoryCounter = existingData.subCategories.length + 1;

  const result: IntegrationResult = {
    domainGroups: 0,
    categories: 0,
    subCategories: 0,
    mergedCategories: 0,
    mergedSubCategories: 0,
    skippedDuplicates: 0
  };

  Object.entries(hierarchyData).forEach(([industrySegmentName, domainGroups]) => {
    // Find industry segment
    let industrySegment = industrySegments.find(is => is.industrySegment === industrySegmentName);
    if (!industrySegment) {
      console.warn(`Industry segment "${industrySegmentName}" not found in master data`);
      return; // Skip if industry segment doesn't exist
    }

    Object.entries(domainGroups).forEach(([domainGroupName, categories]) => {
      // Check if domain group already exists
      let existingDomainGroup = existingData.domainGroups.find(
        dg => dg.name === domainGroupName && dg.industrySegmentId === industrySegment!.id
      );
      
      let domainGroupId: string;
      
      if (existingDomainGroup) {
        console.log(`Domain group "${domainGroupName}" already exists, merging categories...`);
        domainGroupId = existingDomainGroup.id;
        result.skippedDuplicates++;
      } else {
        // Create new domain group
        domainGroupId = `dg_${domainGroupCounter++}`;
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
        result.domainGroups++;
      }

      Object.entries(categories).forEach(([categoryName, subCategories]) => {
        // Check if category already exists for this domain group
        let existingCategory = existingData.categories.find(
          cat => cat.name === categoryName && cat.domainGroupId === domainGroupId
        );
        
        let categoryId: string;
        
        if (existingCategory) {
          console.log(`Category "${categoryName}" already exists, merging sub-categories...`);
          categoryId = existingCategory.id;
          result.mergedCategories++;
        } else {
          // Create new category
          categoryId = `cat_${categoryCounter++}`;
          const newCategory: Category = {
            id: categoryId,
            name: categoryName,
            description: `Imported from Excel: ${savedDocument?.fileName || 'Unknown file'}`,
            domainGroupId: domainGroupId,
            isActive: true,
            createdAt: new Date().toISOString()
          };
          newCategories.push(newCategory);
          result.categories++;
        }

        // Handle sub-categories
        subCategories.forEach(subCategoryName => {
          // Check if sub-category already exists for this category
          const existingSubCategory = existingData.subCategories.find(
            sub => sub.name === subCategoryName && sub.categoryId === categoryId
          );
          
          if (existingSubCategory) {
            console.log(`Sub-category "${subCategoryName}" already exists, skipping...`);
            result.mergedSubCategories++;
          } else {
            // Create new sub-category
            const subCategoryId = `sub_${subCategoryCounter++}`;
            const newSubCategory: SubCategory = {
              id: subCategoryId,
              name: subCategoryName,
              description: `Imported from Excel: ${savedDocument?.fileName || 'Unknown file'}`,
              categoryId: categoryId,
              isActive: true,
              createdAt: new Date().toISOString()
            };
            newSubCategories.push(newSubCategory);
            result.subCategories++;
          }
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

  console.log('📦 Updated data to save:', updatedData);

  // Save to master data
  domainGroupsDataManager.saveData(updatedData);

  // Trigger storage event to notify other components
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'master_data_domain_groups',
    newValue: JSON.stringify(updatedData)
  }));

  console.log('✅ Excel data converted and saved to master data format:', result);

  return result;
};
