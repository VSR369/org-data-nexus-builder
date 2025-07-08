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

// Unified organization identifier resolution
const resolveOrganizationIdentifiers = (seeker: any) => {
  const identifiers = {
    organizationId: seeker.organizationId || seeker.userId || seeker.id,
    organizationName: seeker.organizationName,
    email: seeker.email,
    contactEmail: seeker.contactEmail
  };
  
  console.log('🔍 Resolving organization identifiers:', identifiers);
  return identifiers;
};

// Enhanced data validation for organization match
const validateOrganizationData = (data: any, seeker: any) => {
  if (!data || !data.organization_id) return false;
  
  const seekerIds = resolveOrganizationIdentifiers(seeker);
  
  // Check if data belongs to this organization
  return data.organization_id === seekerIds.organizationId ||
         data.organization_name === seekerIds.organizationName ||
         data.organization_email === seekerIds.email;
};

// Smart storage key generation with fallback strategies
const generateStorageKeys = (seeker: any) => {
  const identifiers = resolveOrganizationIdentifiers(seeker);
  
  return [
    `membership_pricing_system_state_${identifiers.organizationId}`,
    `membership_pricing_system_state_${identifiers.organizationName?.replace(/\s+/g, '_')}`,
    `membership_pricing_system_state_${identifiers.email}`,
    `membership_pricing_system_state_${seeker.userId}`,
    `membership_pricing_system_state_${seeker.id}`
  ].filter(Boolean);
};

