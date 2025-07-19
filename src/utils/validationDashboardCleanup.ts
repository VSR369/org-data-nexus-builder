
/**
 * Utility to clean up Solution Seekers Validation Dashboard specific data
 * This should be run once after the dashboard deletion to ensure clean state
 */
export class ValidationDashboardCleanup {
  /**
   * Remove all validation dashboard specific localStorage keys
   */
  static cleanupLocalStorage(): void {
    console.log('🗑️ Cleaning up validation dashboard localStorage data...');
    
    const validationKeys = [
      'seeker_approvals',
      'created_administrators', 
      'seeker_documents',
      'validation_dashboard_state',
      'seeker_validation_cache'
    ];
    
    let removedCount = 0;
    
    validationKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        removedCount++;
        console.log(`✅ Removed localStorage key: ${key}`);
      }
    });
    
    console.log(`🧹 Cleanup complete: Removed ${removedCount} validation dashboard keys`);
  }
  
  /**
   * Get current localStorage status for validation keys
   */
  static getCleanupStatus(): { cleaned: boolean; remainingKeys: string[] } {
    const validationKeys = [
      'seeker_approvals',
      'created_administrators', 
      'seeker_documents',
      'validation_dashboard_state',
      'seeker_validation_cache'
    ];
    
    const remainingKeys = validationKeys.filter(key => localStorage.getItem(key) !== null);
    
    return {
      cleaned: remainingKeys.length === 0,
      remainingKeys
    };
  }
}
