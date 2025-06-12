
// Utility to clear all membership-related localStorage data
export const clearAllMembershipData = () => {
  const keysToRemove = [
    'seeker_membership_data',
    'entity_types',
    'membership_plans',
    'master_data_entity_types'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🧹 Cleared localStorage key: ${key}`);
  });
  
  console.log('✅ All membership data cleared from localStorage');
};

// Auto-clear on import to ensure clean state
clearAllMembershipData();
