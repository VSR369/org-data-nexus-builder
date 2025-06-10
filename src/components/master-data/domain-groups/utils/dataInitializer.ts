
import { DomainGroup, IndustrySegment } from '../types';
import { lifeSciencesDomainGroups } from '../data/lifeSciencesDomainGroups';

export const initializeDomainGroupsData = (industrySegments: IndustrySegment[]): DomainGroup[] => {
  console.log('Initializing domain groups data for segments:', industrySegments);
  
  // Clear any existing cached data to force refresh
  localStorage.removeItem('domainGroupsData');
  console.log('Cleared cached domain groups data to force refresh');

  // Initialize with fresh data
  const allDomainGroups: DomainGroup[] = [];

  // Find the Life Sciences industry segment
  const lifeSciencesSegment = industrySegments.find(segment => 
    segment.name.toLowerCase().includes('healthcare') || 
    segment.name.toLowerCase().includes('life sciences')
  );

  if (lifeSciencesSegment) {
    console.log('Found Life Sciences segment:', lifeSciencesSegment);
    
    // Add Life Sciences domain groups with proper industry segment ID
    const lifeSciencesGroups = lifeSciencesDomainGroups.map(group => ({
      ...group,
      industrySegmentId: lifeSciencesSegment.id
    }));
    
    allDomainGroups.push(...lifeSciencesGroups);
    console.log('Added Life Sciences domain groups:', lifeSciencesGroups);
  }

  // Add default groups for other segments if needed
  industrySegments.forEach(segment => {
    if (segment.id !== lifeSciencesSegment?.id) {
      // Add a sample domain group for other segments
      allDomainGroups.push({
        id: `${segment.id}-dg-1`,
        name: 'Sample Domain Group',
        description: `Sample domain group for ${segment.name}`,
        industrySegmentId: segment.id,
        isActive: true,
        createdAt: new Date().toISOString(),
        categories: []
      });
    }
  });

  console.log('Initialized complete domain groups data:', allDomainGroups);
  
  // Save the fresh data to localStorage
  localStorage.setItem('domainGroupsData', JSON.stringify(allDomainGroups));
  console.log('Saved fresh domain groups data to localStorage');
  
  return allDomainGroups;
};
