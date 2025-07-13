// Master Data Initialization Service
// Ensures all master data is properly initialized with correct structure

import { LegacyDataManager } from '@/utils/core/DataManager';
import { industrySegmentDataManager } from '@/components/master-data/industry-segments/industrySegmentDataManager';
import { Country } from '@/types/seekerRegistration';
import { IndustrySegment } from '@/types/industrySegments';

// Fallback data for missing keys
const FALLBACK_DEPARTMENTS = [
  'Engineering',
  'Sales & Marketing', 
  'Human Resources',
  'Finance & Accounting',
  'Operations',
  'Information Technology',
  'Research & Development',
  'Customer Service',
  'Legal & Compliance',
  'Quality Assurance'
];

const FALLBACK_COMPETENCY_CAPABILITIES = [
  {
    id: 'technical-skills',
    name: 'Technical Skills',
    description: 'Programming, software development, technical expertise',
    category: 'Technical',
    level: 'Beginner to Expert'
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Planning, execution, monitoring of projects',
    category: 'Management',
    level: 'Beginner to Expert'
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Written and verbal communication skills',
    category: 'Soft Skills',
    level: 'Beginner to Expert'
  },
  {
    id: 'leadership',
    name: 'Leadership',
    description: 'Team leadership and management capabilities',
    category: 'Management',
    level: 'Beginner to Expert'
  }
];

const FALLBACK_CHALLENGE_STATUSES = [
  'Draft',
  'Published',
  'Active',
  'Paused',
  'Closed',
  'Under Review',
  'Evaluation',
  'Completed',
  'Cancelled',
  'Archived'
];

const FALLBACK_COMMUNICATION_TYPES = [
  'Email',
  'Phone Call',
  'Video Conference',
  'In-Person Meeting',
  'Instant Message',
  'SMS',
  'Document Sharing',
  'Presentation',
  'Workshop',
  'Training Session'
];

