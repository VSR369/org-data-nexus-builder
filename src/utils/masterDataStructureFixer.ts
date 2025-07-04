// Master Data Structure Fixer - Unified solution for data structure conflicts
// Handles both data manager wrapper formats and ensures consistent raw array storage

import { MasterDataPersistenceManager } from '@/utils/masterDataPersistenceManager';

export interface DataStructureFixResult {
  key: string;
  wasFixed: boolean;
  originalFormat: 'raw' | 'wrapped' | 'missing' | 'invalid';
  newFormat: 'raw';
  itemCount: number;
  issues: string[];
}

export interface ComprehensiveFixResult {
  totalKeysChecked: number;
  totalKeysFixed: number;
  results: DataStructureFixResult[];
  errors: string[];
}

// Fallback data for critical keys
const FALLBACK_DATA = {
  'master_data_currencies': [
    { id: 'usd', code: 'USD', name: 'US Dollar', symbol: '$', isUserCreated: false },
    { id: 'eur', code: 'EUR', name: 'Euro', symbol: '€', isUserCreated: false },
    { id: 'gbp', code: 'GBP', name: 'British Pound', symbol: '£', isUserCreated: false },
    { id: 'inr', code: 'INR', name: 'Indian Rupee', symbol: '₹', isUserCreated: false },
    { id: 'cad', code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', isUserCreated: false },
    { id: 'aud', code: 'AUD', name: 'Australian Dollar', symbol: 'A$', isUserCreated: false },
    { id: 'jpy', code: 'JPY', name: 'Japanese Yen', symbol: '¥', isUserCreated: false },
    { id: 'sgd', code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', isUserCreated: false }
  ],
  'master_data_seeker_membership_fees': [
    {
      id: 'basic-startup',
      country: 'Global',
      organizationType: 'Start-up',
      entityType: 'Commercial',
      quarterlyAmount: 99,
      quarterlyCurrency: 'USD',
      halfYearlyAmount: 189,
      halfYearlyCurrency: 'USD',
      annualAmount: 359,
      annualCurrency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isUserCreated: false
    },
    {
      id: 'standard-enterprise',
      country: 'Global',
      organizationType: 'Large Enterprise',
      entityType: 'Commercial',
      quarterlyAmount: 299,
      quarterlyCurrency: 'USD',
      halfYearlyAmount: 569,
      halfYearlyCurrency: 'USD',
      annualAmount: 1079,
      annualCurrency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isUserCreated: false
    }
  ]
};

export class MasterDataStructureFixer {
  
  /**
   * Fix a single master data key by converting wrapped format to raw array
   */
  static fixSingleKey(key: string, fallbackData?: any[]): DataStructureFixResult {
    console.log(`🔧 Fixing master data structure for: ${key}`);
    
    const result: DataStructureFixResult = {
      key,
      wasFixed: false,
      originalFormat: 'missing',
      newFormat: 'raw',
      itemCount: 0,
      issues: []
    };

    try {
      const existing = localStorage.getItem(key);
      
      if (!existing) {
        result.originalFormat = 'missing';
        result.issues.push('Key does not exist');
        
        // Use fallback data if available
        const fallback = fallbackData || FALLBACK_DATA[key as keyof typeof FALLBACK_DATA];
        if (fallback) {
          localStorage.setItem(key, JSON.stringify(fallback));
          result.wasFixed = true;
          result.itemCount = fallback.length;
          result.issues.push('Created with fallback data');
          console.log(`✅ Created missing key ${key} with fallback data`);
        }
        return result;
      }

      let parsed;
      try {
        parsed = JSON.parse(existing);
      } catch (parseError) {
        result.originalFormat = 'invalid';
        result.issues.push('Invalid JSON format');
        
        // Use fallback for invalid data
        const fallback = fallbackData || FALLBACK_DATA[key as keyof typeof FALLBACK_DATA];
        if (fallback) {
          localStorage.setItem(key, JSON.stringify(fallback));
          result.wasFixed = true;
          result.itemCount = fallback.length;
          result.issues.push('Replaced invalid JSON with fallback data');
          console.log(`✅ Fixed invalid JSON for ${key}`);
        }
        return result;
      }

      // Check if data is already in raw format
      if (Array.isArray(parsed)) {
        result.originalFormat = 'raw';
        result.itemCount = parsed.length;
        
        // Validate array contents
        const isValidArray = parsed.every(item => 
          typeof item === 'object' && item !== null
        );
        
        if (!isValidArray) {
          result.issues.push('Array contains invalid items');
          const fallback = fallbackData || FALLBACK_DATA[key as keyof typeof FALLBACK_DATA];
          if (fallback) {
            localStorage.setItem(key, JSON.stringify(fallback));
            result.wasFixed = true;
            result.itemCount = fallback.length;
            result.issues.push('Replaced invalid array with fallback data');
            console.log(`✅ Fixed invalid array for ${key}`);
          }
        } else {
          console.log(`✅ Key ${key} already in correct raw format`);
        }
        return result;
      }

      // Check if data is in wrapped format
      if (parsed && typeof parsed === 'object' && (parsed.data || parsed.version)) {
        result.originalFormat = 'wrapped';
        console.log(`🔧 Detected wrapped format for ${key}:`, parsed);
        
        // Extract the raw data
        let rawData = parsed.data;
        
        // Validate extracted data
        if (!rawData || !Array.isArray(rawData)) {
          result.issues.push('Wrapped data is not a valid array');
          const fallback = fallbackData || FALLBACK_DATA[key as keyof typeof FALLBACK_DATA];
          if (fallback) {
            rawData = fallback;
            result.issues.push('Used fallback data instead of invalid wrapped data');
          } else {
            result.issues.push('No fallback data available');
            return result;
          }
        }
        
        // Store as raw array
        localStorage.setItem(key, JSON.stringify(rawData));
        result.wasFixed = true;
        result.itemCount = rawData.length;
        result.issues.push('Unwrapped from data manager format');
        console.log(`✅ Unwrapped ${key} from data manager format`);
        
        // Clean up any user data flags (since we're moving to raw storage)
        try {
          localStorage.removeItem(`user_created_${key}`);
          localStorage.removeItem(`backup_${key}`);
        } catch (cleanupError) {
          console.log(`⚠️ Could not clean up metadata for ${key}`);
        }
        
        return result;
      }

      // Handle other object formats
      result.originalFormat = 'invalid';
      result.issues.push('Unrecognized data format');
      const fallback = fallbackData || FALLBACK_DATA[key as keyof typeof FALLBACK_DATA];
      if (fallback) {
        localStorage.setItem(key, JSON.stringify(fallback));
        result.wasFixed = true;
        result.itemCount = fallback.length;
        result.issues.push('Replaced unrecognized format with fallback data');
        console.log(`✅ Fixed unrecognized format for ${key}`);
      }

    } catch (error) {
      result.issues.push(`Error during fix: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(`❌ Error fixing ${key}:`, error);
    }

    return result;
  }

  /**
   * Fix all problematic master data keys
   */
  static fixAllMasterDataStructures(): ComprehensiveFixResult {
    console.log('🔧 === COMPREHENSIVE MASTER DATA STRUCTURE FIX ===');
    
    const keysToFix = [
      'master_data_currencies',
      'master_data_seeker_membership_fees',
      'master_data_countries',
      'master_data_organization_types',
      'master_data_entity_types',
      'master_data_departments',
      'master_data_industry_segments',
      'master_data_domain_groups',
      'master_data_competency_capabilities',
      'master_data_engagement_models',
      'master_data_pricing_configs',
      'master_data_challenge_statuses',
      'master_data_solution_statuses',
      'master_data_reward_types',
      'master_data_communication_types'
    ];

    const results: DataStructureFixResult[] = [];
    const errors: string[] = [];
    let totalFixed = 0;

    for (const key of keysToFix) {
      try {
        const result = this.fixSingleKey(key);
        results.push(result);
        
        if (result.wasFixed) {
          totalFixed++;
        }
        
        if (result.issues.length > 0) {
          console.log(`📋 ${key} issues:`, result.issues);
        }
      } catch (error) {
        const errorMessage = `Failed to fix ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMessage);
        console.error(`❌ ${errorMessage}`);
      }
    }

    const comprehensiveResult: ComprehensiveFixResult = {
      totalKeysChecked: keysToFix.length,
      totalKeysFixed: totalFixed,
      results,
      errors
    };

    console.log('🎯 === COMPREHENSIVE FIX COMPLETE ===');
    console.log(`✅ Fixed ${totalFixed}/${keysToFix.length} keys`);
    console.log(`❌ Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('❌ Errors encountered:', errors);
    }

    return comprehensiveResult;
  }

  /**
   * Verify that all master data is in correct raw format
   */
  static verifyDataStructures(): { isValid: boolean; issues: string[] } {
    console.log('🔍 Verifying master data structures...');
    
    const issues: string[] = [];
    const keysToCheck = Object.keys(FALLBACK_DATA);

    for (const key of keysToCheck) {
      try {
        const rawValue = localStorage.getItem(key);
        if (!rawValue) {
          issues.push(`${key}: Missing from localStorage`);
          continue;
        }

        const parsed = JSON.parse(rawValue);
        if (!Array.isArray(parsed)) {
          issues.push(`${key}: Not in raw array format (${typeof parsed})`);
          continue;
        }

        if (parsed.length === 0) {
          issues.push(`${key}: Empty array`);
          continue;
        }

        // Check if it's wrapped data (this shouldn't happen after fix)
        if (parsed[0] && typeof parsed[0] === 'object' && parsed[0].data && parsed[0].version) {
          issues.push(`${key}: Still in wrapped format!`);
        }

      } catch (error) {
        issues.push(`${key}: JSON parse error`);
      }
    }

    const isValid = issues.length === 0;
    console.log(`🔍 Verification result: ${isValid ? 'VALID' : 'INVALID'}`);
    if (!isValid) {
      console.log('❌ Issues found:', issues);
    }

    return { isValid, issues };
  }

  /**
   * Emergency fix - run all fixes and verification
   */
  static emergencyFix(): void {
    console.log('🚨 === EMERGENCY MASTER DATA FIX ===');
    
    // Step 1: Run comprehensive fix
    const fixResult = this.fixAllMasterDataStructures();
    
    // Step 2: Verify results
    const verificationResult = this.verifyDataStructures();
    
    // Step 3: Report results
    console.log('🚨 === EMERGENCY FIX COMPLETE ===');
    console.log(`Fixed: ${fixResult.totalKeysFixed}/${fixResult.totalKeysChecked} keys`);
    console.log(`Verification: ${verificationResult.isValid ? 'PASSED' : 'FAILED'}`);
    
    if (!verificationResult.isValid) {
      console.error('❌ Emergency fix verification failed:', verificationResult.issues);
    } else {
      console.log('✅ All master data structures are now correct!');
    }
  }
}

// Auto-run emergency fix when this module is imported
MasterDataStructureFixer.emergencyFix();

export default MasterDataStructureFixer;