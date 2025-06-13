
// Debug function to analyze localStorage data
export function debugLocalStorage(): void {
  console.log('🔍 === LOGIN DEBUG SESSION START ===');
  
  // Check all localStorage keys
  const allKeys = Object.keys(localStorage);
  console.log('🔍 All localStorage keys:', allKeys);
  
  // Focus on user-related keys
  const userKeys = allKeys.filter(key => 
    key.toLowerCase().includes('user') || 
    key.toLowerCase().includes('registered') ||
    key.toLowerCase().includes('seeker')
  );
  console.log('🔍 User-related keys:', userKeys);
  
  // Check registered_users specifically
  const registeredUsersData = localStorage.getItem('registered_users');
  console.log('🔍 Raw registered_users data:', registeredUsersData);
  
  if (registeredUsersData) {
    try {
      const parsedUsers = JSON.parse(registeredUsersData);
      console.log('🔍 Parsed users count:', parsedUsers.length);
      console.log('🔍 User details:', parsedUsers.map((u: any) => ({
        userId: u.userId,
        organizationName: u.organizationName,
        hasPassword: !!u.password,
        registrationTime: u.registrationTimestamp
      })));
    } catch (error) {
      console.log('❌ Error parsing registered users data:', error);
    }
  }
  
  console.log('🔍 === LOGIN DEBUG SESSION END ===');
}
