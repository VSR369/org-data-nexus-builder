
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
      'communicationTypes'
    ];
    
    oldKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('All master data cache cleared, including old keys');
  }

  static clearDomainGroupsData(): void {
    // Only clear specific domain groups keys - be precise, not aggressive
    const domainGroupsKeys = [
      'master_data_domain_groups',
      'master_data_domain_groups_version',
      'master_data_domain_groups_initialized'
    ];

    domainGroupsKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('🗑️ Specific domain groups data cleared from localStorage');
  }

  static getStoredKeys(): string[] {
    return Array.from(this.keys);
  }
}
