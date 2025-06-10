
// Utility to clear all domain groups related cache data
export const clearDomainGroupsCache = () => {
  const keysToRemove = [
    'domainGroupsData',
    'categoriesData', 
    'subCategoriesData',
    'domainGroupsVersion',
    'domainGroupsLastUpdate'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  // Also remove any industry-specific caches
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.startsWith('domainGroups_')) {
      localStorage.removeItem(key);
    }
  });

  console.log('Cleared all domain groups cache data');
};

// Auto-execute cache clearing
clearDomainGroupsCache();
