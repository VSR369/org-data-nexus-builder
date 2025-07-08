// Helper function to safely render values, converting objects to strings
export const safeRender = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'object') {
    // If it's an object, try to get a meaningful string representation
    if (value.name) return value.name;
    if (value.title) return value.title;
    if (value.value) return value.value;
    return JSON.stringify(value);
  }
  return String(value);
};

// Helper function to get industry segment name from registration data
export const getIndustrySegmentDisplayName = (industrySegmentValue: any): string => {
  if (!industrySegmentValue) return '';
  
  // If it's already a string name, return it directly
  if (typeof industrySegmentValue === 'string' && !industrySegmentValue.startsWith('is_')) {
    return industrySegmentValue;
  }
  
  // Try to get from registration data first (most accurate)
  try {
    const orgData = JSON.parse(localStorage.getItem('solution_seeker_registration_data') || '{}');
    if (orgData.industrySegment && typeof orgData.industrySegment === 'string') {
      return orgData.industrySegment;
    }
  } catch (error) {
    console.error('Error loading registration data for industry segment:', error);
  }
  
  // Try to load industry segments from master data as fallback
  try {
    const savedData = localStorage.getItem('master_data_industry_segments');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data && data.industrySegments && Array.isArray(data.industrySegments)) {
        const segment = data.industrySegments.find((seg: any) => 
          seg.id === industrySegmentValue || seg.industrySegment === industrySegmentValue
        );
        if (segment) {
          return segment.industrySegment;
        }
      }
    }
  } catch (error) {
    console.error('Error loading industry segments for display:', error);
  }
  
  // Fallback: return the original value
  return String(industrySegmentValue);
};

// Helper function to check if engagement model is Platform as a Service (PaaS)
export const isPaaSModel = (engagementModel: string) => {
  return engagementModel?.toLowerCase().includes('platform as a service') || 
         engagementModel?.toLowerCase().includes('paas');
};

// Helper function to check if administrator exists
export const checkAdministratorExists = (seeker: any) => {
  // Check various possible keys for administrator data
  const adminKeys = [
    `admin_${seeker.userId}`,
    `admin_${seeker.organizationId}`,
    `${seeker.organizationName}_admin`,
    'seeking_org_admin',
    'organization_administrator'
  ];
  
  for (const key of adminKeys) {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.isCreated || parsed.adminId || parsed.adminEmail)) {
          return true;
        }
      } catch (e) {
        // Continue checking other keys
      }
    }
  }
  
  return false;
};

// Helper function to load engagement pricing details for a specific organization
export const loadEngagementPricingDetails = (seeker: any) => {
  const organizationId = seeker.organizationId || seeker.userId;
  
  // Try organization-specific storage first
  const orgSpecificKey = `membership_pricing_system_state_${organizationId}`;
  let membershipState = JSON.parse(localStorage.getItem(orgSpecificKey) || '{}');
  
  // Fallback to global state if organization-specific doesn't exist
  if (!membershipState.last_updated) {
    membershipState = JSON.parse(localStorage.getItem('membership_pricing_system_state') || '{}');
  }
  
  // Get registration data
  const orgData = JSON.parse(localStorage.getItem('solution_seeker_registration_data') || '{}');
  
  // Get payment records from the state
  const paymentRecords = membershipState.payment_records || [];
  
  // Find membership payment for this organization
  const membershipPayment = paymentRecords.find((record: any) => 
    record.type === 'membership' && 
    record.status === 'completed' &&
    (record.organizationId === organizationId || !record.organizationId)
  );
  
  // Find engagement payment for this organization
  const engagementPayment = paymentRecords.find((record: any) => 
    record.type === 'engagement' && 
    record.status === 'completed' &&
    (record.organizationId === organizationId || !record.organizationId)
  );
  
  const membershipData = {
    status: membershipState.membership_status || 'inactive',
    type: membershipState.membership_type || 'not-a-member',
    selectedPlan: membershipState.membership_type,
    paymentStatus: membershipPayment ? 'paid' : 'unpaid',
    paymentAmount: membershipPayment?.amount || 0,
    paymentCurrency: membershipPayment?.currency || 'INR',
    paidAt: membershipPayment?.timestamp || null
  };
  
  // Enhanced pricing data with engagement model details
  const pricingData = {
    engagementModel: engagementPayment?.engagementModel || membershipState.selected_engagement_model || null,
    selectedFrequency: engagementPayment?.billingFrequency || membershipState.selected_frequency || null,
    paymentStatus: engagementPayment ? 'paid' : 'unpaid',
    paymentAmount: engagementPayment?.amount || 0,
    paymentCurrency: engagementPayment?.currency || 'INR',
    paidAt: engagementPayment?.timestamp || null,
    pricingStructure: engagementPayment?.pricingStructure || 'currency'
  };
  
  // Check if administrator exists
  const adminExists = checkAdministratorExists(seeker);
  
  console.log(`🎯 Loaded payment details for org ${organizationId}:`, { 
    membershipData, 
    pricingData, 
    adminExists,
    usedOrgSpecific: !!localStorage.getItem(orgSpecificKey)
  });
  
  return { membershipData, pricingData, adminExists };
};