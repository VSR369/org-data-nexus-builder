
import { FormData } from '@/types/seekerRegistration';
import { userDataManager } from './storage/UserDataManager';

// Generate unique organization ID
export function generateOrganizationId(): string {
  return `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

import { BulletproofRegistrationService } from '@/services/BulletproofRegistrationService';

// Initialize bulletproof registration service
const bulletproofService = new BulletproofRegistrationService();

// Bulletproof user data save with comprehensive validation and multiple storage redundancy
export async function saveUserDataSecurely(userData: any): Promise<boolean> {
  try {
    console.log('🛡️ Starting bulletproof user data save process...');
    
    const result = await bulletproofService.registerUser(userData);
    
    if (result.success) {
      console.log('✅ Bulletproof registration completed successfully');
      return true;
    } else {
      console.error('❌ Bulletproof registration failed:', result.error);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error during bulletproof user data save:', error);
    return false;
  }
}

export function prepareRegistrationData(formData: FormData) {
  // Helper function to get industry segment name instead of ID
  const getIndustrySegmentName = (industrySegmentId: string) => {
    if (!industrySegmentId) return '';
    
    // If it's already a name (not numeric), return as is
    if (isNaN(Number(industrySegmentId))) {
      return industrySegmentId;
    }
    
    // Look up the industry segment name from master data
    try {
      const masterDataKey = 'master_data_industry_segments';
      const savedData = localStorage.getItem(masterDataKey);
      if (savedData) {
        const industryData = JSON.parse(savedData);
        const segments = industryData.industrySegments || industryData;
        
        if (Array.isArray(segments)) {
          const foundSegment = segments.find((segment: any) => 
            segment.id === industrySegmentId
          );
          
          if (foundSegment) {
            console.log('✅ Found industry segment name:', foundSegment.industrySegment);
            return foundSegment.industrySegment;
          }
        }
      }
    } catch (error) {
      console.error('❌ Error looking up industry segment:', error);
    }
    
    return industrySegmentId; // Fallback to ID if lookup fails
  };

  const resolvedIndustrySegment = getIndustrySegmentName(formData.industrySegment);
  console.log('🏭 Industry segment resolution:', {
    original: formData.industrySegment,
    resolved: resolvedIndustrySegment
  });

  return {
    // Basic Information
    userId: formData.userId.trim(),
    password: formData.password,
    organizationName: formData.organizationName.trim(),
    organizationId: formData.organizationId,
    organizationType: formData.organizationType,
    entityType: formData.entityType,
    industrySegment: resolvedIndustrySegment, // Store the actual name, not ID
    
    // Contact Details
    contactPersonName: formData.contactPersonName.trim(),
    email: formData.email.trim().toLowerCase(),
    countryCode: formData.countryCode,
    phoneNumber: formData.phoneNumber,
    
    // Location
    country: formData.country,
    address: formData.address,
    
    // Web Presence
    website: formData.website,
    
    // Documents (converted to metadata for storage)
    registrationDocuments: formData.registrationDocuments || [],
    companyProfile: formData.companyProfile || [],
    companyLogo: formData.companyLogo || [],
    
    // Timestamp
    registrationTimestamp: new Date().toISOString()
  };
}

// Legacy compatibility
export function saveUserDataSecurelySync(userData: any): boolean {
  console.warn('⚠️ Using deprecated sync save method. Use async version instead.');
  saveUserDataSecurely(userData).catch(error => {
    console.error('❌ Background save failed:', error);
  });
  return true; // Optimistic return for compatibility
}
