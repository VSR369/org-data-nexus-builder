
import { DataManager, GlobalCacheManager } from './dataManager';

const defaultSegments = [
  'Banking, Financial Services & Insurance (BFSI)',
  'Retail & E-Commerce',
  'Healthcare & Life Sciences',
  'Information Technology & Software Services',
  'Telecommunications',
  'Education & EdTech',
  'Manufacturing (Smart / Discrete / Process)',
  'Logistics & Supply Chain',
  'Media, Entertainment & OTT',
  'Energy & Utilities (Power, Oil & Gas, Renewables)',
  'Automotive & Mobility',
  'Real Estate & Smart Infrastructure',
  'Travel, Tourism & Hospitality',
  'Agriculture & AgriTech',
  'Public Sector & e-Governance'
];

const defaultOrganizationTypes = [
  'Corporation',
  'LLC',
  'Partnership',
  'Sole Proprietorship',
  'Non-Profit',
  'Government Agency',
  'Educational Institution',
  'Startup',
  'Small Business',
  'Enterprise'
];

const defaultEntityTypes = [
  'Individual',
  'Business Entity',
  'Government',
  'Non-Profit Organization',
  'Educational Institution',
  'Healthcare Provider',
  'Financial Institution',
  'Technology Company',
  'Consulting Firm',
  'Research Organization'
];

const defaultCountries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'Australia',
  'India',
  'China',
  'Brazil',
  'Mexico',
  'Netherlands',
  'Sweden',
  'Switzerland',
  'Singapore'
];

const defaultCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' }
];

const defaultDepartments = [
  'Engineering',
  'Product Management',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support',
  'Research & Development',
  'Quality Assurance',
  'Business Development',
  'Legal',
  'IT & Technology',
  'Data Analytics',
  'Design & UX'
];

