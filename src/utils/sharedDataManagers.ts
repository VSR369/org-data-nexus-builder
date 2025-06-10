
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

// Shared DataManager instance for industry segments
export const industrySegmentsDataManager = new DataManager<string[]>({
  key: 'master_data_industry_segments',
  defaultData: defaultSegments,
  version: 1
});

// Register with global cache manager
GlobalCacheManager.registerKey('master_data_industry_segments');

// One-time migration function to move data from old key to new key
export const migrateIndustrySegmentsData = () => {
  console.log('🔄 Checking for industry segments data migration...');
  
  // Check if we have data in the old key but not in the new key
  const oldData = localStorage.getItem('industrySegments');
  const newKeyExists = localStorage.getItem('master_data_industry_segments');
  const newKeyInitialized = localStorage.getItem('master_data_industry_segments_initialized');
  
  if (oldData && !newKeyExists && !newKeyInitialized) {
    console.log('📦 Found old industry segments data, migrating...');
    try {
      const parsedOldData = JSON.parse(oldData);
      if (Array.isArray(parsedOldData) && parsedOldData.length > 0) {
        console.log('✅ Migrating data from old key to new key:', parsedOldData);
        industrySegmentsDataManager.saveData(parsedOldData);
      }
    } catch (error) {
      console.error('❌ Error during migration:', error);
    }
  }
  
  // Clean up old keys
  if (oldData) {
    console.log('🗑️ Cleaning up old industrySegments key');
    localStorage.removeItem('industrySegments');
  }
  
  console.log('✅ Migration check complete');
};

// Initialize migration on import
migrateIndustrySegmentsData();
