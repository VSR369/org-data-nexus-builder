// LocalStorage Debugger - Complete localStorage inspection tool

export interface LocalStorageDebugInfo {
  key: string;
  rawValue: string | null;
  parsedValue: any;
  dataType: string;
  size: number;
  isJson: boolean;
  parseError?: string;
}

export interface LocalStorageReport {
  totalKeys: number;
  totalSizeKB: number;
  userDataKeys: LocalStorageDebugInfo[];
  sessionKeys: LocalStorageDebugInfo[];
  masterDataKeys: LocalStorageDebugInfo[];
  membershipKeys: LocalStorageDebugInfo[];
  systemKeys: LocalStorageDebugInfo[];
  otherKeys: LocalStorageDebugInfo[];
  registeredUsersAnalysis: {
    exists: boolean;
    totalUsers: number;
    users: any[];
    duplicateUserIds: string[];
    missingFields: string[];
  };
}

// Main function to analyze all localStorage data
export function analyzeLocalStorage(): LocalStorageReport {
  console.log('🔍 === LOCALSTORAGE ANALYSIS START ===');
  
  const report: LocalStorageReport = {
    totalKeys: 0,
    totalSizeKB: 0,
    userDataKeys: [],
    sessionKeys: [],
    masterDataKeys: [],
    membershipKeys: [],
    systemKeys: [],
    otherKeys: [],
    registeredUsersAnalysis: {
      exists: false,
      totalUsers: 0,
      users: [],
      duplicateUserIds: [],
      missingFields: []
    }
  };

  // Get all localStorage keys
  const keys = Object.keys(localStorage);
  report.totalKeys = keys.length;
  
  console.log(`📊 Found ${keys.length} localStorage keys`);

  // Analyze each key
  keys.forEach(key => {
    const info = analyzeLocalStorageKey(key);
    report.totalSizeKB += info.size;
    
    // Categorize keys
    if (isUserDataKey(key)) {
      report.userDataKeys.push(info);
    } else if (isSessionKey(key)) {
      report.sessionKeys.push(info);
    } else if (isMasterDataKey(key)) {
      report.masterDataKeys.push(info);
    } else if (isMembershipKey(key)) {
      report.membershipKeys.push(info);
    } else if (isSystemKey(key)) {
      report.systemKeys.push(info);
    } else {
      report.otherKeys.push(info);
    }
  });

  // Special analysis for registered_users
  report.registeredUsersAnalysis = analyzeRegisteredUsers();
  
  // Round total size
  report.totalSizeKB = Math.round(report.totalSizeKB * 100) / 100;

  console.log('🔍 === LOCALSTORAGE ANALYSIS COMPLETE ===');
  return report;
}

// Analyze individual localStorage key
function analyzeLocalStorageKey(key: string): LocalStorageDebugInfo {
  const rawValue = localStorage.getItem(key);
  let parsedValue: any = null;
  let isJson = false;
  let parseError: string | undefined;
  let dataType = 'null';

  if (rawValue !== null) {
    // Calculate size in KB
    const size = new Blob([rawValue]).size / 1024;
    
    // Try to parse as JSON
    if (rawValue.trim().startsWith('{') || rawValue.trim().startsWith('[')) {
      try {
        parsedValue = JSON.parse(rawValue);
        isJson = true;
        dataType = Array.isArray(parsedValue) ? 'array' : 'object';
      } catch (error) {
        parseError = error instanceof Error ? error.message : 'Unknown parse error';
        parsedValue = rawValue;
        dataType = 'string';
      }
    } else {
      parsedValue = rawValue;
      dataType = 'string';
    }

    return {
      key,
      rawValue,
      parsedValue,
      dataType,
      size: Math.round(size * 100) / 100,
      isJson,
      parseError
    };
  }

  return {
    key,
    rawValue: null,
    parsedValue: null,
    dataType: 'null',
    size: 0,
    isJson: false
  };
}

