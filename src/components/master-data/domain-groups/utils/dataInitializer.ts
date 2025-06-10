
import { DomainGroup, IndustrySegment } from '../types';
import { getDomainGroupsForIndustry, clearAllCacheData, DATA_VERSION } from '../data/industryDataRegistry';

export const initializeDomainGroupsData = (industrySegments: IndustrySegment[]): DomainGroup[] => {
  console.log('Initializing domain groups data for segments:', industrySegments);
  
  // Check if we need to clear cache due to version change
  const cachedVersion = localStorage.getItem('domainGroupsVersion');
  if (cachedVersion !== DATA_VERSION) {
    console.log(`Data version mismatch (cached: ${cachedVersion}, current: ${DATA_VERSION}). Clearing all cache.`);
    clearAllCacheData();
    localStorage.setItem('domainGroupsVersion', DATA_VERSION);
  }

  // Clear any existing old cached data to force refresh with new structure
  clearAllCacheData();
  console.log('Cleared all cached domain groups data to force refresh with latest structure');

  // Initialize with fresh data from registry
  const allDomainGroups: DomainGroup[] = [];

  industrySegments.forEach(segment => {
    console.log(`Processing segment: ${segment.name} (ID: ${segment.id})`);
    
    // Get domain groups for this industry from the registry
    const industryDomainGroups = getDomainGroupsForIndustry(segment.id, segment.name);
    
    if (industryDomainGroups.length > 0) {
      // Add industry segment ID to each domain group
      const segmentGroups = industryDomainGroups.map(group => ({
        ...group,
        industrySegmentId: segment.id
      }));
      
      allDomainGroups.push(...segmentGroups);
      console.log(`Added ${segmentGroups.length} domain groups for ${segment.name}:`, segmentGroups.map(g => g.name));
    } else {
      console.log(`No specific domain groups found for ${segment.name}`);
    }
  });

  console.log('Initialized complete domain groups data:', allDomainGroups);
  
  // Save the fresh data to localStorage with versioning
  localStorage.setItem('domainGroupsData', JSON.stringify(allDomainGroups));
  localStorage.setItem('domainGroupsVersion', DATA_VERSION);
  localStorage.setItem('domainGroupsLastUpdate', new Date().toISOString());
  console.log('Saved fresh domain groups data to localStorage with version', DATA_VERSION);
  
  return allDomainGroups;
};

// Function to get cached data for a specific industry segment
export const getCachedDomainGroupsForSegment = (industrySegmentId: string): DomainGroup[] | null => {
  try {
    const cachedData = localStorage.getItem('domainGroupsData');
    if (cachedData) {
      const allGroups: DomainGroup[] = JSON.parse(cachedData);
      const segmentGroups = allGroups.filter(group => group.industrySegmentId === industrySegmentId);
      
      if (segmentGroups.length > 0) {
        console.log(`Found ${segmentGroups.length} cached domain groups for segment ${industrySegmentId}`);
        return segmentGroups;
      }
    }
  } catch (error) {
    console.error('Error reading cached domain groups:', error);
  }
  
  return null;
};

// Function to refresh data for a specific industry segment
export const refreshSegmentData = (industrySegment: IndustrySegment): DomainGroup[] => {
  console.log(`Refreshing data for segment: ${industrySegment.name}`);
  
  // Get fresh data from registry
  const freshData = getDomainGroupsForIndustry(industrySegment.id, industrySegment.name);
  
  // Add industry segment ID
  const segmentGroups = freshData.map(group => ({
    ...group,
    industrySegmentId: industrySegment.id
  }));
  
  // Update the cached data
  try {
    const cachedData = localStorage.getItem('domainGroupsData');
    let allGroups: DomainGroup[] = cachedData ? JSON.parse(cachedData) : [];
    
    // Remove old data for this segment
    allGroups = allGroups.filter(group => group.industrySegmentId !== industrySegment.id);
    
    // Add new data for this segment
    allGroups.push(...segmentGroups);
    
    // Save back to cache
    localStorage.setItem('domainGroupsData', JSON.stringify(allGroups));
    console.log(`Updated cache with fresh data for ${industrySegment.name}`);
  } catch (error) {
    console.error('Error updating cached data:', error);
  }
  
  return segmentGroups;
};
