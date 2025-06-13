
export function clearPreviousSessionData(): void {
  console.log('🧹 === CLEARING PREVIOUS SESSION DATA ===');
  
  const sessionKeys = [
    'seekerOrganizationName',
    'seekerEntityType',
    'seekerCountry',
    'seekerUserId'
  ];
  
  sessionKeys.forEach(key => {
    const existingValue = localStorage.getItem(key);
    if (existingValue) {
      localStorage.removeItem(key);
      console.log(`🧹 Cleared old session key: ${key} (was: ${existingValue})`);
    }
  });
  
  console.log('✅ Previous session data cleared');
}

export function saveSessionData(registeredUser: any): void {
  // Save the actual registered user details to seeker localStorage keys with verification
  const sessionData = {
    seekerOrganizationName: registeredUser.organizationName,
    seekerEntityType: registeredUser.entityType,
    seekerCountry: registeredUser.country,
    seekerUserId: registeredUser.userId
  };
  
  // Save each piece of session data with verification
  Object.entries(sessionData).forEach(([key, value]) => {
    localStorage.setItem(key, value);
    
    // Immediate verification
    const verifyValue = localStorage.getItem(key);
    if (verifyValue !== value) {
      console.error(`❌ Failed to save ${key}: expected ${value}, got ${verifyValue}`);
      throw new Error(`Session data save failed for ${key}`);
    } else {
      console.log(`✅ Successfully saved ${key}: ${value}`);
    }
  });
  
  console.log('💾 All session data saved and verified:', sessionData);
}