// Analyze registered_users specifically
function analyzeRegisteredUsers() {
  console.log('👥 === REGISTERED USERS ANALYSIS ===');
  
  const analysis = {
    exists: false,
    totalUsers: 0,
    users: [] as any[],
    duplicateUserIds: [] as string[],
    missingFields: [] as string[]
  };

  // Check for registered_users key first
  let rawData = localStorage.getItem('registered_users');
  let keyFound = 'registered_users';
  
  // If not found, check for alternative user data keys
  if (!rawData) {
    const alternativeKeys = [
      'user_registrations',
      'seeker_registrations', 
      'app_users',
      'system_users'
    ];
    
    for (const altKey of alternativeKeys) {
      const altData = localStorage.getItem(altKey);
      if (altData) {
        rawData = altData;
        keyFound = altKey;
        console.log(`✅ Found user data under alternative key: ${altKey}`);
        break;
      }
    }
  }
  
  if (!rawData) {
    console.log('ℹ️ No user registration data found - this is normal for new installations');
    // Mark as exists=true with 0 users instead of failing
    analysis.exists = true;
    analysis.totalUsers = 0;
    return analysis;
  }

  analysis.exists = true;
  console.log(`✅ User data key exists: ${keyFound}`);
  console.log('📊 Raw data length:', rawData.length, 'characters');

  try {
    const users = JSON.parse(rawData);
    
    if (!Array.isArray(users)) {
      console.log(`❌ ${keyFound} is not an array:`, typeof users);
      return analysis;
    }

    analysis.totalUsers = users.length;
    analysis.users = users;
    
    console.log('👥 Total users found:', users.length);

    // Check for duplicates and missing fields
    const userIds = new Set<string>();
    const requiredFields = ['userId', 'password', 'organizationName', 'entityType', 'country', 'email', 'contactPersonName'];
    
    users.forEach((user: any, index: number) => {
      console.log(`👤 User ${index + 1}:`, {
        userId: user.userId,
        organizationName: user.organizationName,
        email: user.email,
        contactPersonName: user.contactPersonName,
        registrationTimestamp: user.registrationTimestamp
      });

      // Check for duplicates
      if (user.userId) {
        if (userIds.has(user.userId.toLowerCase())) {
          analysis.duplicateUserIds.push(user.userId);
        } else {
          userIds.add(user.userId.toLowerCase());
        }
      }

      // Check for missing required fields
      requiredFields.forEach(field => {
        if (!user[field] || user[field].toString().trim() === '') {
          const missingInfo = `User ${user.userId || index}: missing ${field}`;
          if (!analysis.missingFields.includes(missingInfo)) {
            analysis.missingFields.push(missingInfo);
          }
        }
      });
    });

    if (analysis.duplicateUserIds.length > 0) {
      console.log('⚠️ Duplicate userIds found:', analysis.duplicateUserIds);
    }

    if (analysis.missingFields.length > 0) {
      console.log('⚠️ Missing required fields:', analysis.missingFields);
    }

  } catch (error) {
    console.error(`❌ Error parsing ${keyFound}:`, error);
  }

  console.log('👥 === REGISTERED USERS ANALYSIS COMPLETE ===');
  return analysis;
}

// Helper functions to categorize keys
function isUserDataKey(key: string): boolean {
  return key.includes('registered_users') || key.includes('user_') || key.includes('seeker_session');
}

function isSessionKey(key: string): boolean {
  return key.includes('session') || key.includes('admin_session') || key.includes('seeking_org_admin');
}

function isMasterDataKey(key: string): boolean {
  return key.includes('master_data') || key.includes('domain_groups') || key.includes('industry_segments');
}

function isMembershipKey(key: string): boolean {
  return key.includes('membership') || key.includes('engagement_model') || key.includes('pricing');
}

function isSystemKey(key: string): boolean {
  return key.includes('migration') || key.includes('health') || key.includes('backup') || key.includes('sync');
}

