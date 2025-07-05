
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
  return {
    // Basic Information
    userId: formData.userId.trim(),
    password: formData.password,
    organizationName: formData.organizationName.trim(),
    organizationId: formData.organizationId,
    organizationType: formData.organizationType,
    entityType: formData.entityType,
    industrySegment: formData.industrySegment,
    
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
