// Trigger Custom Data Restoration
import { CustomDataRestoration } from './customDataRestoration';

export const triggerCustomDataRestoration = async () => {
  try {
    console.log('🔄 Triggering custom data restoration...');
    
    // Execute the restoration
    const result = await CustomDataRestoration.restoreAllCustomDataOnly();
    
    console.log('✅ Custom data restoration completed successfully!');
    console.log('📊 Restoration Summary:', result);
    
    // Reload the page to ensure all components use the restored custom data
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
    return result;
  } catch (error) {
    console.error('❌ Error during custom data restoration:', error);
    throw error;
  }
};

// Execute restoration immediately
console.log('🚀 Initiating comprehensive custom data restoration...');
triggerCustomDataRestoration();