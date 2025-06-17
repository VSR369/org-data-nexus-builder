
export function debugStorageData(): void {
  console.log('🔍 === STORAGE DEBUG START ===');
  
  // Check all localStorage keys
  const allKeys = Object.keys(localStorage);
  console.log('📋 All localStorage keys:', allKeys);
  
  // Check for user-related data
  const userKeys = allKeys.filter(key => 
    key.toLowerCase().includes('user') || 
    key.toLowerCase().includes('registered') ||
    key.toLowerCase().includes('seeker')
  );
  console.log('👥 User-related keys:', userKeys);
  
  // Check registered_users specifically
  const registeredUsersData = localStorage.getItem('registered_users');
  console.log('📊 registered_users raw data:', registeredUsersData);
  
  if (registeredUsersData) {
    try {
      const parsedUsers = JSON.parse(registeredUsersData);
      console.log('👥 Parsed users:', parsedUsers);
      console.log('📈 Users count:', Array.isArray(parsedUsers) ? parsedUsers.length : 'Not an array');
      
      if (Array.isArray(parsedUsers)) {
        parsedUsers.forEach((user, index) => {
          console.log(`👤 User ${index + 1}:`, {
            userId: user.userId,
            organizationName: user.organizationName,
            email: user.email,
            hasPassword: !!user.password,
            registrationTime: user.registrationTimestamp
          });
        });
      }
    } catch (error) {
      console.error('❌ Error parsing registered users:', error);
    }
  } else {
    console.log('⚠️ No registered_users data in localStorage');
  }
  
  // Check session data
  const sessionData = localStorage.getItem('seeker_session_data');
  console.log('🔑 Session data:', sessionData);
  
  // Check migration flags
  const migrationFlag = localStorage.getItem('unified_storage_migration_complete');
  const indexedDBMigrationFlag = localStorage.getItem('indexeddb_migration_complete');
  console.log('🔄 Migration flags:', {
    unified: migrationFlag,
    indexedDB: indexedDBMigrationFlag
  });
  
  console.log('🔍 === STORAGE DEBUG END ===');
}
