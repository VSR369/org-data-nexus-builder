import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';

export const debugUserLookup = async () => {
  console.log('🔍 === DEBUG USER LOOKUP ===');
  
  try {
    await unifiedUserStorageService.initialize();
    const allUsers = await unifiedUserStorageService.getAllUsers();
    
    console.log('👥 Total users found:', allUsers.length);
    
    if (allUsers.length > 0) {
      console.log('📋 All registered users:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. User ID: "${user.userId}" | Email: "${user.email}" | Organization: "${user.organizationName}"`);
      });
      
      // Check for the specific email
      const userByEmail = allUsers.find(user => user.email === 'nikhileshvegendla@gmail.com');
      if (userByEmail) {
        console.log('✅ Found user with that email! Use this User ID:', userByEmail.userId);
        console.log('📋 Full user details:', userByEmail);
      } else {
        console.log('❌ No user found with email: nikhileshvegendla@gmail.com');
      }
    } else {
      console.log('❌ No users registered in the system');
    }
  } catch (error) {
    console.error('❌ Error during user lookup:', error);
  }
  
  console.log('🔍 === DEBUG USER LOOKUP END ===');
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).debugUserLookup = debugUserLookup;
}