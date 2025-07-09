
// Utility to clear all membership-related localStorage data
export const clearAllMembershipData = () => {
  const keysToRemove = [
    'seeker_membership_data',
    'entity_types',
    'membership_plans',
    'master_data_entity_types'
  ];
  
  // Also clear all payment-related keys
  const allKeys = Object.keys(localStorage);
  const paymentKeys = allKeys.filter(key => 
    key.includes('membership_pricing_system_state') ||
    key.includes('payment_records') ||
    key.includes('engagement_payment')
  );
  
  [...keysToRemove, ...paymentKeys].forEach(key => {
    localStorage.removeItem(key);
    console.log(`🧹 Cleared localStorage key: ${key}`);
  });
  
  console.log('✅ All membership and payment data cleared from localStorage');
};

// Auto-clear on import to ensure clean state
clearAllMembershipData();
