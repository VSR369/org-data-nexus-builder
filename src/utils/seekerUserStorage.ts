
import { FormData } from '@/types/seekerRegistration';
import { userDataManager } from './storage/UserDataManager';

// Generate unique organization ID
export function generateOrganizationId(): string {
  return `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

// Save user data with IndexedDB and localStorage fallback
export async function saveUserDataSecurely(userData: any): Promise<boolean> {
  try {
    console.log('💾 Starting secure user data save process...');
    
    // Validate required fields
    const required = ['userId', 'password', 'organizationName', 'organizationType', 'entityType', 'country', 'email', 'contactPersonName'];
    for (const field of required) {
      if (!userData[field] || userData[field].toString().trim() === '') {
        console.log(`❌ Missing required field: ${field}`);
        return false;
      }
    }
    
    // Save to IndexedDB first
    const indexedDBSuccess = await userDataManager.saveUser(userData);
    
    if (indexedDBSuccess) {
      console.log('✅ User data successfully saved to IndexedDB');
      
      // Also save to localStorage as fallback
      try {
        const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const userExists = existingUsers.find((u: any) => 
          u.userId.toLowerCase() === userData.userId.toLowerCase()
        );
        
        if (!userExists) {
          existingUsers.push(userData);
          localStorage.setItem('registered_users', JSON.stringify(existingUsers));
          console.log('✅ User data also saved to localStorage');
        }
      } catch (localStorageError) {
        console.warn('⚠️ Failed to save to localStorage, but IndexedDB save succeeded:', localStorageError);
      }
      
      return true;
    } else {
      console.log('❌ Failed to save user data to IndexedDB');
      
      // Fallback: try localStorage only
      try {
        const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const userExists = existingUsers.find((u: any) => 
          u.userId.toLowerCase() === userData.userId.toLowerCase()
        );
        
        if (!userExists) {
          existingUsers.push(userData);
          localStorage.setItem('registered_users', JSON.stringify(existingUsers));
          console.log('✅ Fallback: User data saved to localStorage only');
          return true;
        }
      } catch (localStorageError) {
        console.error('❌ Both IndexedDB and localStorage saves failed:', localStorageError);
      }
      
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
