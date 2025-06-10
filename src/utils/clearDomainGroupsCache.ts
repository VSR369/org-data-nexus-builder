
// Utility to clear all domain groups related cache data
export const clearDomainGroupsCache = () => {
  const keysToRemove = [
    'domainGroupsData',
    'categoriesData', 
    'subCategoriesData',
    'domainGroupsVersion',
    'domainGroupsLastUpdate',
    'master_data_domain_groups',
    'master_data_domain_groups_hierarchy',
    'master_data_domain_groups_version',
    'master_data_domain_groups_initialized',
    'master_data_domain_groups_hierarchy_version',
    'master_data_domain_groups_hierarchy_initialized',
    'domain_groups',
    'categories',
    'sub_categories'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  // Also remove any industry-specific caches and domain-related keys
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.startsWith('domainGroups_') || 
        key.includes('domain') || 
        key.includes('Domain') || 
        key.includes('category') || 
        key.includes('Category')) {
      localStorage.removeItem(key);
    }
  });

  console.log('✅ Cleared all domain groups cache data completely');
};

// Auto-execute cache clearing
clearDomainGroupsCache();
