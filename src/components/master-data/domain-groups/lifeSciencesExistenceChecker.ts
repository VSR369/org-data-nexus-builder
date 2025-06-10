
import { DomainGroupsData } from '@/types/domainGroups';

export const checkLifeSciencesExists = (data: DomainGroupsData): boolean => {
  console.log('🔍 === Enhanced Life Sciences Existence Check START ===');
  console.log('📊 Input data structure:', {
    domainGroups: data.domainGroups?.length || 0,
    categories: data.categories?.length || 0,
    subCategories: data.subCategories?.length || 0,
    rawData: data
  });

  // Ensure we have valid data structure
  if (!data || !data.domainGroups || !Array.isArray(data.domainGroups)) {
    console.log('❌ Invalid data structure - no domain groups array');
    return false;
  }

  // Check if we have any domain groups at all
  if (data.domainGroups.length === 0) {
    console.log('❌ No domain groups found');
    return false;
  }

  // Enhanced check for Life Sciences existence with multiple criteria
  const lifeSciencesExists = data.domainGroups.some(dg => {
    const byIndustrySegmentName = dg.industrySegmentName === 'Life Sciences';
    const byIndustrySegmentId = dg.industrySegmentId === '1';
    const byNameIncludes = dg.name && dg.name.toLowerCase().includes('life sciences');
    
    console.log('🔍 Checking domain group:', {
      id: dg.id,
      name: dg.name,
      industrySegmentName: dg.industrySegmentName,
      industrySegmentId: dg.industrySegmentId,
      byIndustrySegmentName,
      byIndustrySegmentId,
      byNameIncludes,
      matches: byIndustrySegmentName || byIndustrySegmentId || byNameIncludes
    });

    return byIndustrySegmentName || byIndustrySegmentId || byNameIncludes;
  });

  // Check for complete hierarchy - categories and subcategories
  const hasCategories = data.categories && data.categories.length > 0;
  const hasSubCategories = data.subCategories && data.subCategories.length > 0;
  
  // For Life Sciences, we expect at least some categories and subcategories
  const hasCompleteHierarchy = lifeSciencesExists && hasCategories && hasSubCategories;

  console.log('📋 Enhanced existence check results:', {
    lifeSciencesExists,
    hasCategories,
    hasSubCategories,
    hasCompleteHierarchy,
    categoriesCount: data.categories?.length || 0,
    subCategoriesCount: data.subCategories?.length || 0,
    finalResult: hasCompleteHierarchy
  });

  console.log('🔍 === Enhanced Life Sciences Existence Check END ===');
  
  return hasCompleteHierarchy;
};

// Enhanced validation function
export const validateLifeSciencesHierarchy = (data: DomainGroupsData): {
  exists: boolean;
  isComplete: boolean;
  missingParts: string[];
  details: any;
} => {
  const exists = data.domainGroups?.some(
    dg => dg.industrySegmentName === 'Life Sciences' || 
          dg.industrySegmentId === '1' ||
          (dg.name && dg.name.toLowerCase().includes('life sciences'))
  ) || false;

  const missingParts: string[] = [];
  
  if (!exists) {
    missingParts.push('Life Sciences Domain Groups');
  }
  
  if (!data.categories || data.categories.length === 0) {
    missingParts.push('Categories');
  }
  
  if (!data.subCategories || data.subCategories.length === 0) {
    missingParts.push('Sub-Categories');
  }

  const isComplete = exists && data.categories?.length > 0 && data.subCategories?.length > 0;

  const details = {
    domainGroupsCount: data.domainGroups?.length || 0,
    categoriesCount: data.categories?.length || 0,
    subCategoriesCount: data.subCategories?.length || 0,
    lifeSciencesDomainGroups: data.domainGroups?.filter(dg => 
      dg.industrySegmentName === 'Life Sciences' || 
      dg.industrySegmentId === '1' ||
      (dg.name && dg.name.toLowerCase().includes('life sciences'))
    ) || []
  };

  console.log('🔍 Validation results:', { exists, isComplete, missingParts, details });

  return { exists, isComplete, missingParts, details };
};
