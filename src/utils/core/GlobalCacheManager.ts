
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
    
    // Clear all pricing-related localStorage keys
    const pricingKeys = [
      'custom_pricing',
      'master_data_pricing_configs',
      'custom_pricingConfigs',
      'pricing_deleted_configs',
      'custom_pricing_backup',
      'pricing_configs'
    ];
    
    pricingKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear all membership fee related keys
    const membershipKeys = [
      'master_data_seeker_membership_fees',
      'custom_seekerMembershipFees',
      'user_created_master_data_seeker_membership_fees',
      'backup_master_data_seeker_membership_fees',
      'master_data_seeker_membership_fees_version',
      'master_data_seeker_membership_fees_timestamp',
      'master_data_seeker_membership_fees_metadata'
    ];

    membershipKeys.forEach(key => {
      localStorage.removeItem(key);
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
    
    console.log('All master data cache cleared, including pricing data, membership fees, and old keys');
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
