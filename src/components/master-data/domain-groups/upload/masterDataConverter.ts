
import { DomainGroupsData, DomainGroup, Category, SubCategory } from '@/types/domainGroups';
import { domainGroupsDataManager } from '../domainGroupsDataManager';
import { industrySegmentDataManager } from '../industrySegmentDataManager';
import { HierarchyData, SavedExcelDocument } from './types';

interface IntegrationResult {
  domainGroups: number;
  categories: number;
  subCategories: number;
  mergedCategories: number;
  mergedSubCategories: number;
  skippedDuplicates: number;
  createdIndustrySegments: number;
}

export const convertToMasterDataFormat = async (
  hierarchyData: HierarchyData, 
  savedDocument: SavedExcelDocument | null
): Promise<IntegrationResult> => {
  console.log('🔄 Starting Excel to Master Data conversion...');
  console.log('📊 Input hierarchy data:', hierarchyData);

  if (!hierarchyData || Object.keys(hierarchyData).length === 0) {
    throw new Error("No valid Excel hierarchy data to convert to master data format");
  }

  // Load existing data
  const existingData = await domainGroupsDataManager.loadData();
  let industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
  
  console.log('📦 Existing domain groups data:', existingData);
  console.log('📦 Available industry segments:', industrySegments.map(is => ({ id: is.id, name: is.industrySegment })));
  
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
    skippedDuplicates: 0,
    createdIndustrySegments: 0
  };

  console.log('🔄 Processing each industry segment in hierarchy...');

  Object.entries(hierarchyData).forEach(([industrySegmentName, domainGroups]) => {
    console.log(`\n🏭 Processing industry segment: "${industrySegmentName}"`);
    
    // Find matching industry segment (case-insensitive and fuzzy matching)
    let industrySegment = industrySegments.find(is => 
      is.industrySegment.toLowerCase().trim() === industrySegmentName.toLowerCase().trim() ||
      is.industrySegment.toLowerCase().replace(/[^a-z0-9]/g, '') === industrySegmentName.toLowerCase().replace(/[^a-z0-9]/g, '')
    );
    
    if (!industrySegment) {
      // Create missing industry segment automatically
      console.log(`⚠️ Industry segment "${industrySegmentName}" not found, creating it...`);
      const newIndustrySegment = {
        id: `is_${industrySegments.length + result.createdIndustrySegments + 1}`,
        industrySegment: industrySegmentName,
        description: `Auto-created from Excel import: ${savedDocument?.fileName || 'Unknown file'}`,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      industrySegments.push(newIndustrySegment);
      industrySegment = newIndustrySegment;
      result.createdIndustrySegments++;
      console.log(`✅ Created new industry segment: ${industrySegmentName} (ID: ${newIndustrySegment.id})`);
      
      // Save the updated industry segments
      try {
        industrySegmentDataManager.saveData({ industrySegments });
        console.log('💾 Saved updated industry segments');
      } catch (error) {
        console.error('❌ Error saving industry segments:', error);
      }
    } else {
      console.log(`✅ Found matching industry segment: ${industrySegment.industrySegment} (ID: ${industrySegment.id})`);
    }

    Object.entries(domainGroups).forEach(([domainGroupName, categories]) => {
      console.log(`\n🏢 Processing domain group: "${domainGroupName}"`);
      console.log(`📊 Categories in this domain group: [${Object.keys(categories).join(', ')}]`);
      
      // Check if domain group already exists
      let existingDomainGroup = existingData.domainGroups.find(
        dg => dg.name.toLowerCase().trim() === domainGroupName.toLowerCase().trim() && 
              dg.industry_segment_id === industrySegment!.id
      );
      
      let domainGroupId: string;
      
      if (existingDomainGroup) {
        console.log(`♻️ Domain group "${domainGroupName}" already exists, using existing ID: ${existingDomainGroup.id}`);
        domainGroupId = existingDomainGroup.id;
        result.skippedDuplicates++;
      } else {
        // Create new domain group
        domainGroupId = `dg_${domainGroupCounter++}`;
        const newDomainGroup: DomainGroup = {
          id: domainGroupId,
          name: domainGroupName,
          description: `Imported from Excel: ${savedDocument?.fileName || 'Unknown file'}`,
          industry_segment_id: industrySegment!.id,
          industrySegmentName: industrySegmentName,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        newDomainGroups.push(newDomainGroup);
        result.domainGroups++;
        console.log(`✅ Created new domain group: ${domainGroupName} (ID: ${domainGroupId})`);
      }

      Object.entries(categories).forEach(([categoryName, subCategories]) => {
        console.log(`\n📁 Processing category: "${categoryName}"`);
        console.log(`📊 Sub-categories: [${subCategories.join(', ')}]`);
        
        // Check if category already exists for this domain group
        let existingCategory = existingData.categories.find(
          cat => cat.name.toLowerCase().trim() === categoryName.toLowerCase().trim() && 
                 cat.domain_group_id === domainGroupId
        );
        
        let categoryId: string;
        
        if (existingCategory) {
          console.log(`♻️ Category "${categoryName}" already exists, using existing ID: ${existingCategory.id}`);
          categoryId = existingCategory.id;
          result.mergedCategories++;
        } else {
          // Create new category
          categoryId = `cat_${categoryCounter++}`;
          const newCategory: Category = {
            id: categoryId,
            name: categoryName,
            description: `Imported from Excel: ${savedDocument?.fileName || 'Unknown file'}`,
            domain_group_id: domainGroupId,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          newCategories.push(newCategory);
          result.categories++;
          console.log(`✅ Created new category: ${categoryName} (ID: ${categoryId})`);
        }

        // Process sub-categories
        console.log(`🔄 Processing ${subCategories.length} sub-categories for category: ${categoryName}`);
        subCategories.forEach((subCategoryName, index) => {
          console.log(`📝 Processing sub-category ${index + 1}/${subCategories.length}: "${subCategoryName}"`);
          
          // Check if sub-category already exists for this category
          const existingSubCategory = existingData.subCategories.find(
            sub => sub.name.toLowerCase().trim() === subCategoryName.toLowerCase().trim() && 
                   sub.category_id === categoryId
          );
          
          if (existingSubCategory) {
            console.log(`♻️ Sub-category "${subCategoryName}" already exists, using existing ID: ${existingSubCategory.id}`);
            result.mergedSubCategories++;
          } else {
            // Create new sub-category
            const subCategoryId = `sub_${subCategoryCounter++}`;
            const newSubCategory: SubCategory = {
              id: subCategoryId,
              name: subCategoryName,
              description: `Imported from Excel: ${savedDocument?.fileName || 'Unknown file'}`,
              category_id: categoryId,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            newSubCategories.push(newSubCategory);
            result.subCategories++;
            console.log(`✅ Created new sub-category: ${subCategoryName} (ID: ${subCategoryId})`);
          }
        });
      });
    });
  });

  console.log('\n📊 Integration Summary:');
  console.log(`🏭 Created industry segments: ${result.createdIndustrySegments}`);
  console.log(`🏢 New domain groups: ${result.domainGroups}`);
  console.log(`📁 New categories: ${result.categories}`);
  console.log(`📝 New sub-categories: ${result.subCategories}`);
  console.log(`♻️ Merged categories: ${result.mergedCategories}`);
  console.log(`♻️ Merged sub-categories: ${result.mergedSubCategories}`);
  console.log(`⏭️ Skipped duplicate domain groups: ${result.skippedDuplicates}`);

  // Merge with existing data
  const updatedData: DomainGroupsData = {
    domainGroups: [...existingData.domainGroups, ...newDomainGroups],
    categories: [...existingData.categories, ...newCategories],
    subCategories: [...existingData.subCategories, ...newSubCategories]
  };

  console.log('\n📦 Final data to save:');
  console.log(`🏢 Total domain groups: ${updatedData.domainGroups.length}`);
  console.log(`📁 Total categories: ${updatedData.categories.length}`);
  console.log(`📝 Total sub-categories: ${updatedData.subCategories.length}`);

  // Save to master data with error handling
  try {
    domainGroupsDataManager.saveData(updatedData);
    console.log('💾 Data saved successfully to localStorage');
    
    // Trigger storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'master_data_domain_groups',
      newValue: JSON.stringify(updatedData)
    }));
    console.log('📡 Storage event dispatched to notify components');
    
  } catch (error) {
    console.error('❌ Error saving data:', error);
    throw new Error(`Failed to save converted data: ${error}`);
  }

  console.log('✅ Excel data conversion completed successfully');
  return result;
};
