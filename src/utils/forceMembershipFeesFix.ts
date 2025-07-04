// Emergency fix for membership fees data structure
// This runs immediately to fix the wrapped format issue

export function forceMembershipFeesRawFormat(): boolean {
  try {
    console.log('🔧 EMERGENCY: Fixing membership fees data structure...');
    
    const rawData = localStorage.getItem('master_data_seeker_membership_fees');
    if (!rawData) {
      console.log('📭 No membership fees data found');
      return false;
    }
    
    let parsed;
    try {
      parsed = JSON.parse(rawData);
    } catch (error) {
      console.error('❌ Invalid JSON in membership fees data');
      return false;
    }
    
    // Check if it's in wrapped format
    if (parsed && typeof parsed === 'object' && parsed.data && Array.isArray(parsed.data)) {
      console.log('🔧 DETECTED: Membership fees in wrapped format, unwrapping NOW...');
      
      // Extract the raw array
      const rawArray = parsed.data;
      
      // Save as raw array
      localStorage.setItem('master_data_seeker_membership_fees', JSON.stringify(rawArray));
      
      // Remove wrapped format artifacts
      localStorage.removeItem('user_created_master_data_seeker_membership_fees');
      localStorage.removeItem('backup_master_data_seeker_membership_fees');
      
      console.log('✅ FIXED: Membership fees converted to raw format:', rawArray.length, 'items');
      return true;
    }
    
    // If already in raw format
    if (Array.isArray(parsed)) {
      console.log('✅ Membership fees already in raw format:', parsed.length, 'items');
      return true;
    }
    
    console.log('❌ Unrecognized membership fees format:', typeof parsed);
    return false;
    
  } catch (error) {
    console.error('❌ Emergency fix failed:', error);
    return false;
  }
}

// Auto-run the fix
forceMembershipFeesRawFormat();

export default forceMembershipFeesRawFormat;