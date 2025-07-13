
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

  async loadData(): Promise<DomainGroupsData> {
    console.log('🔄 Enhanced loadData called for domain groups from Supabase');
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Load domain groups from Supabase
      const { data: domainGroups, error: dgError } = await supabase
        .from('master_domain_groups')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (dgError) throw dgError;

      // Load categories from Supabase
      const { data: categories, error: catError } = await supabase
        .from('master_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (catError) throw catError;

      // Load sub-categories from Supabase
      const { data: subCategories, error: subCatError } = await supabase
        .from('master_sub_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (subCatError) throw subCatError;

      const supabaseData: DomainGroupsData = {
        domainGroups: domainGroups || [],
        categories: categories || [],
        subCategories: subCategories || []
      };

      console.log('✅ CRUD TEST - Domain Groups loaded from Supabase:', {
        domainGroups: supabaseData.domainGroups.length,
        categories: supabaseData.categories.length,
        subCategories: supabaseData.subCategories.length
      });

      return supabaseData;
    } catch (error) {
      console.error('❌ Error loading domain groups data from Supabase:', error);
      console.log('🔄 Attempting to recover with sample data...');
      return sampleDomainGroupsData;
    }
  }

  async saveData(data: DomainGroupsData): Promise<boolean> {
    console.log('💾 Enhanced saveData called for domain groups to Supabase:', {
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
      
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Save domain groups
      for (const dg of data.domainGroups) {
        const { error } = await supabase
          .from('master_domain_groups')
          .upsert({
            id: dg.id,
            name: dg.name,
            description: dg.description,
            industry_segment_id: dg.industry_segment_id,
            is_active: dg.is_active,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }

      // Save categories
      for (const cat of data.categories) {
        const { error } = await supabase
          .from('master_categories')
          .upsert({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            domain_group_id: cat.domain_group_id,
            is_active: cat.is_active,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }

      // Save sub-categories
      for (const subCat of data.subCategories) {
        const { error } = await supabase
          .from('master_sub_categories')
          .upsert({
            id: subCat.id,
            name: subCat.name,
            description: subCat.description,
            category_id: subCat.category_id,
            is_active: subCat.is_active,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }

      console.log('✅ CRUD TEST - Domain Groups saved to Supabase successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving domain groups data to Supabase:', error);
      return false;
    }
  }

  async refreshData(): Promise<DomainGroupsData> {
    console.log('🔄 Force refreshing domain groups data from Supabase...');
    try {
      const data = await this.loadData();
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

  async getDataStats(): Promise<{ domainGroups: number; categories: number; subCategories: number }> {
    const data = await this.loadData();
    return {
      domainGroups: data.domainGroups.length,
      categories: data.categories.length,
      subCategories: data.subCategories.length
    };
  }

  getDataHealth() {
    return this.manager.getDataHealth();
  }

  async exportData(): Promise<string> {
    const data = await this.loadData();
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      return await this.saveData(data);
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const domainGroupsDataManager = new EnhancedDomainGroupsManager(domainGroupsManager);
