
export const checkExistingMembership = (userId: string) => {
  console.log('🔍 Checking existing membership for user:', userId);
  
  const membershipData = localStorage.getItem('seeker_membership_data');
  console.log('🔍 Raw membership data from localStorage:', membershipData);
  
  if (membershipData) {
    try {
      const parsedData = JSON.parse(membershipData);
      console.log('🔍 Parsed membership data:', parsedData);
      
      // More robust checking - check if user exists and has membership
      if (parsedData && parsedData.userId && parsedData.userId === userId) {
        console.log('✅ User ID matches! Checking membership status...');
        
        // Check if user has active membership
        if (parsedData.isMember === true) {
          console.log('✅ Valid active membership found for user');
          return {
            isMember: true,
            organizationName: parsedData.organizationName || 'Sample Organization',
            entityType: parsedData.entityType,
            membershipPlan: parsedData.membershipPlan,
            joinedAt: parsedData.joinedAt,
            lastUpdated: parsedData.lastUpdated
          };
        } else {
          console.log('⚠️ User found but no active membership');
          return {
            isMember: false,
            organizationName: parsedData.organizationName || 'Sample Organization',
            entityType: parsedData.entityType,
            membershipPlan: parsedData.membershipPlan
          };
        }
      } else {
        console.log('❌ User ID does not match stored data');
        console.log('Expected:', userId, 'Found:', parsedData?.userId);
      }
    } catch (error) {
      console.log('❌ Error parsing membership data:', error);
    }
  } else {
    console.log('❌ No membership data found in localStorage');
  }
  
  console.log('❌ No valid membership found for user');
  return {
    isMember: false,
    organizationName: 'Sample Organization' // Default organization name
  };
};