const defaultChallengeStatuses = [
  { name: 'Draft', color: 'bg-gray-100 text-gray-800 border-gray-300', description: 'Challenge is being prepared' },
  { name: 'Published', color: 'bg-green-100 text-green-800 border-green-300', description: 'Challenge is live and accepting solutions' },
  { name: 'In Review', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', description: 'Solutions are being evaluated' },
  { name: 'Completed', color: 'bg-blue-100 text-blue-800 border-blue-300', description: 'Challenge has been completed' },
  { name: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-300', description: 'Challenge has been cancelled' },
  { name: 'On Hold', color: 'bg-orange-100 text-orange-800 border-orange-300', description: 'Challenge is temporarily paused' }
];

const defaultSolutionStatuses = [
  { name: 'Submitted', color: 'bg-blue-100 text-blue-800 border-blue-300', description: 'Solution has been submitted' },
  { name: 'Under Review', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', description: 'Solution is being reviewed' },
  { name: 'Shortlisted', color: 'bg-purple-100 text-purple-800 border-purple-300', description: 'Solution has been shortlisted' },
  { name: 'Accepted', color: 'bg-green-100 text-green-800 border-green-300', description: 'Solution has been accepted' },
  { name: 'Rejected', color: 'bg-red-100 text-red-800 border-red-300', description: 'Solution has been rejected' },
  { name: 'Withdrawn', color: 'bg-gray-100 text-gray-800 border-gray-300', description: 'Solution has been withdrawn' }
];

const defaultRewardTypes = [
  { name: 'Cash Prize', icon: 'DollarSign', description: 'Monetary reward for winning solutions' },
  { name: 'Recognition Award', icon: 'Award', description: 'Public recognition and certificates' },
  { name: 'Mentorship', icon: 'Users', description: 'Access to expert mentorship programs' },
  { name: 'Incubation', icon: 'Rocket', description: 'Business incubation support' },
  { name: 'Partnership', icon: 'Handshake', description: 'Strategic partnership opportunities' },
  { name: 'Internship', icon: 'Briefcase', description: 'Internship opportunities' }
];

const defaultCommunicationTypes = [
  { name: 'Email', description: 'Email communications and newsletters' },
  { name: 'SMS', description: 'Text message notifications' },
  { name: 'Push Notification', description: 'Mobile app push notifications' },
  { name: 'In-App Message', description: 'Messages within the application' },
  { name: 'Newsletter', description: 'Regular newsletter subscriptions' },
  { name: 'Marketing', description: 'Marketing and promotional content' }
];

// Shared DataManager instances for all master data
export const industrySegmentsDataManager = new DataManager<string[]>({
  key: 'master_data_industry_segments',
  defaultData: defaultSegments,
  version: 1
});

export const organizationTypesDataManager = new DataManager<string[]>({
  key: 'master_data_organization_types',
  defaultData: defaultOrganizationTypes,
  version: 1
});

export const entityTypesDataManager = new DataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: defaultEntityTypes,
  version: 1
});

export const countriesDataManager = new DataManager<string[]>({
  key: 'master_data_countries',
  defaultData: defaultCountries,
  version: 1
});

export const currenciesDataManager = new DataManager<typeof defaultCurrencies>({
  key: 'master_data_currencies',
  defaultData: defaultCurrencies,
  version: 1
});

export const departmentsDataManager = new DataManager<string[]>({
  key: 'master_data_departments',
  defaultData: defaultDepartments,
  version: 1
});

export const challengeStatusesDataManager = new DataManager<typeof defaultChallengeStatuses>({
  key: 'master_data_challenge_statuses',
  defaultData: defaultChallengeStatuses,
  version: 1
});

export const solutionStatusesDataManager = new DataManager<typeof defaultSolutionStatuses>({
  key: 'master_data_solution_statuses',
  defaultData: defaultSolutionStatuses,
  version: 1
});

export const rewardTypesDataManager = new DataManager<typeof defaultRewardTypes>({
  key: 'master_data_reward_types',
  defaultData: defaultRewardTypes,
  version: 1
});

export const communicationTypesDataManager = new DataManager<typeof defaultCommunicationTypes>({
  key: 'master_data_communication_types',
  defaultData: defaultCommunicationTypes,
  version: 1
});

// Register all keys with global cache manager
GlobalCacheManager.registerKey('master_data_industry_segments');
GlobalCacheManager.registerKey('master_data_organization_types');
GlobalCacheManager.registerKey('master_data_entity_types');
GlobalCacheManager.registerKey('master_data_countries');
GlobalCacheManager.registerKey('master_data_currencies');
GlobalCacheManager.registerKey('master_data_departments');
GlobalCacheManager.registerKey('master_data_challenge_statuses');
GlobalCacheManager.registerKey('master_data_solution_statuses');
GlobalCacheManager.registerKey('master_data_reward_types');
GlobalCacheManager.registerKey('master_data_communication_types');

// Migration functions to move data from old keys to new keys
export const migrateAllMasterData = () => {
  console.log('🔄 Starting comprehensive master data migration...');
  
  // Migration mappings: old key -> new DataManager
  const migrations = [
    { oldKey: 'industrySegments', manager: industrySegmentsDataManager, name: 'Industry Segments' },
    { oldKey: 'organizationTypes', manager: organizationTypesDataManager, name: 'Organization Types' },
    { oldKey: 'entityTypes', manager: entityTypesDataManager, name: 'Entity Types' },
    { oldKey: 'countries', manager: countriesDataManager, name: 'Countries' },
    { oldKey: 'currencies', manager: currenciesDataManager, name: 'Currencies' },
    { oldKey: 'departments', manager: departmentsDataManager, name: 'Departments' },
    { oldKey: 'challengeStatuses', manager: challengeStatusesDataManager, name: 'Challenge Statuses' },
    { oldKey: 'solutionStatuses', manager: solutionStatusesDataManager, name: 'Solution Statuses' },
    { oldKey: 'rewardTypes', manager: rewardTypesDataManager, name: 'Reward Types' },
    { oldKey: 'communicationTypes', manager: communicationTypesDataManager, name: 'Communication Types' }
  ];
  
  migrations.forEach(({ oldKey, manager, name }) => {
    const oldData = localStorage.getItem(oldKey);
    const newKeyExists = localStorage.getItem(manager.config.key);
    const newKeyInitialized = localStorage.getItem(`${manager.config.key}_initialized`);
    
    if (oldData && !newKeyExists && !newKeyInitialized) {
      console.log(`📦 Migrating ${name} from ${oldKey}...`);
      try {
        const parsedOldData = JSON.parse(oldData);
        if (Array.isArray(parsedOldData) && parsedOldData.length > 0) {
          console.log(`✅ Migrating ${name}:`, parsedOldData);
          manager.saveData(parsedOldData);
        }
      } catch (error) {
        console.error(`❌ Error migrating ${name}:`, error);
      }
    }
    
    // Clean up old keys
    if (oldData) {
      console.log(`🗑️ Cleaning up old ${oldKey} key`);
      localStorage.removeItem(oldKey);
    }
  });
  
  console.log('✅ Master data migration complete');
};

// Initialize migration on import
migrateAllMasterData();
