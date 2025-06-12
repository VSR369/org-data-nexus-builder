
interface MembershipDetails {
  isMember: boolean;
  organizationName?: string;
  entityType?: string;
  membershipPlan?: string;
  joinedAt?: string;
  lastUpdated?: string;
  amount?: number;
  currency?: string;
}

export const checkExistingMembership = (userId: string): MembershipDetails => {
  console.log('🔍 Checking existing membership for user:', userId);
  
  const membershipData = localStorage.getItem('seeker_membership_data');
  console.log('🔍 Raw membership data from localStorage:', membershipData);
  
  if (membershipData) {
    try {
      const parsedData = JSON.parse(membershipData);
      console.log('🔍 Parsed membership data:', parsedData);
      
      // Check if user exists and has membership
      if (parsedData && parsedData.userId && parsedData.userId === userId) {
        console.log('✅ User ID matches! Checking membership status...');
        
        // Extract and clean the data - ensure strings are properly handled
        const entityType = typeof parsedData.entityType === 'string' ? parsedData.entityType : 
                          (parsedData.entityType?.value || undefined);
        const membershipPlan = typeof parsedData.membershipPlan === 'string' ? parsedData.membershipPlan : 
                              (parsedData.membershipPlan?.value || undefined);
        
        console.log('🔍 Cleaned entity type:', entityType);
        console.log('🔍 Cleaned membership plan:', membershipPlan);
        
        // Check if user has active membership
        if (parsedData.isMember === true) {
          console.log('✅ Valid active membership found for user');
          return {
            isMember: true,
            organizationName: parsedData.organizationName || 'Sample Organization',
            entityType: entityType,
            membershipPlan: membershipPlan,
            joinedAt: parsedData.joinedAt || undefined,
            lastUpdated: parsedData.lastUpdated || undefined,
            amount: parsedData.amount || undefined,
            currency: parsedData.currency || undefined
          };
        } else {
          console.log('⚠️ User found but no active membership');
          return {
            isMember: false,
            organizationName: parsedData.organizationName || 'Sample Organization',
            entityType: entityType,
            membershipPlan: membershipPlan
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
    organizationName: 'Sample Organization'
  };
};

// Helper function to clean and migrate existing data
export const cleanMembershipData = (userId: string) => {
  console.log('🧹 Cleaning membership data for user:', userId);
  
  const membershipData = localStorage.getItem('seeker_membership_data');
  if (membershipData) {
    try {
      const parsedData = JSON.parse(membershipData);
      
      if (parsedData && parsedData.userId === userId) {
        // Clean the data to ensure proper string storage
        const cleanedData = {
          ...parsedData,
          entityType: typeof parsedData.entityType === 'string' ? parsedData.entityType : 
                     (parsedData.entityType?.value || undefined),
          membershipPlan: typeof parsedData.membershipPlan === 'string' ? parsedData.membershipPlan : 
                         (parsedData.membershipPlan?.value || undefined)
        };
        
        // Save the cleaned data back
        localStorage.setItem('seeker_membership_data', JSON.stringify(cleanedData));
        console.log('✅ Cleaned and saved membership data:', cleanedData);
        return cleanedData;
      }
    } catch (error) {
      console.error('❌ Error cleaning membership data:', error);
    }
  }
  
  return null;
};
