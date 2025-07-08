// Enhanced debug utility to inspect all payment-related data in localStorage
export const debugAllPaymentData = () => {
  console.log('🔍 === COMPREHENSIVE PAYMENT DATA DEBUGGING ===');
  
  const allKeys = Object.keys(localStorage);
  console.log(`📋 Total localStorage keys: ${allKeys.length}`);
  
  // Find all membership-related keys
  const membershipKeys = allKeys.filter(key => 
    key.includes('membership') || 
    key.includes('pricing') || 
    key.includes('payment') ||
    key.includes('engagement') ||
    key.includes('seeker')
  );
  
  console.log(`💳 Found ${membershipKeys.length} payment-related keys:`, membershipKeys);
  
  // Create detailed breakdown
  const keyCategories = {
    membershipState: [],
    registrationData: [],
    other: []
  };
  
  membershipKeys.forEach(key => {
    if (key.includes('membership_pricing_system_state')) {
      keyCategories.membershipState.push(key);
    } else if (key.includes('registration') || key.includes('seeker')) {
      keyCategories.registrationData.push(key);
    } else {
      keyCategories.other.push(key);
    }
  });
  
  console.log('\n📊 CATEGORIZED KEYS:');
  console.log('  🏪 Membership State Keys:', keyCategories.membershipState);
  console.log('  📝 Registration Keys:', keyCategories.registrationData);
  console.log('  📦 Other Keys:', keyCategories.other);
  
  // Detailed analysis of each key
  membershipKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        console.log(`\n🔑 ${key}:`);
        console.log('  📊 Data structure:', {
          organization_id: parsed.organization_id,
          organization_name: parsed.organization_name,
          membership_status: parsed.membership_status,
          membership_type: parsed.membership_type,
          selected_engagement_model: parsed.selected_engagement_model,
          selected_frequency: parsed.selected_frequency,
          payment_records_count: parsed.payment_records?.length || 0,
          last_updated: parsed.last_updated
        });
        
        // Detailed payment records analysis
        if (parsed.payment_records && Array.isArray(parsed.payment_records)) {
          console.log(`  💰 Payment Records (${parsed.payment_records.length}):`);
          parsed.payment_records.forEach((record, index) => {
            console.log(`    ${index + 1}. Type: ${record.type}, Status: ${record.status}, Amount: ${record.currency} ${record.amount}`);
            if (record.engagementModel) {
              console.log(`       Engagement: ${record.engagementModel} (${record.billingFrequency})`);
            }
            if (record.organizationId || record.organizationName) {
              console.log(`       Org: ${record.organizationName} (${record.organizationId})`);
            }
          });
        }
      }
    } catch (e) {
      console.log(`  ❌ Failed to parse ${key}:`, e);
    }
  });
  
  // Current organization analysis
  try {
    const orgData = localStorage.getItem('solution_seeker_registration_data');
    if (orgData) {
      const parsed = JSON.parse(orgData);
      console.log('\n🏢 CURRENT ORGANIZATION IDENTIFIERS:');
      console.log('  Name:', parsed.organizationName);
      console.log('  ID:', parsed.organizationId);
      console.log('  User ID:', parsed.userId);
      console.log('  Email:', parsed.email);
      
      // Generate possible storage keys for this organization
      const possibleKeys = [
        `membership_pricing_system_state_${parsed.organizationId}`,
        `membership_pricing_system_state_${parsed.organizationName?.replace(/\s+/g, '_')}`,
        `membership_pricing_system_state_${parsed.email}`,
        `membership_pricing_system_state_${parsed.userId}`,
        'membership_pricing_system_state' // global fallback
      ].filter(Boolean);
      
      console.log('\n🎯 EXPECTED STORAGE KEYS FOR CURRENT ORG:');
      possibleKeys.forEach((key, index) => {
        const exists = localStorage.getItem(key) !== null;
        console.log(`  ${index + 1}. ${key} - ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      });
    }
  } catch (e) {
    console.log('❌ Failed to parse organization registration data');
  }
  
  console.log('\n=== END COMPREHENSIVE DEBUG ===');
  return { membershipKeys, keyCategories };
};

// Enhanced function to find and analyze payment data for a specific organization
export const analyzeOrganizationPaymentData = (organizationName: string, organizationId: string) => {
  console.log(`🎯 === ANALYZING PAYMENT DATA FOR: ${organizationName} ===`);
  
  const allKeys = Object.keys(localStorage);
  const results: any[] = [];
  const summary = {
    membershipPayments: 0,
    engagementPayments: 0,
    totalAmount: 0,
    lastPaymentDate: null as string | null
  };
  
  // Check all possible storage patterns
  allKeys.forEach(key => {
    if (key.includes('membership') || key.includes('pricing')) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          
          // Check if this data belongs to our organization
          const belongsToOrg = 
            parsed.organization_id === organizationId ||
            parsed.organization_name === organizationName ||
            key.includes(organizationId) ||
            key.includes(organizationName?.replace(/\s+/g, '_'));
          
          if (belongsToOrg || parsed.payment_records) {
            const relevantPayments = parsed.payment_records?.filter((record: any) => 
              record.organizationId === organizationId ||
              record.organizationName === organizationName ||
              (!record.organizationId && belongsToOrg) // For global fallback case
            ) || [];
            
            results.push({
              key,
              data: parsed,
              relevantPayments,
              membershipStatus: parsed.membership_status,
              engagementModel: parsed.selected_engagement_model,
              frequency: parsed.selected_frequency
            });
            
            // Update summary
            relevantPayments.forEach((payment: any) => {
              if (payment.type === 'membership' && payment.status === 'completed') {
                summary.membershipPayments++;
              }
              if (payment.type === 'engagement' && payment.status === 'completed') {
                summary.engagementPayments++;
              }
              summary.totalAmount += payment.amount || 0;
              if (payment.timestamp && (!summary.lastPaymentDate || payment.timestamp > summary.lastPaymentDate)) {
                summary.lastPaymentDate = payment.timestamp;
              }
            });
          }
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  });
  
  console.log(`📊 ANALYSIS SUMMARY for ${organizationName}:`);
  console.log('  💳 Membership Payments:', summary.membershipPayments);
  console.log('  🎯 Engagement Payments:', summary.engagementPayments);
  console.log('  💰 Total Amount:', summary.totalAmount);
  console.log('  📅 Last Payment:', summary.lastPaymentDate);
  console.log(`  📁 Data Sources Found: ${results.length}`);
  
  results.forEach((result, index) => {
    console.log(`\n  ${index + 1}. ${result.key}:`);
    console.log(`     Membership: ${result.membershipStatus || 'none'}`);
    console.log(`     Engagement: ${result.engagementModel || 'none'} (${result.frequency || 'none'})`);
    console.log(`     Payments: ${result.relevantPayments.length}`);
  });
  
  return { results, summary };
};

// Make it available globally for browser console debugging
if (typeof window !== 'undefined') {
  (window as any).debugAllPaymentData = debugAllPaymentData;
}