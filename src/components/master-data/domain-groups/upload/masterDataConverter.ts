
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
  console.log('📊 Input hierarchy data:', hierarchyData);

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

  console.log('🔄 Processing hierarchy data...');

  Object.entries(hierarchyData).forEach(([industrySegmentName, domainGroups]) => {
    console.log(`🏭 Processing industry segment: ${industrySegmentName}`);
    
    // Find industry segment
    let industrySegment = industrySegments.find(is => is.industrySegment === industrySegmentName);
    if (!industrySegment) {
      console.warn(`⚠️ Industry segment "${industrySegmentName}" not found in master data`);
      return; // Skip if industry segment doesn't exist
    }

    console.log(`✅ Found industry segment: ${industrySegment.industrySegment} (ID: ${industrySegment.id})`);

    Object.entries(domainGroups).forEach(([domainGroupName, categories]) => {
      console.log(`🏢 Processing domain group: ${domainGroupName}`);
      console.log(`📊 Categories in this domain group:`, Object.keys(categories));
      
      // Check if domain group already exists
      let existingDomainGroup = existingData.domainGroups.find(
        dg => dg.name === domainGroupName && dg.industrySegmentId === industrySegment!.id
      );
      
      let domainGroupId: string;
      
      if (existingDomainGroup) {
        console.log(`♻️ Domain group "${domainGroupName}" already exists, merging categories...`);
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
        console.log(`✅ Created new domain group: ${domainGroupName} (ID: ${domainGroupId})`);
      }

      Object.entries(categories).forEach(([categoryName, subCategories]) => {
        console.log(`📁 Processing category: ${categoryName}`);
        console.log(`📊 Sub-categories in this category:`, subCategories);
        
        // Check if category already exists for this domain group
        let existingCategory = existingData.categories.find(
          cat => cat.name === categoryName && cat.domainGroupId === domainGroupId
        );
        
        let categoryId: string;
        
        if (existingCategory) {
          console.log(`♻️ Category "${categoryName}" already exists, merging sub-categories...`);
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
          console.log(`✅ Created new category: ${categoryName} (ID: ${categoryId})`);
        }

        // Handle sub-categories - ensure we process all of them
        console.log(`🔄 Processing ${subCategories.length} sub-categories for category: ${categoryName}`);
        subCategories.forEach((subCategoryName, index) => {
          console.log(`📝 Processing sub-category ${index + 1}/${subCategories.length}: ${subCategoryName}`);
          
          // Check if sub-category already exists for this category
          const existingSubCategory = existingData.subCategories.find(
            sub => sub.name === subCategoryName && sub.categoryId === categoryId
          );
          
          if (existingSubCategory) {
            console.log(`♻️ Sub-category "${subCategoryName}" already exists, skipping...`);
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
            console.log(`✅ Created new sub-category: ${subCategoryName} (ID: ${subCategoryId})`);
          }
        });
      });
    });
  });

  console.log('📊 Integration results:');
  console.log(`🏢 New domain groups: ${result.domainGroups}`);
  console.log(`📁 New categories: ${result.categories}`);
  console.log(`📝 New sub-categories: ${result.subCategories}`);
  console.log(`♻️ Merged categories: ${result.mergedCategories}`);
  console.log(`♻️ Merged sub-categories: ${result.mergedSubCategories}`);
  console.log(`⏭️ Skipped duplicates: ${result.skippedDuplicates}`);

  // Merge with existing data
  const updatedData: DomainGroupsData = {
    domainGroups: [...existingData.domainGroups, ...newDomainGroups],
    categories: [...existingData.categories, ...newCategories],
    subCategories: [...existingData.subCategories, ...newSubCategories]
  };

  console.log('📦 Final updated data to save:');
  console.log(`🏢 Total domain groups: ${updatedData.domainGroups.length}`);
  console.log(`📁 Total categories: ${updatedData.categories.length}`);
  console.log(`📝 Total sub-categories: ${updatedData.subCategories.length}`);

  // Save to master data
  domainGroupsDataManager.saveData(updatedData);
  console.log('💾 Data saved to localStorage');

  // Trigger storage event to notify other components
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'master_data_domain_groups',
    newValue: JSON.stringify(updatedData)
  }));
  console.log('📡 Storage event dispatched');

  console.log('✅ Excel data converted and saved to master data format:', result);

  return result;
};
