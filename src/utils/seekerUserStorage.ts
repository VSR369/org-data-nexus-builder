
import { FormData } from '@/types/seekerRegistration';
import { sessionStorageManager } from './storage/SessionStorageManager';

// Generate unique organization ID
export function generateOrganizationId(): string {
  return `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

// Save user data with robust storage management
export function saveUserDataSecurely(userData: any): boolean {
  try {
    console.log('💾 Starting secure user data save process...');
    
    // Validate required fields
    const required = ['userId', 'password', 'organizationName', 'entityType', 'country', 'email', 'contactPersonName'];
    for (const field of required) {
      if (!userData[field] || userData[field].toString().trim() === '') {
        console.log(`❌ Missing required field: ${field}`);
        return false;
      }
    }
    
    const success = sessionStorageManager.saveUser(userData);
    
    if (success) {
      console.log('✅ User data successfully saved and verified');
      return true;
    } else {
      console.log('❌ Failed to save user data');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error during secure user data save:', error);
    return false;
  }
}

export function prepareRegistrationData(formData: FormData) {
  return {
    userId: formData.userId.trim(),
    password: formData.password,
    organizationName: formData.organizationName.trim(),
    entityType: formData.entityType,
    country: formData.country,
    email: formData.email.trim().toLowerCase(),
    contactPersonName: formData.contactPersonName.trim(),
    industrySegment: formData.industrySegment,
    organizationId: formData.organizationId,
    registrationTimestamp: new Date().toISOString()
  };
}
