
// Global cache manager
export class GlobalCacheManager {
  private static keys = new Set<string>();

  static registerKey(key: string): void {
    this.keys.add(key);
  }

  static clearAllCache(): void {
    this.keys.forEach(key => {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_version`);
      localStorage.removeItem(`${key}_initialized`);
    });
    
    // Also clear old keys that might be lingering
    const oldKeys = [
      'industrySegments',
      'organizationTypes',
      'entityTypes',
      'countries',
      'currencies',
      'departments',
      'challengeStatuses',
      'solutionStatuses',
      'rewardTypes',
      'communicationTypes',
      'master_data_domain_groups',
      'master_data_domain_groups_hierarchy',
      'master_data_industry_segments'
    ];
    
    oldKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear all domain groups related data specifically
    this.clearDomainGroupsData();
    
    console.log('All master data cache cleared, including old keys and domain groups data');
  }

  static clearDomainGroupsData(): void {
    // Clear all domain groups related keys
    const domainGroupsKeys = [
      'master_data_domain_groups',
      'master_data_domain_groups_hierarchy',
      'master_data_domain_groups_version',
      'master_data_domain_groups_initialized',
      'master_data_domain_groups_hierarchy_version',
      'master_data_domain_groups_hierarchy_initialized',
      'domainGroupsData',
      'categoriesData',
      'subCategoriesData',
      'domainGroupsVersion',
      'domainGroupsLastUpdate',
      'domain_groups',
      'categories',
      'sub_categories'
    ];

    domainGroupsKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Also check for any keys that start with domain groups related prefixes
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.includes('domain') || key.includes('Domain') || key.includes('category') || key.includes('Category')) {
        localStorage.removeItem(key);
      }
    });

    console.log('🗑️ All domain groups related data cleared from localStorage');
  }

  static getStoredKeys(): string[] {
    return Array.from(this.keys);
  }
}
