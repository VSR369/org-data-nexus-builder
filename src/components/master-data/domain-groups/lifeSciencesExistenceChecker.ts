
import { DomainGroupsData } from '@/types/domainGroups';

export const checkLifeSciencesExists = (data: DomainGroupsData): boolean => {
  console.log('🔍 === Life Sciences Existence Check START ===');
  console.log('📊 Input data structure:', {
    domainGroups: data.domainGroups?.length || 0,
    categories: data.categories?.length || 0,
    subCategories: data.subCategories?.length || 0
  });

  // Ensure we have valid data structure
  if (!data || !data.domainGroups || !Array.isArray(data.domainGroups)) {
    console.log('❌ Invalid data structure - no domain groups array');
    return false;
  }

  // Check multiple conditions for Life Sciences existence
  const lifeSciencesExists = data.domainGroups.some(dg => {
    const byIndustrySegmentName = dg.industrySegmentName === 'Life Sciences';
    const byIndustrySegmentId = dg.industrySegmentId === '1';
    const byNameIncludes = dg.name.toLowerCase().includes('life sciences');
    
    console.log('🔍 Checking domain group:', {
      name: dg.name,
      industrySegmentName: dg.industrySegmentName,
      industrySegmentId: dg.industrySegmentId,
      byIndustrySegmentName,
      byIndustrySegmentId,
      byNameIncludes
    });

    return byIndustrySegmentName || byIndustrySegmentId || byNameIncludes;
  });

  // Additional check: ensure we have categories and subcategories for Life Sciences
  const hasCompleteHierarchy = lifeSciencesExists && 
    data.categories?.length > 0 && 
    data.subCategories?.length > 0;

  console.log('📋 Existence check results:', {
    lifeSciencesExists,
    hasCompleteHierarchy,
    categoriesCount: data.categories?.length || 0,
    subCategoriesCount: data.subCategories?.length || 0
  });

  console.log('🔍 === Life Sciences Existence Check END ===');
  
  return hasCompleteHierarchy;
};

// Helper function to validate if the hierarchy is complete
export const validateLifeSciencesHierarchy = (data: DomainGroupsData): {
  exists: boolean;
  isComplete: boolean;
  missingParts: string[];
} => {
  const exists = data.domainGroups?.some(
    dg => dg.industrySegmentName === 'Life Sciences' || 
          dg.industrySegmentId === '1'
  ) || false;

  const missingParts: string[] = [];
  
  if (!exists) {
    missingParts.push('Domain Groups');
  }
  
  if (!data.categories?.length) {
    missingParts.push('Categories');
  }
  
  if (!data.subCategories?.length) {
    missingParts.push('Sub-Categories');
  }

  const isComplete = exists && data.categories?.length > 0 && data.subCategories?.length > 0;

  return { exists, isComplete, missingParts };
};
