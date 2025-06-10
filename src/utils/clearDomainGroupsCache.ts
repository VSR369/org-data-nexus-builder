
// Utility to clear all domain groups and industry segments cache data
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
    'master_data_industry_segments',
    'master_data_industry_segments_version',
    'master_data_industry_segments_initialized',
    'domain_groups',
    'categories',
    'sub_categories',
    'industry_segments'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  // Also remove any industry-specific caches and domain-related keys
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.startsWith('domainGroups_') || 
        key.startsWith('industry_') ||
        key.includes('domain') || 
        key.includes('Domain') || 
        key.includes('category') || 
        key.includes('Category') ||
        key.includes('industry') ||
        key.includes('Industry')) {
      localStorage.removeItem(key);
    }
  });

  console.log('✅ Cleared all domain groups and industry segments cache data completely');
};

// Auto-execute cache clearing
clearDomainGroupsCache();
