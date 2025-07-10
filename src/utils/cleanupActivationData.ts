// Utility to clean up all activation-related data from localStorage
export const cleanupActivationData = () => {
  // Remove engagement activation data
  localStorage.removeItem('engagementActivation');
  
  // Remove any activation-related keys
  const keysToRemove = Object.keys(localStorage).filter(key => 
    key.toLowerCase().includes('activation') || 
    key.toLowerCase().includes('engage') && key.toLowerCase().includes('payment')
  );
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('🧹 Cleaned up activation data from localStorage');
};

// Auto-cleanup on import
cleanupActivationData();