// Debug utility to inspect user storage across different systems

export class StorageDebugger {
  
  static async debugUserStorage(searchEmail?: string) {
    console.log('🔍 === STORAGE DEBUG ANALYSIS START ===');
    
    // 1. Check localStorage for registered_users
    console.log('\n📂 LOCALSTORAGE ANALYSIS:');
    const localStorageUsers = localStorage.getItem('registered_users');
    console.log('Raw localStorage data:', localStorageUsers);
    
    if (localStorageUsers) {
      try {
        const users = JSON.parse(localStorageUsers);
        console.log('Parsed users count:', users.length);
        console.log('All users in localStorage:', users.map(u => ({
          userId: u.userId,
          email: u.email,
          organizationName: u.organizationName
        })));
        
        if (searchEmail) {
          const foundUser = users.find((u: any) => 
            u.email?.toLowerCase() === searchEmail.toLowerCase() ||
            u.userId?.toLowerCase() === searchEmail.toLowerCase()
          );
          console.log(`User ${searchEmail} found in localStorage:`, !!foundUser);
          if (foundUser) {
            console.log('Found user details:', foundUser);
          }
        }
      } catch (error) {
        console.error('Error parsing localStorage users:', error);
      }
    } else {
      console.log('❌ No registered_users data in localStorage');
    }
    
    // 2. Check IndexedDB via userDataManager
    console.log('\n💾 INDEXEDDB ANALYSIS:');
    try {
      const { userDataManager } = await import('@/utils/storage/UserDataManager');
      const allUsers = await userDataManager.getAllUsers();
      console.log('IndexedDB users count:', allUsers.length);
      console.log('All users in IndexedDB:', allUsers.map(u => ({
        userId: u.userId,
        email: u.email,
        organizationName: u.organizationName
      })));
      
      if (searchEmail) {
        const foundUser = allUsers.find(u => 
          u.email?.toLowerCase() === searchEmail.toLowerCase() ||
          u.userId?.toLowerCase() === searchEmail.toLowerCase()
        );
        console.log(`User ${searchEmail} found in IndexedDB:`, !!foundUser);
        if (foundUser) {
          console.log('Found user details:', foundUser);
        }
      }
    } catch (error) {
      console.error('Error accessing IndexedDB:', error);
    }
    
    // 3. Check SessionStorage
    console.log('\n🗃️ SESSIONSTORAGE ANALYSIS:');
    const sessionData = sessionStorage.getItem('seeker_session');
    console.log('Session data:', sessionData);
    
    // 4. Check if there are any other relevant storage keys
    console.log('\n🔑 ALL STORAGE KEYS:');
    const allLocalStorageKeys = Object.keys(localStorage);
    console.log('localStorage keys:', allLocalStorageKeys.filter(k => k.includes('user') || k.includes('register') || k.includes('admin')));
    
    const allSessionStorageKeys = Object.keys(sessionStorage);
    console.log('sessionStorage keys:', allSessionStorageKeys.filter(k => k.includes('user') || k.includes('register') || k.includes('admin')));
    
    console.log('🔍 === STORAGE DEBUG ANALYSIS END ===\n');
  }
  
  static async checkUserExists(identifier: string): Promise<{
    existsInLocalStorage: boolean;
    existsInIndexedDB: boolean;
    userData: any;
  }> {
    const result = {
      existsInLocalStorage: false,
      existsInIndexedDB: false,
      userData: null
    };
    
    // Check localStorage
    const localStorageUsers = localStorage.getItem('registered_users');
    if (localStorageUsers) {
      try {
        const users = JSON.parse(localStorageUsers);
        const foundUser = users.find((u: any) => 
          u.email?.toLowerCase() === identifier.toLowerCase() ||
          u.userId?.toLowerCase() === identifier.toLowerCase()
        );
        if (foundUser) {
          result.existsInLocalStorage = true;
          result.userData = foundUser;
        }
      } catch (error) {
        console.error('Error checking localStorage:', error);
      }
    }
    
    // Check IndexedDB
    try {
      const { userDataManager } = await import('@/utils/storage/UserDataManager');
      const allUsers = await userDataManager.getAllUsers();
      const foundUser = allUsers.find(u => 
        u.email?.toLowerCase() === identifier.toLowerCase() ||
        u.userId?.toLowerCase() === identifier.toLowerCase()
      );
      if (foundUser) {
        result.existsInIndexedDB = true;
        if (!result.userData) {
          result.userData = foundUser;
        }
      }
    } catch (error) {
      console.error('Error checking IndexedDB:', error);
    }
    
    return result;
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).StorageDebugger = StorageDebugger;
}