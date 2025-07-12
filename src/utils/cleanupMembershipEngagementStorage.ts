/**
 * Utility to clean up all membership and engagement model related storage data
 */

export const cleanupMembershipEngagementStorage = () => {
  console.log('🧹 Starting cleanup of membership and engagement storage data...');
  
  // Keys to remove from localStorage
  const keysToRemove = [
    // Engagement model related keys
    'engagementModels',
    'engagement_configurations',
    'engagement_selection',
    'all_engagement_selections',
    
    // Membership related keys
    'membershipData',
    'membership_configurations',
    'membership_selection',
    'membership_plans',
    'membershipFeeConfigurations',
    'seekerMembershipFees',
    
    // Pricing related keys
    'pricing_configurations',
    'engagementModelPricing',
    
    // Any keys that contain these patterns
  ];
  
  // Remove specific keys
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed localStorage key: ${key}`);
    }
  });
  
  // Remove keys that match patterns
  const allKeys = Object.keys(localStorage);
  const patternsToMatch = [
    'engagement_selection_',
    'membership_selection_',
    'pricing_config_',
    'engagement_model_',
    'membership_plan_'
  ];
  
  allKeys.forEach(key => {
    const shouldRemove = patternsToMatch.some(pattern => key.includes(pattern));
    if (shouldRemove) {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed localStorage key (pattern match): ${key}`);
    }
  });
  
  // Clean up sessionStorage as well
  const sessionKeysToRemove = [
    'selectedMembership',
    'selectedEngagement',
    'engagementPricing',
    'membershipStatus'
  ];
  
  sessionKeysToRemove.forEach(key => {
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key);
      console.log(`🗑️ Removed sessionStorage key: ${key}`);
    }
  });
  
  console.log('✅ Cleanup completed successfully!');
  
  // Return summary
  return {
    message: 'Membership and engagement model storage data cleaned up successfully',
    removedKeys: [...keysToRemove, ...sessionKeysToRemove],
    timestamp: new Date().toISOString()
  };
};

// Auto-run cleanup when this module is imported
if (typeof window !== 'undefined') {
  // Run cleanup immediately
  cleanupMembershipEngagementStorage();
  
  // Also provide a global function for manual cleanup
  (window as any).cleanupMembershipEngagement = cleanupMembershipEngagementStorage;
}