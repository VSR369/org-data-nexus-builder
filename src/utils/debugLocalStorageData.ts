// Debug utility to inspect localStorage for membership data
export const debugMembershipStorage = () => {
  console.log('🔍 Debugging all localStorage keys for membership data...');
  
  const allKeys = Object.keys(localStorage);
  const membershipKeys = allKeys.filter(key => 
    key.includes('membership') || 
    key.includes('payment') || 
    key.includes('organization') ||
    key.includes('seeker')
  );
  
  console.log('📋 All membership-related keys found:', membershipKeys);
  
  membershipKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        console.log(`🔑 ${key}:`, parsed);
        
        // If this looks like payment data, show payment records
        if (parsed.payment_records && Array.isArray(parsed.payment_records)) {
          console.log(`  💳 Payment records (${parsed.payment_records.length}):`, parsed.payment_records);
        }
      }
    } catch (e) {
      console.log(`  ❌ Failed to parse ${key}:`, e);
    }
  });
  
  // Also check for current organization registration data
  try {
    const orgData = localStorage.getItem('solution_seeker_registration_data');
    if (orgData) {
      const parsed = JSON.parse(orgData);
      console.log('🏢 Current organization registration data:', parsed);
    }
  } catch (e) {
    console.log('❌ Failed to parse organization registration data');
  }
  
  return { membershipKeys, allKeys };
};

// Function to find payment data across all possible storage locations
export const findPaymentDataForOrganization = (organizationName: string, organizationId: string) => {
  console.log(`🔍 Searching for payment data for ${organizationName} (${organizationId})`);
  
  const allKeys = Object.keys(localStorage);
  const results: any[] = [];
  
  // Check all keys that might contain payment data
  allKeys.forEach(key => {
    if (key.includes('membership') || key.includes('payment')) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          
          // Check if this data might belong to our organization
          const hasPaymentRecords = parsed.payment_records && Array.isArray(parsed.payment_records);
          const hasOrgData = parsed.organization_name === organizationName || 
                           parsed.organization_id === organizationId ||
                           parsed.last_updated; // Any payment state data
          
          if (hasPaymentRecords || hasOrgData) {
            results.push({
              key,
              data: parsed,
              hasPayments: hasPaymentRecords,
              paymentCount: hasPaymentRecords ? parsed.payment_records.length : 0
            });
          }
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  });
  
  console.log(`📊 Found ${results.length} potential payment data sources:`, results);
  return results;
};