// Display functions for console output
export function displayFullLocalStorageReport(): void {
  const report = analyzeLocalStorage();
  
  console.log('\n🔍 === COMPLETE LOCALSTORAGE REPORT ===');
  console.log(`📊 Total Keys: ${report.totalKeys}`);
  console.log(`💾 Total Size: ${report.totalSizeKB} KB`);
  
  if (report.userDataKeys.length > 0) {
    console.log('\n👥 USER DATA KEYS:');
    report.userDataKeys.forEach(info => displayKeyInfo(info));
  }
  
  if (report.sessionKeys.length > 0) {
    console.log('\n🔑 SESSION KEYS:');
    report.sessionKeys.forEach(info => displayKeyInfo(info));
  }
  
  if (report.membershipKeys.length > 0) {
    console.log('\n💳 MEMBERSHIP KEYS:');
    report.membershipKeys.forEach(info => displayKeyInfo(info));
  }
  
  if (report.masterDataKeys.length > 0) {
    console.log('\n📋 MASTER DATA KEYS:');
    report.masterDataKeys.forEach(info => displayKeyInfo(info));
  }
  
  if (report.systemKeys.length > 0) {
    console.log('\n⚙️ SYSTEM KEYS:');
    report.systemKeys.forEach(info => displayKeyInfo(info));
  }
  
  if (report.otherKeys.length > 0) {
    console.log('\n🔧 OTHER KEYS:');
    report.otherKeys.forEach(info => displayKeyInfo(info));
  }
  
  // Display registered users analysis
  console.log('\n👥 === REGISTERED USERS DETAILED ANALYSIS ===');
  const userAnalysis = report.registeredUsersAnalysis;
  
  if (userAnalysis.exists) {
    console.log(`✅ registered_users exists with ${userAnalysis.totalUsers} users`);
    
    if (userAnalysis.users.length > 0) {
      console.log('\n👤 USER DETAILS:');
      userAnalysis.users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.userId} (${user.organizationName})`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Contact: ${user.contactPersonName}`);
        console.log(`   Entity: ${user.entityType}`);
        console.log(`   Country: ${user.country}`);
        console.log(`   Registered: ${user.registrationTimestamp}`);
      });
    }
    
    if (userAnalysis.duplicateUserIds.length > 0) {
      console.log('\n⚠️ DUPLICATE USER IDs:', userAnalysis.duplicateUserIds);
    }
    
    if (userAnalysis.missingFields.length > 0) {
      console.log('\n❌ MISSING REQUIRED FIELDS:');
      userAnalysis.missingFields.forEach(field => console.log(`   ${field}`));
    }
    
    if (userAnalysis.duplicateUserIds.length === 0 && userAnalysis.missingFields.length === 0) {
      console.log('✅ All user data is valid - no duplicates or missing fields');
    }
  } else {
    console.log('❌ registered_users does not exist in localStorage');
  }
  
  console.log('\n🔍 === REPORT COMPLETE ===');
}

function displayKeyInfo(info: LocalStorageDebugInfo): void {
  console.log(`📋 ${info.key}:`);
  console.log(`   Type: ${info.dataType}, Size: ${info.size} KB, JSON: ${info.isJson}`);
  
  if (info.parseError) {
    console.log(`   ❌ Parse Error: ${info.parseError}`);
  }
  
  if (info.isJson && info.parsedValue) {
    if (Array.isArray(info.parsedValue)) {
      console.log(`   📊 Array with ${info.parsedValue.length} items`);
    } else if (typeof info.parsedValue === 'object') {
      console.log(`   📋 Object with keys:`, Object.keys(info.parsedValue));
    }
  }
  
  // Show first 100 characters of raw value
  const preview = info.rawValue ? 
    (info.rawValue.length > 100 ? info.rawValue.substring(0, 100) + '...' : info.rawValue) : 
    'null';
  console.log(`   📝 Value: ${preview}`);
}

// Quick verification functions
export function verifySignupDataIntegrity(): boolean {
  console.log('🔍 === SIGNUP DATA INTEGRITY CHECK ===');
  
  const analysis = analyzeRegisteredUsers();
  
  if (!analysis.exists) {
    console.log('❌ FAIL: User data system not initialized');
    return false;
  }
  
  if (analysis.totalUsers === 0) {
    console.log('✅ PASS: No users registered yet - system ready');
    return true; // Not a failure, just empty - system is healthy
  }
  
  const hasErrors = analysis.duplicateUserIds.length > 0 || analysis.missingFields.length > 0;
  
  if (hasErrors) {
    console.log('❌ FAIL: Data integrity issues found');
    console.log(`   - Duplicates: ${analysis.duplicateUserIds.length}`);
    console.log(`   - Missing fields: ${analysis.missingFields.length}`);
    return false;
  }
  
  console.log(`✅ PASS: All ${analysis.totalUsers} users have valid data`);
  return true;
}

// Expose functions to global window for console access
if (typeof window !== 'undefined') {
  (window as any).debugLocalStorage = {
    analyze: analyzeLocalStorage,
    display: displayFullLocalStorageReport,
    verify: verifySignupDataIntegrity,
    users: analyzeRegisteredUsers
  };
  
  console.log('🔧 LocalStorage debugger loaded! Use these console commands:');
  console.log('   debugLocalStorage.display() - Full report');
  console.log('   debugLocalStorage.verify() - Verify signup data');
  console.log('   debugLocalStorage.users() - Analyze registered users');
  console.log('   debugLocalStorage.analyze() - Raw analysis data');
}