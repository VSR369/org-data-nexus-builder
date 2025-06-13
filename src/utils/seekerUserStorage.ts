
import { FormData } from '@/types/seekerRegistration';

// Generate unique organization ID
export function generateOrganizationId(): string {
  return `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

// Validate and clean user data before saving
function validateUserData(userData: any): boolean {
  console.log('🔍 Validating user data before save:', userData);
  
  const required = ['userId', 'password', 'organizationName', 'entityType', 'country', 'email', 'contactPersonName'];
  for (const field of required) {
    if (!userData[field] || userData[field].toString().trim() === '') {
      console.log(`❌ Missing required field: ${field}`);
      return false;
    }
  }
  
  console.log('✅ User data validation passed');
  return true;
}

// Save user data with multiple verification steps
export function saveUserDataSecurely(userData: any): boolean {
  try {
    console.log('💾 Starting secure user data save process...');
    
    // Validate data first
    if (!validateUserData(userData)) {
      console.log('❌ User data validation failed, aborting save');
      return false;
    }

    // Get existing users
    const existingUsersData = localStorage.getItem('registered_users');
    const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];
    
    console.log('📋 Current registered users count:', existingUsers.length);
    console.log('📋 Existing users:', existingUsers.map((u: any) => ({ userId: u.userId, org: u.organizationName })));
    
    // Check for duplicate user ID
    const userExists = existingUsers.find((user: any) => 
      user.userId.toLowerCase() === userData.userId.toLowerCase()
    );
    
    if (userExists) {
      console.log('❌ User ID already exists:', userData.userId);
      return false;
    }

    // Add new user
    existingUsers.push(userData);
    
    // Save to localStorage
    localStorage.setItem('registered_users', JSON.stringify(existingUsers));
    
    // Immediate verification
    const verificationData = localStorage.getItem('registered_users');
    if (!verificationData) {
      console.log('❌ Verification failed: No data found after save');
      return false;
    }
    
    const verifiedUsers = JSON.parse(verificationData);
    const savedUser = verifiedUsers.find((user: any) => 
      user.userId.toLowerCase() === userData.userId.toLowerCase()
    );
    
    if (!savedUser) {
      console.log('❌ Verification failed: User not found after save');
      return false;
    }
    
    console.log('✅ User data successfully saved and verified');
    console.log('✅ Saved user details:', {
      userId: savedUser.userId,
      organizationName: savedUser.organizationName,
      entityType: savedUser.entityType,
      country: savedUser.country
    });
    
    return true;
    
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
