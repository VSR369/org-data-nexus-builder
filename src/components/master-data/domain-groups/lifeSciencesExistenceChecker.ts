
import { DomainGroupsData } from '@/types/domainGroups';

export const checkLifeSciencesExists = (data: DomainGroupsData): boolean => {
  const lifeSciencesExists = data.domainGroups.some(
    dg => dg.industrySegmentName === 'Life Sciences' || 
          dg.industrySegmentId === '1' ||
          dg.name.toLowerCase().includes('life sciences')
  );

  console.log('🔍 Checking Life Sciences existence:', {
    domainGroupsCount: data.domainGroups.length,
    lifeSciencesExists,
    domainGroups: data.domainGroups.map(dg => ({ 
      name: dg.name, 
      industrySegmentName: dg.industrySegmentName,
      industrySegmentId: dg.industrySegmentId 
    }))
  });

  return lifeSciencesExists;
};
