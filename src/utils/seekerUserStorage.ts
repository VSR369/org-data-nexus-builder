
import { FormData } from '@/types/seekerRegistration';
import { userDataManager } from './storage/UserDataManager';

// Generate unique organization ID
export function generateOrganizationId(): string {
  return `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

// Save user data with IndexedDB
export async function saveUserDataSecurely(userData: any): Promise<boolean> {
  try {
    console.log('💾 Starting secure user data save process with IndexedDB...');
    
    // Validate required fields
    const required = ['userId', 'password', 'organizationName', 'organizationType', 'entityType', 'country', 'email', 'contactPersonName'];
    for (const field of required) {
      if (!userData[field] || userData[field].toString().trim() === '') {
        console.log(`❌ Missing required field: ${field}`);
        return false;
      }
    }
    
    const success = await userDataManager.saveUser(userData);
    
    if (success) {
      console.log('✅ User data successfully saved and verified in IndexedDB');
      return true;
    } else {
      console.log('❌ Failed to save user data to IndexedDB');
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
    organizationType: formData.organizationType,
    entityType: formData.entityType,
    country: formData.country,
    email: formData.email.trim().toLowerCase(),
    contactPersonName: formData.contactPersonName.trim(),
    industrySegment: formData.industrySegment,
    organizationId: formData.organizationId,
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
