
import { DomainGroup } from '../types';
import { lifeSciencesDomainGroups } from './lifeSciencesDomainGroups';
import { manufacturingDomainGroups } from './manufacturingDomainGroups';

// Define the data version for cache management
export const DATA_VERSION = '2.0.0';

// Registry mapping industry segments to their data files
export const industryDataRegistry = {
  'healthcare-life-sciences': {
    name: 'Healthcare & Life Sciences',
    dataLoader: () => lifeSciencesDomainGroups,
    version: DATA_VERSION
  },
  'manufacturing': {
    name: 'Manufacturing (Smart / Discrete / Process)',
    dataLoader: () => manufacturingDomainGroups,
    version: DATA_VERSION
  }
  // Add more industry segments as they are created
};

// Helper function to get domain groups for a specific industry segment
export const getDomainGroupsForIndustry = (industrySegmentId: string, industrySegmentName: string): Omit<DomainGroup, 'industrySegmentId'>[] => {
  console.log(`Loading domain groups for industry: ${industrySegmentName} (ID: ${industrySegmentId})`);
  
  // Check for exact name matches first
  const registryEntry = Object.values(industryDataRegistry).find(entry => 
    entry.name === industrySegmentName
  );
  
  if (registryEntry) {
    console.log(`Found specific data for industry: ${industrySegmentName}`);
    return registryEntry.dataLoader();
  }
  
  // Check for partial name matches
  const partialMatch = Object.values(industryDataRegistry).find(entry => 
    industrySegmentName.toLowerCase().includes(entry.name.toLowerCase().split(' ')[0].toLowerCase()) ||
    entry.name.toLowerCase().includes(industrySegmentName.toLowerCase().split(' ')[0].toLowerCase())
  );
  
  if (partialMatch) {
    console.log(`Found partial match for industry: ${industrySegmentName} -> ${partialMatch.name}`);
    return partialMatch.dataLoader();
  }
  
  // Return empty array for industries without specific data
  console.log(`No specific data found for industry: ${industrySegmentName}, returning empty array`);
  return [];
};

// Function to clear cache for a specific industry segment
export const clearIndustryCacheData = (industrySegmentId: string) => {
  const cacheKey = `domainGroups_${industrySegmentId}`;
  localStorage.removeItem(cacheKey);
  console.log(`Cleared cache for industry segment: ${industrySegmentId}`);
};

// Function to clear all cached data and force refresh
export const clearAllCacheData = () => {
  // Remove old general cache
  localStorage.removeItem('domainGroupsData');
  
  // Remove industry-specific caches
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('domainGroups_')) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('Cleared all domain groups cache data');
};
