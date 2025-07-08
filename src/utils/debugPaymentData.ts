// Debug utility to inspect all payment-related data in localStorage
export const debugAllPaymentData = () => {
  console.log('🔍 === DEBUGGING ALL PAYMENT DATA ===');
  
  const allKeys = Object.keys(localStorage);
  console.log(`📋 Total localStorage keys: ${allKeys.length}`);
  
  // Find all membership-related keys
  const membershipKeys = allKeys.filter(key => 
    key.includes('membership') || 
    key.includes('pricing') || 
    key.includes('payment') ||
    key.includes('engagement')
  );
  
  console.log(`💳 Found ${membershipKeys.length} payment-related keys:`, membershipKeys);
  
  membershipKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        console.log(`\n🔑 ${key}:`);
        console.log('  Data:', parsed);
        
        // Check for payment records
        if (parsed.payment_records && Array.isArray(parsed.payment_records)) {
          console.log(`  💰 Payment records (${parsed.payment_records.length}):`, parsed.payment_records);
        }
        
        // Check for organization details
        if (parsed.organization_id || parsed.organization_name) {
          console.log(`  🏢 Organization: ${parsed.organization_name} (${parsed.organization_id})`);
        }
      }
    } catch (e) {
      console.log(`  ❌ Failed to parse ${key}:`, e);
    }
  });
  
  // Also check for organization registration data
  try {
    const orgData = localStorage.getItem('solution_seeker_registration_data');
    if (orgData) {
      const parsed = JSON.parse(orgData);
      console.log('\n🏢 Current organization registration data:');
      console.log('  Organization Name:', parsed.organizationName);
      console.log('  Organization ID:', parsed.organizationId);
      console.log('  User ID:', parsed.userId);
      console.log('  Email:', parsed.email);
    }
  } catch (e) {
    console.log('❌ Failed to parse organization registration data');
  }
  
  console.log('\n=== END DEBUG ===');
};

// Make it available globally for browser console debugging
if (typeof window !== 'undefined') {
  (window as any).debugAllPaymentData = debugAllPaymentData;
}