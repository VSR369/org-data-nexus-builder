// Dedicated Membership Fee Structure Fixer
// Permanently converts wrapped format to raw array format

export interface MembershipFeeEntry {
  id: string;
  country: string;
  organizationType: string;
  entityType: string;
  quarterlyAmount: number;
  quarterlyCurrency: string;
  halfYearlyAmount: number;
  halfYearlyCurrency: string;
  annualAmount: number;
  annualCurrency: string;
  createdAt: string;
  updatedAt: string;
  isUserCreated: boolean;
}

const FALLBACK_MEMBERSHIP_FEES: MembershipFeeEntry[] = [
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
];

export class MembershipFeeFixer {
  private static readonly STORAGE_KEY = 'master_data_seeker_membership_fees';
  
  /**
   * Fix membership fee data structure permanently
   */
  static fixMembershipFeeStructure(): { success: boolean; message: string; count: number } {
    console.log('🔧 === FIXING MEMBERSHIP FEE STRUCTURE ===');
    
    try {
      const rawData = localStorage.getItem(this.STORAGE_KEY);
      
      if (!rawData) {
        console.log('📦 No membership fee data found, creating with fallback');
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(FALLBACK_MEMBERSHIP_FEES));
        return { 
          success: true, 
          message: 'Created membership fees with fallback data', 
          count: FALLBACK_MEMBERSHIP_FEES.length 
        };
      }
      
      let parsed;
      try {
        parsed = JSON.parse(rawData);
      } catch (error) {
        console.error('❌ Invalid JSON, using fallback');
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(FALLBACK_MEMBERSHIP_FEES));
        return { 
          success: true, 
          message: 'Fixed invalid JSON with fallback data', 
          count: FALLBACK_MEMBERSHIP_FEES.length 
        };
      }
      
      // Check if it's already in raw format
      if (Array.isArray(parsed)) {
        console.log('✅ Already in raw format:', parsed.length, 'items');
        return { 
          success: true, 
          message: 'Already in correct raw format', 
          count: parsed.length 
        };
      }
      
      // Handle wrapped format
      if (parsed && typeof parsed === 'object' && parsed.data) {
        console.log('🔧 Converting from wrapped format...');
        
        if (Array.isArray(parsed.data)) {
          // Extract raw data
          const rawArray = parsed.data;
          
          // Validate the data structure
          const isValidStructure = rawArray.every(item => 
            item && typeof item === 'object' && 
            item.id && item.country && item.organizationType
          );
          
          if (isValidStructure) {
            // Save as raw array
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rawArray));
            
            // Clean up wrapped format artifacts
            this.cleanupWrappedFormatArtifacts();
            
            console.log('✅ Successfully converted to raw format:', rawArray.length, 'items');
            return { 
              success: true, 
              message: 'Converted from wrapped to raw format', 
              count: rawArray.length 
            };
          } else {
            console.log('⚠️ Invalid data structure in wrapped format, using fallback');
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(FALLBACK_MEMBERSHIP_FEES));
            return { 
              success: true, 
              message: 'Replaced invalid wrapped data with fallback', 
              count: FALLBACK_MEMBERSHIP_FEES.length 
            };
          }
        }
      }
      
      // Unknown format, use fallback
      console.log('❌ Unknown format, using fallback');
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(FALLBACK_MEMBERSHIP_FEES));
      return { 
        success: true, 
        message: 'Replaced unknown format with fallback data', 
        count: FALLBACK_MEMBERSHIP_FEES.length 
      };
      
    } catch (error) {
      console.error('❌ Critical error fixing membership fees:', error);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(FALLBACK_MEMBERSHIP_FEES));
      return { 
        success: true, 
        message: 'Fixed critical error with fallback data', 
        count: FALLBACK_MEMBERSHIP_FEES.length 
      };
    }
  }
  
  /**
   * Clean up any artifacts from wrapped format storage
   */
  private static cleanupWrappedFormatArtifacts(): void {
    try {
      const keysToRemove = [
        'user_created_master_data_seeker_membership_fees',
        'backup_master_data_seeker_membership_fees',
        `${this.STORAGE_KEY}_version`,
        `${this.STORAGE_KEY}_timestamp`,
        `${this.STORAGE_KEY}_metadata`
      ];
      
      keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`🧹 Cleaned up: ${key}`);
        }
      });
    } catch (error) {
      console.warn('⚠️ Error during cleanup:', error);
    }
  }
  
  /**
   * Verify the current data structure is correct
   */
  static verifyStructure(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    try {
      const rawData = localStorage.getItem(this.STORAGE_KEY);
      
      if (!rawData) {
        issues.push('No data found');
        return { isValid: false, issues };
      }
      
      const parsed = JSON.parse(rawData);
      
      if (!Array.isArray(parsed)) {
        issues.push('Data is not an array');
        return { isValid: false, issues };
      }
      
      if (parsed.length === 0) {
        issues.push('Array is empty');
        return { isValid: false, issues };
      }
      
      // Validate structure of each item
      const requiredFields = ['id', 'country', 'organizationType', 'entityType'];
      
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item || typeof item !== 'object') {
          issues.push(`Item ${i} is not an object`);
          continue;
        }
        
        for (const field of requiredFields) {
          if (!item[field]) {
            issues.push(`Item ${i} missing field: ${field}`);
          }
        }
      }
      
      const isValid = issues.length === 0;
      console.log(`🔍 Structure verification: ${isValid ? 'VALID' : 'INVALID'}`);
      if (!isValid) {
        console.log('❌ Issues found:', issues);
      }
      
      return { isValid, issues };
      
    } catch (error) {
      issues.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown'}`);
      return { isValid: false, issues };
    }
  }
  
  /**
   * Get membership fees in guaranteed raw format
   */
  static getMembershipFees(): MembershipFeeEntry[] {
    const fixResult = this.fixMembershipFeeStructure();
    
    try {
      const rawData = localStorage.getItem(this.STORAGE_KEY);
      if (rawData) {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('❌ Error getting membership fees:', error);
    }
    
    return FALLBACK_MEMBERSHIP_FEES;
  }
}

// Auto-fix on import (but only once)
if (typeof window !== 'undefined' && !(window as any).membershipFeeFixerRan) {
  (window as any).membershipFeeFixerRan = true;
  MembershipFeeFixer.fixMembershipFeeStructure();
}

export default MembershipFeeFixer;