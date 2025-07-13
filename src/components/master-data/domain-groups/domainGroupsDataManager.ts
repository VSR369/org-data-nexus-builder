
import { DomainGroupsData } from '@/types/domainGroups';
import { UniversalDataManager } from '@/utils/core/UniversalDataManager';
import { seedingService } from '@/utils/core/UniversalSeedingService';

// Sample data with realistic domain groups for different industry segments
const sampleDomainGroupsData: DomainGroupsData = {
  domainGroups: [
    {
      id: 'sample-dg-1',
      name: 'Digital Banking & Fintech',
      description: 'Digital transformation in banking and financial technology',
      industry_segment_id: 'bfsi',
      industrySegmentName: 'Banking, Financial Services & Insurance (BFSI)',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sample-dg-2',
      name: 'E-commerce & Digital Retail',
      description: 'Online retail platforms and digital commerce solutions',
      industry_segment_id: 'retail',
      industrySegmentName: 'Retail & E-Commerce',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  categories: [
    {
      id: 'sample-cat-1',
      name: 'Mobile Banking',
      description: 'Mobile banking applications and services',
      domain_group_id: 'sample-dg-1',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sample-cat-2',
      name: 'Online Store Development',
      description: 'Building and maintaining e-commerce platforms',
      domain_group_id: 'sample-dg-2',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  subCategories: [
    {
      id: 'sample-sub-1',
      name: 'Account Management',
      description: 'Mobile banking account management features',
      category_id: 'sample-cat-1',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sample-sub-2',
      name: 'Payment Processing',
      description: 'Mobile payment integration and processing',
      category_id: 'sample-cat-1',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sample-sub-3',
      name: 'Shopping Cart',
      description: 'E-commerce shopping cart functionality',
      category_id: 'sample-cat-2',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

// Default empty data structure
const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

// Enhanced validation function
const validateDomainGroupsData = (data: any): boolean => {
  console.log(`🔍 Validating domain groups data structure:`, data);
  
  if (!data || typeof data !== 'object') {
    console.log('❌ Data is not an object');
    return false;
  }
  
  if (!Array.isArray(data.domainGroups) || !Array.isArray(data.categories) || !Array.isArray(data.subCategories)) {
    console.log('❌ Missing required arrays');
    return false;
  }
  
  // Additional validation for data integrity
  for (const dg of data.domainGroups) {
    if (!dg.id || !dg.name || !dg.industry_segment_id) {
      console.log('❌ Invalid domain group:', dg);
      return false;
    }
  }
  
  console.log(`✅ Validation successful - Found ${data.domainGroups.length} domain groups`);
  return true;
};

// Enhanced seeding function that provides sample data
const seedDomainGroupsData = (): DomainGroupsData => {
  console.log('🌱 Seeding domain groups with sample data');
  return sampleDomainGroupsData;
};

// Create universal data manager instance with enhanced configuration
const domainGroupsManager = new UniversalDataManager<DomainGroupsData>({
  key: 'master_data_domain_groups',
  defaultData: sampleDomainGroupsData, // Use sample data as default
  version: 5, // Increment version to trigger re-seeding
  seedFunction: seedDomainGroupsData,
  validationFunction: validateDomainGroupsData
});

// Register with seeding service
seedingService.registerManager('domain_groups', domainGroupsManager);
seedingService.registerSeedFunction('domain_groups', seedDomainGroupsData);

// Enhanced domain groups manager class with better error handling
class EnhancedDomainGroupsManager {
  private manager: UniversalDataManager<DomainGroupsData>;

  constructor(manager: UniversalDataManager<DomainGroupsData>) {
    this.manager = manager;
  }

  loadData(): DomainGroupsData {
    console.log('🔄 Enhanced loadData called for domain groups');
    try {
      const data = this.manager.loadData();
      console.log('✅ Domain groups data loaded successfully:', {
        domainGroups: data.domainGroups.length,
        categories: data.categories.length,
        subCategories: data.subCategories.length
      });
      return data;
    } catch (error) {
      console.error('❌ Error loading domain groups data:', error);
      console.log('🔄 Attempting to recover with sample data...');
      return sampleDomainGroupsData;
    }
  }

  saveData(data: DomainGroupsData): boolean {
    console.log('💾 Enhanced saveData called for domain groups:', {
      domainGroups: data.domainGroups.length,
      categories: data.categories.length,
      subCategories: data.subCategories.length
    });
    
    try {
      // Validate data before saving
      if (!validateDomainGroupsData(data)) {
        console.error('❌ Invalid data structure, cannot save');
        throw new Error('Invalid data structure for domain groups');
      }
      
      this.manager.saveData(data);
      
      // Verify the save was successful
      const verificationData = this.manager.loadData();
      const saveSuccess = verificationData.domainGroups.length === data.domainGroups.length;
      
      if (saveSuccess) {
        console.log('✅ Domain groups data saved and verified successfully');
        return true;
      } else {
        console.error('❌ Save verification failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving domain groups data:', error);
      return false;
    }
  }

  refreshData(): DomainGroupsData {
    console.log('🔄 Force refreshing domain groups data...');
    try {
      const data = this.manager.loadData();
      console.log('✅ Refreshed data contains:', {
        domainGroups: data.domainGroups.length,
        categories: data.categories.length,
        subCategories: data.subCategories.length
      });
      return data;
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      return this.forceReseed();
    }
  }

  forceReseed(): DomainGroupsData {
    console.log('🌱 Force reseeding domain groups data...');
    try {
      const data = this.manager.forceReseed();
      console.log('✅ Force reseed completed with sample data');
      return data;
    } catch (error) {
      console.error('❌ Error during force reseed:', error);
      return sampleDomainGroupsData;
    }
  }

  clearAllData(): void {
    console.log('🗑️ Clearing all domain groups data...');
    this.manager.clearAllData();
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

  exportData(): string {
    const data = this.loadData();
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      return this.saveData(data);
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const domainGroupsDataManager = new EnhancedDomainGroupsManager(domainGroupsManager);
