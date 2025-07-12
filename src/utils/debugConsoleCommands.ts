// Console commands for debugging localStorage
// These functions are automatically available in the browser console

import { displayFullLocalStorageReport, verifySignupDataIntegrity, analyzeLocalStorage } from './localStorageDebugger';

// Add quick test commands to global window
if (typeof window !== 'undefined') {
  (window as any).testSignupData = () => {
    console.log('🧪 === SIGNUP DATA TEST ===');
    
    // Test creating a sample user
    const testUser = {
      userId: 'test@example.com',
      password: 'testpass123',
      organizationName: 'Test Organization',
      organizationType: 'Private Limited',
      entityType: 'Private Limited Company',
      country: 'United States',
      email: 'test@example.com',
      contactPersonName: 'John Doe',
      industrySegment: 'Information Technology',
      organizationId: 'ORG-TEST-123',
      registrationTimestamp: new Date().toISOString()
    };
    
    console.log('📝 Test user object:', testUser);
    
    // Get existing users
    const existingData = localStorage.getItem('registered_users');
    let users = [];
    
    if (existingData) {
      try {
        users = JSON.parse(existingData);
      } catch (error) {
        console.error('❌ Error parsing existing users:', error);
        users = [];
      }
    }
    
    console.log('👥 Existing users count:', users.length);
    
    // Check if test user already exists
    const exists = users.some((u: any) => u.userId === testUser.userId);
    if (exists) {
      console.log('⚠️ Test user already exists');
    } else {
      users.push(testUser);
      localStorage.setItem('registered_users', JSON.stringify(users));
      console.log('✅ Test user added to localStorage');
    }
    
    // Verify the data
    verifySignupDataIntegrity();
    
    console.log('🧪 === TEST COMPLETE ===');
  };
  
  (window as any).clearTestData = () => {
    console.log('🗑️ === CLEARING TEST DATA ===');
    
    const existingData = localStorage.getItem('registered_users');
    if (existingData) {
      try {
        const users = JSON.parse(existingData);
        const filteredUsers = users.filter((u: any) => u.userId !== 'test@example.com');
        
        if (filteredUsers.length !== users.length) {
          localStorage.setItem('registered_users', JSON.stringify(filteredUsers));
          console.log('✅ Test user removed from localStorage');
        } else {
          console.log('⚠️ No test user found to remove');
        }
      } catch (error) {
        console.error('❌ Error clearing test data:', error);
      }
    }
    
    console.log('🗑️ === CLEANUP COMPLETE ===');
  };
  
  (window as any).showLocalStorageSize = () => {
    const report = analyzeLocalStorage();
    console.log('📊 === LOCALSTORAGE SIZE ANALYSIS ===');
    console.log(`Total keys: ${report.totalKeys}`);
    console.log(`Total size: ${report.totalSizeKB} KB`);
    console.log('📊 === SIZE ANALYSIS COMPLETE ===');
  };
  
  console.log('🔧 Debug commands loaded! Available console commands:');
  console.log('   testSignupData() - Add test user and verify');
  console.log('   clearTestData() - Remove test user');
  console.log('   showLocalStorageSize() - Show storage usage');
  console.log('   debugLocalStorage.display() - Full localStorage report');
  console.log('   debugLocalStorage.verify() - Verify signup data integrity');
}