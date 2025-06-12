
import { DomainGroupsData } from '@/types/domainGroups';
import { UniversalDataManager } from '@/utils/core/UniversalDataManager';
import { seedingService } from '@/utils/core/UniversalSeedingService';

// Default data structure
const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

// Validation function for domain groups data
const validateDomainGroupsData = (data: any): boolean => {
  console.log(`🔍 Validating domain groups data structure:`, data);
  const isValid = data && 
                 typeof data === 'object' && 
                 Array.isArray(data.domainGroups) && 
                 Array.isArray(data.categories) && 
                 Array.isArray(data.subCategories);
  console.log(`✅ Validation result: ${isValid}`);
  return isValid;
};

// Seeding function for domain groups
const seedDomainGroupsData = (): DomainGroupsData => {
  console.log('🌱 Seeding domain groups default data');
  return defaultDomainGroupsData;
};

// Create universal data manager instance
const domainGroupsManager = new UniversalDataManager<DomainGroupsData>({
  key: 'master_data_domain_groups',
  defaultData: defaultDomainGroupsData,
  version: 4, // Increment version for the new system
  seedFunction: seedDomainGroupsData,
  validationFunction: validateDomainGroupsData
});

// Register with seeding service
seedingService.registerManager('domain_groups', domainGroupsManager);
seedingService.registerSeedFunction('domain_groups', seedDomainGroupsData);

// Enhanced domain groups manager class
class EnhancedDomainGroupsManager {
  private manager: UniversalDataManager<DomainGroupsData>;

  constructor(manager: UniversalDataManager<DomainGroupsData>) {
    this.manager = manager;
  }

  loadData(): DomainGroupsData {
    console.log('🔄 Enhanced loadData called for domain groups');
    const data = this.manager.loadData();
    console.log('✅ Domain groups data loaded:', data);
    return data;
  }

  saveData(data: DomainGroupsData): void {
    console.log('💾 Enhanced saveData called for domain groups:', data);
    
    // Validate data before saving
    if (!validateDomainGroupsData(data)) {
      console.error('❌ Invalid data structure, cannot save:', data);
      throw new Error('Invalid data structure for domain groups');
    }
    
    this.manager.saveData(data);
    console.log('✅ Domain groups data saved successfully');
  }

  refreshData(): DomainGroupsData {
    console.log('🔄 Force refreshing domain groups data...');
    const data = this.manager.loadData();
    console.log('✅ Refreshed data contains:', {
      domainGroups: data.domainGroups.length,
      categories: data.categories.length,
      subCategories: data.subCategories.length
    });
    return data;
  }

  forceReseed(): DomainGroupsData {
    console.log('🌱 Force reseeding domain groups data...');
    return this.manager.forceReseed();
  }

  getDataStats(): { domainGroups: number; categories: number; subCategories: number } {
    const data = this.loadData();
    return {
      domainGroups: data.domainGroups.length,
      categories: data.categories.length,
      subCategories: data.subCategories.length
    };
  }

  getDataHealth() {
    return this.manager.getDataHealth();
  }
}

// Export singleton instance
export const domainGroupsDataManager = new EnhancedDomainGroupsManager(domainGroupsManager);
