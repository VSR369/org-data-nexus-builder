
import { DomainGroupsData } from '@/types/domainGroups';

export const checkLifeSciencesExists = (data: DomainGroupsData): boolean => {
  console.log('🔍 === Enhanced Life Sciences Existence Check START ===');
  console.log('📊 Input data structure:', {
    domainGroups: data.domainGroups?.length || 0,
    categories: data.categories?.length || 0,
    subCategories: data.subCategories?.length || 0,
    rawData: data
  });

  // Check if we have any domain groups at all
  if (!data.domainGroups || data.domainGroups.length === 0) {
    console.log('❌ No domain groups found');
    
    // Also check localStorage directly for any domain groups data
    try {
      const directCheck = localStorage.getItem('master_data_domain_groups');
      if (directCheck) {
        const parsed = JSON.parse(directCheck);
        if (parsed && parsed.domainGroups && parsed.domainGroups.length > 0) {
          console.log('✅ Found domain groups in direct localStorage check');
          return true;
        }
      }
    } catch (error) {
      console.log('❌ Direct localStorage check failed:', error);
    }
    
    return false;
  }

  // Check if any domain group matches Life Sciences patterns
  const lifeSciencesPatterns = [
    'life sciences',
    'lifesciences', 
    'healthcare',
    'pharmaceutical',
    'biotech',
    'medical'
  ];

  const hasLifeSciencesGroup = data.domainGroups.some(group => {
    const groupName = group.name?.toLowerCase() || '';
    const industryName = group.industrySegmentName?.toLowerCase() || '';
    
    const matchesPattern = lifeSciencesPatterns.some(pattern => 
      groupName.includes(pattern) || industryName.includes(pattern)
    );
    
    console.log(`🔍 Checking group "${group.name}" (industry: "${group.industrySegmentName}"): ${matchesPattern}`);
    return matchesPattern;
  });

  // Also check if we have the standard Life Sciences structure
  const hasStandardStructure = data.domainGroups.some(group => 
    ['Strategy', 'Operations', 'People & Culture', 'Technology'].includes(group.name)
  );

  const exists = hasLifeSciencesGroup || hasStandardStructure;
  
  console.log('📊 Life Sciences existence analysis:', {
    hasLifeSciencesGroup,
    hasStandardStructure,
    totalGroups: data.domainGroups.length,
    exists
  });
  
  console.log('🔍 === Enhanced Life Sciences Existence Check END ===');
  return exists;
};

// Enhanced function to check if ANY domain groups exist (not just Life Sciences)
export const checkAnyDomainGroupsExist = (data: DomainGroupsData): boolean => {
  console.log('🔍 === Check Any Domain Groups Exist ===');
  
  // Check current data
  if (data.domainGroups && data.domainGroups.length > 0) {
    console.log('✅ Domain groups found in current data:', data.domainGroups.length);
    return true;
  }

  // Check localStorage directly
  try {
    const stored = localStorage.getItem('master_data_domain_groups');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.domainGroups && parsed.domainGroups.length > 0) {
        console.log('✅ Domain groups found in localStorage:', parsed.domainGroups.length);
        return true;
      }
    }
  } catch (error) {
    console.log('❌ Error checking localStorage:', error);
  }

  console.log('❌ No domain groups found anywhere');
  return false;
};