const FALLBACK_CURRENCIES = [
  { id: 'usd', code: 'USD', name: 'US Dollar', symbol: '$', isUserCreated: false },
  { id: 'eur', code: 'EUR', name: 'Euro', symbol: '€', isUserCreated: false },
  { id: 'gbp', code: 'GBP', name: 'British Pound', symbol: '£', isUserCreated: false },
  { id: 'inr', code: 'INR', name: 'Indian Rupee', symbol: '₹', isUserCreated: false },
  { id: 'cad', code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', isUserCreated: false },
  { id: 'aud', code: 'AUD', name: 'Australian Dollar', symbol: 'A$', isUserCreated: false },
  { id: 'jpy', code: 'JPY', name: 'Japanese Yen', symbol: '¥', isUserCreated: false },
  { id: 'sgd', code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', isUserCreated: false }
];

// DEPRECATED: Seeker membership fees now managed by Supabase
// Fallback data removed since we use Supabase as single source of truth

const FALLBACK_INDUSTRY_SEGMENTS = [
  { id: 'it', industrySegment: 'Information Technology', description: 'Software, Hardware, and IT services' },
  { id: 'bfsi', industrySegment: 'Banking, Financial Services and Insurance', description: 'Financial sector services' },
  { id: 'healthcare', industrySegment: 'Healthcare & Life Sciences', description: 'Medical and pharmaceutical services' },
  { id: 'manufacturing', industrySegment: 'Manufacturing', description: 'Industrial manufacturing and production' },
  { id: 'retail', industrySegment: 'Retail & E-commerce', description: 'Retail and online commerce' },
  { id: 'education', industrySegment: 'Education & Training', description: 'Educational institutions and training' }
];

const FALLBACK_REWARD_TYPES = [
  'Monetary Reward',
  'Recognition Certificate',
  'Trophy/Medal',
  'Gift Voucher',
  'Professional Development',
  'Mentorship Opportunity',
  'Networking Access',
  'Equipment/Tools',
  'Conference/Event Ticket',
  'Publication Opportunity'
];

export class MasterDataInitializationService {
  static async initializeAllMasterData(): Promise<{ fixed: string[], errors: string[] }> {
    console.log('🔧 === INITIALIZING ALL MASTER DATA ===');
    
    const results = {
      fixed: [] as string[],
      errors: [] as string[]
    };

    try {
      // Use the new unified structure fixer
      const { MasterDataStructureFixer } = await import('@/utils/masterDataStructureFixer');
      const fixResult = MasterDataStructureFixer.fixAllMasterDataStructures();
      
      // Convert the detailed results to our format
      fixResult.results.forEach(result => {
        if (result.wasFixed) {
          results.fixed.push(`${result.key}: ${result.issues.join(', ')}`);
        }
      });
      
      results.errors.push(...fixResult.errors);

      // Initialize missing keys that might not be covered by the structure fixer
      await this.initializeDepartments(results);
      await this.initializeCompetencyCapabilities(results);
      await this.initializeChallengeStatuses(results);
      await this.initializeCommunicationTypes(results);
      await this.initializeIndustrySegments(results);

      console.log('✅ Master data initialization complete', results);
      return results;

    } catch (error) {
      console.error('❌ Master data initialization failed:', error);
      results.errors.push(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return results;
    }
  }

  private static async initializeDepartments(results: { fixed: string[], errors: string[] }): Promise<void> {
    try {
      const dataManager = new LegacyDataManager<string[]>({
        key: 'master_data_departments',
        defaultData: FALLBACK_DEPARTMENTS,
        version: 1
      });

      const existing = localStorage.getItem('master_data_departments');
      if (!existing) {
        dataManager.saveData(FALLBACK_DEPARTMENTS);
        results.fixed.push('Departments: Created missing key with fallback data');
        console.log('✅ Departments initialized');
      }
    } catch (error) {
      results.errors.push(`Departments initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async initializeCompetencyCapabilities(results: { fixed: string[], errors: string[] }): Promise<void> {
    try {
      const dataManager = new LegacyDataManager<any[]>({
        key: 'master_data_competency_capabilities',
        defaultData: FALLBACK_COMPETENCY_CAPABILITIES,
        version: 1
      });

      const existing = localStorage.getItem('master_data_competency_capabilities');
      if (!existing) {
        dataManager.saveData(FALLBACK_COMPETENCY_CAPABILITIES);
        results.fixed.push('Competency Capabilities: Created missing key with fallback data');
        console.log('✅ Competency Capabilities initialized');
      }
    } catch (error) {
      results.errors.push(`Competency Capabilities initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async initializeChallengeStatuses(results: { fixed: string[], errors: string[] }): Promise<void> {
    try {
      const dataManager = new LegacyDataManager<string[]>({
        key: 'master_data_challenge_statuses',
        defaultData: FALLBACK_CHALLENGE_STATUSES,
        version: 1
      });

      const existing = localStorage.getItem('master_data_challenge_statuses');
      if (!existing) {
        dataManager.saveData(FALLBACK_CHALLENGE_STATUSES);
        results.fixed.push('Challenge Statuses: Created missing key with fallback data');
        console.log('✅ Challenge Statuses initialized');
      }
    } catch (error) {
      results.errors.push(`Challenge Statuses initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async initializeCommunicationTypes(results: { fixed: string[], errors: string[] }): Promise<void> {
    try {
      const dataManager = new LegacyDataManager<string[]>({
        key: 'master_data_communication_types',
        defaultData: FALLBACK_COMMUNICATION_TYPES,
        version: 1
      });

      const existing = localStorage.getItem('master_data_communication_types');
      if (!existing) {
        dataManager.saveData(FALLBACK_COMMUNICATION_TYPES);
        results.fixed.push('Communication Types: Created missing key with fallback data');
        console.log('✅ Communication Types initialized');
      }
    } catch (error) {
      results.errors.push(`Communication Types initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async initializeIndustrySegments(results: { fixed: string[], errors: string[] }): Promise<void> {
    try {
      const existing = localStorage.getItem('master_data_industry_segments');
      if (!existing) {
        industrySegmentDataManager.saveData({ industrySegments: FALLBACK_INDUSTRY_SEGMENTS });
        results.fixed.push('Industry Segments: Created missing key with fallback data');
        console.log('✅ Industry Segments initialized');
      }
    } catch (error) {
      results.errors.push(`Industry Segments initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async fixCurrencies(results: { fixed: string[], errors: string[] }): Promise<void> {
    try {
      const existing = localStorage.getItem('master_data_currencies');
      if (existing) {
        const parsed = JSON.parse(existing);
        
        // Check if it's in the wrong format (wrapped in data manager structure)
        if (parsed && typeof parsed === 'object' && (parsed.data || parsed.version || !Array.isArray(parsed))) {
          console.log('🔧 Fixing currencies data structure - detected wrapped format');
          // Fix the structure - store raw array instead of wrapped data
          localStorage.setItem('master_data_currencies', JSON.stringify(FALLBACK_CURRENCIES));
          results.fixed.push('Currencies: Fixed data structure (unwrapped from data manager format)');
          console.log('✅ Currencies structure fixed');
        } else if (Array.isArray(parsed)) {
          // Validate the array structure
          const validCurrencies = parsed.every(currency => 
            currency && typeof currency === 'object' && 
            currency.id && currency.code && currency.name && currency.symbol
          );
          
          if (!validCurrencies) {
            console.log('🔧 Fixing currencies data structure - invalid objects');
            localStorage.setItem('master_data_currencies', JSON.stringify(FALLBACK_CURRENCIES));
            results.fixed.push('Currencies: Fixed invalid currency objects');
            console.log('✅ Currencies validation fixed');
          }
        }
      } else {
        // Create if missing
        localStorage.setItem('master_data_currencies', JSON.stringify(FALLBACK_CURRENCIES));
        results.fixed.push('Currencies: Created missing key with fallback data');
        console.log('✅ Currencies created');
      }
      
      // Additional verification - force fix if still not correct
      const verification = localStorage.getItem('master_data_currencies');
      if (verification) {
        const verifyParsed = JSON.parse(verification);
        if (!Array.isArray(verifyParsed) || verifyParsed.length === 0) {
          console.log('🔧 Force-fixing currencies - verification failed');
          localStorage.setItem('master_data_currencies', JSON.stringify(FALLBACK_CURRENCIES));
          results.fixed.push('Currencies: Force-fixed after verification failure');
        }
      }
    } catch (error) {
      console.error('❌ Error fixing currencies:', error);
      // Emergency fallback
      try {
        localStorage.setItem('master_data_currencies', JSON.stringify(FALLBACK_CURRENCIES));
        results.fixed.push('Currencies: Emergency fallback applied');
      } catch (fallbackError) {
        results.errors.push(`Currencies fix failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * DEPRECATED: Seeker membership fees now managed by Supabase
   */
  private static async fixSeekerMembershipFees(results: { fixed: string[], errors: string[] }): Promise<void> {
    console.log('⚠️ fixSeekerMembershipFees is deprecated - using Supabase as single source of truth');
    results.fixed.push('Seeker Membership Fees: Now managed by Supabase (deprecated localStorage operations)');
  }

  private static async fixRewardTypes(results: { fixed: string[], errors: string[] }): Promise<void> {
    try {
      const existing = localStorage.getItem('master_data_reward_types');
      if (existing) {
        const parsed = JSON.parse(existing);
        
        if (Array.isArray(parsed)) {
          // Check if items are objects instead of strings
          const hasObjects = parsed.some(item => typeof item === 'object');
          if (hasObjects) {
            // Fix the structure - convert to string array
            localStorage.setItem('master_data_reward_types', JSON.stringify(FALLBACK_REWARD_TYPES));
            results.fixed.push('Reward Types: Fixed data structure (converted objects to strings)');
            console.log('✅ Reward Types structure fixed');
          }
        } else {
          // If it's not an array, replace with fallback
          localStorage.setItem('master_data_reward_types', JSON.stringify(FALLBACK_REWARD_TYPES));
          results.fixed.push('Reward Types: Fixed data structure (replaced with proper string array)');
          console.log('✅ Reward Types structure fixed');
        }
      }
    } catch (error) {
      results.errors.push(`Reward Types fix failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Quick fix for immediate issues
   */
  static async quickFix(): Promise<void> {
    console.log('⚡ Running quick master data fix...');
    await this.initializeAllMasterData();
  }
}

// Export convenience functions
export const initializeAllMasterData = () => MasterDataInitializationService.initializeAllMasterData();
export const quickFixMasterData = () => MasterDataInitializationService.quickFix();