// Helper function to load engagement pricing details for a specific organization
export const loadEngagementPricingDetails = (seeker: any) => {
  const identifiers = resolveOrganizationIdentifiers(seeker);
  const storageKeys = generateStorageKeys(seeker);
  
  console.log(`🎯 Loading engagement pricing for organization: ${identifiers.organizationName}`, {
    identifiers,
    storageKeys
  });
  
  // DEBUG: Search all localStorage for potential payment data
  console.log('🔍 DEBUG: Searching all localStorage for payment data...');
  const allKeys = Object.keys(localStorage);
  const membershipKeys = allKeys.filter(key => key.includes('membership_pricing_system_state'));
  console.log('📋 All membership state keys found:', membershipKeys);
  
  membershipKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        console.log(`🔑 ${key}:`, {
          organization_id: parsed.organization_id,
          organization_name: parsed.organization_name,
          payment_records_count: parsed.payment_records?.length || 0,
          membership_status: parsed.membership_status,
          last_updated: parsed.last_updated
        });
      }
    } catch (e) {
      console.log(`❌ Failed to parse ${key}`);
    }
  });
  
  let membershipState: any = {};
  let usedStorageKey = '';
  let dataSource = 'none';
  
  // Try organization-specific storage keys in priority order
  for (const key of storageKeys) {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate this data belongs to the organization
        if (validateOrganizationData(parsed, seeker) || parsed.last_updated) {
          membershipState = parsed;
          usedStorageKey = key;
          dataSource = 'organization-specific';
          console.log(`✅ Found organization-specific data with key: ${key}`);
          break;
        }
      } catch (e) {
        console.warn(`❌ Failed to parse data from key: ${key}`, e);
      }
    }
  }
  
  // Enhanced fallback: Search all membership keys for payment data matching this organization
  if (!membershipState.last_updated) {
    console.log('🔍 No direct match found, searching all membership keys for payment data...');
    
    // Search all membership keys for payment records that might belong to this organization
    for (const key of membershipKeys) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          
          // Check if this data has payment records that might belong to our organization
          if (parsed.payment_records && Array.isArray(parsed.payment_records)) {
            const orgPayments = parsed.payment_records.filter((record: any) => {
              return record.organizationId === identifiers.organizationId ||
                     record.organizationName === identifiers.organizationName ||
                     record.organizationEmail === identifiers.email ||
                     record.organizationName?.toLowerCase() === identifiers.organizationName?.toLowerCase();
            });
            
            if (orgPayments.length > 0) {
              console.log(`✅ Found payment data for ${identifiers.organizationName} in ${key}:`, orgPayments);
              membershipState = {
                ...parsed,
                payment_records: orgPayments // Only use payments for this organization
              };
              usedStorageKey = key;
              dataSource = 'cross-key-search';
              break;
            }
          }
        }
      } catch (e) {
        console.warn(`❌ Failed to parse ${key} during cross-key search:`, e);
      }
    }
  }
  
  // Fallback to global state for current organization
  if (!membershipState.last_updated) {
    const orgData = JSON.parse(localStorage.getItem('solution_seeker_registration_data') || '{}');
    
    // Check if this seeker is the currently registered organization
    const isCurrentOrg = orgData.organizationName === identifiers.organizationName ||
                        orgData.organizationId === identifiers.organizationId ||
                        orgData.email === identifiers.email;
    
    if (isCurrentOrg) {
      const globalState = localStorage.getItem('membership_pricing_system_state');
      if (globalState) {
        try {
          membershipState = JSON.parse(globalState);
          dataSource = 'global-fallback';
          usedStorageKey = 'membership_pricing_system_state';
          console.log(`⚠️ Using global state as fallback for current organization: ${identifiers.organizationName}`);
        } catch (e) {
          console.error('❌ Failed to parse global state:', e);
        }
      }
    }
  }
  
  // If still no data, return empty state with clear indication
  if (!membershipState.last_updated && dataSource === 'none') {
    console.log(`📭 No membership data found for organization: ${identifiers.organizationName}`);
    return {
      membershipData: {
        status: 'inactive',
        type: 'not-a-member',
        selectedPlan: null,
        paymentStatus: 'unpaid',
        paymentAmount: 0,
        paymentCurrency: 'INR',
        paidAt: null,
        dataSource: 'no-data'
      },
      pricingData: {
        engagementModel: null,
        selectedFrequency: null,
        paymentStatus: 'unpaid',
        paymentAmount: 0,
        paymentCurrency: 'INR',
        paidAt: null,
        pricingStructure: 'currency',
        dataSource: 'no-data'
      },
      adminExists: checkAdministratorExists(seeker),
      dataSource: 'no-data'
    };
  }
  
  // Get payment records from the state
  const paymentRecords = membershipState.payment_records || [];
  
  // Find membership payment for this organization with strict matching
  const membershipPayment = paymentRecords.find((record: any) => {
    if (record.type !== 'membership' || record.status !== 'completed') return false;
    
    // Strict organization matching
    return record.organizationId === identifiers.organizationId ||
           record.organizationName === identifiers.organizationName ||
           record.organizationEmail === identifiers.email ||
           (!record.organizationId && dataSource === 'global-fallback'); // Only allow unspecified org for global fallback
  });
  
  // Find engagement payment for this organization with strict matching
  const engagementPayment = paymentRecords.find((record: any) => {
    if (record.type !== 'engagement' || record.status !== 'completed') return false;
    
    // Strict organization matching
    return record.organizationId === identifiers.organizationId ||
           record.organizationName === identifiers.organizationName ||
           record.organizationEmail === identifiers.email ||
           (!record.organizationId && dataSource === 'global-fallback'); // Only allow unspecified org for global fallback
  });
  
  const membershipData = {
    status: membershipState.membership_status || 'inactive',
    type: membershipState.membership_type || 'not-a-member',
    selectedPlan: membershipState.membership_type,
    paymentStatus: membershipPayment ? 'paid' : 'unpaid',
    paymentAmount: membershipPayment?.amount || 0,
    paymentCurrency: membershipPayment?.currency || 'INR',
    paidAt: membershipPayment?.timestamp || null,
    dataSource
  };
  
  // Enhanced pricing data with engagement model details
  const pricingData = {
    engagementModel: engagementPayment?.engagementModel || membershipState.selected_engagement_model || null,
    selectedFrequency: engagementPayment?.billingFrequency || membershipState.selected_frequency || null,
    paymentStatus: engagementPayment ? 'paid' : 'unpaid',
    paymentAmount: engagementPayment?.amount || 0,
    paymentCurrency: engagementPayment?.currency || 'INR',
    paidAt: engagementPayment?.timestamp || null,
    pricingStructure: engagementPayment?.pricingStructure || 'currency',
    dataSource
  };
  
  // Check if administrator exists
  const adminExists = checkAdministratorExists(seeker);
  
  console.log(`🎯 Loaded payment details for org ${identifiers.organizationName}:`, { 
    membershipData, 
    pricingData, 
    adminExists,
    usedStorageKey,
    dataSource,
    foundMembershipPayment: !!membershipPayment,
    foundEngagementPayment: !!engagementPayment,
    totalPaymentRecords: paymentRecords.length
  });
  
  return { membershipData, pricingData, adminExists, dataSource };
};