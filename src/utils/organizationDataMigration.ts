// Organization Data Migration Utility
// Migrates global membership pricing data to organization-specific storage

interface MigrationResult {
  success: boolean;
  migratedOrganizations: string[];
  errors: string[];
}

export const migrateToOrganizationSpecificStorage = (): MigrationResult => {
  const result: MigrationResult = {
    success: false,
    migratedOrganizations: [],
    errors: []
  };

  try {
    // Get global membership state
    const globalState = localStorage.getItem('membership_pricing_system_state');
    if (!globalState) {
      result.errors.push('No global membership state found');
      return result;
    }

    const parsedGlobalState = JSON.parse(globalState);
    
    // Get organization registration data
    const orgData = localStorage.getItem('solution_seeker_registration_data');
    if (!orgData) {
      result.errors.push('No organization registration data found');
      return result;
    }

    const parsedOrgData = JSON.parse(orgData);
    const organizationId = parsedOrgData.organizationId || parsedOrgData.userId || 'default_org';

    // Check if organization-specific storage already exists
    const orgSpecificKey = `membership_pricing_system_state_${organizationId}`;
    const existingOrgState = localStorage.getItem(orgSpecificKey);

    if (!existingOrgState) {
      // Migrate global state to organization-specific storage
      const orgSpecificState = {
        ...parsedGlobalState,
        last_updated: new Date().toISOString(),
        migrated_from_global: true,
        organization_id: organizationId
      };

      // Enhance payment records with organization ID
      if (orgSpecificState.payment_records) {
        orgSpecificState.payment_records = orgSpecificState.payment_records.map((record: any) => ({
          ...record,
          organizationId: organizationId
        }));
      }

      localStorage.setItem(orgSpecificKey, JSON.stringify(orgSpecificState));
      result.migratedOrganizations.push(organizationId);
      console.log(`✅ Migrated data for organization: ${organizationId}`);
    } else {
      console.log(`ℹ️ Organization ${organizationId} already has specific storage`);
    }

    // Try to migrate data from registered users
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      if (Array.isArray(registeredUsers)) {
        registeredUsers.forEach((user, index) => {
          if (user.organizationId && user.organizationId !== organizationId) {
            const userOrgKey = `membership_pricing_system_state_${user.organizationId}`;
            const existingUserState = localStorage.getItem(userOrgKey);
            
            if (!existingUserState) {
              // Create minimal state for other organizations
              const userSpecificState = {
                membership_status: 'inactive',
                membership_type: null,
                selected_engagement_model: null,
                selected_frequency: null,
                payment_records: [],
                last_updated: new Date().toISOString(),
                organization_id: user.organizationId,
                created_from_migration: true
              };

              localStorage.setItem(userOrgKey, JSON.stringify(userSpecificState));
              result.migratedOrganizations.push(user.organizationId);
              console.log(`✅ Created state for registered user organization: ${user.organizationId}`);
            }
          }
        });
      }
    } catch (userError) {
      result.errors.push(`Error migrating registered users: ${userError}`);
    }

    result.success = true;
    console.log('🎯 Migration completed successfully');
    
  } catch (error) {
    result.errors.push(`Migration failed: ${error}`);
    console.error('❌ Migration failed:', error);
  }

  return result;
};

// Function to check if migration is needed
export const isMigrationNeeded = (): boolean => {
  const globalState = localStorage.getItem('membership_pricing_system_state');
  const orgData = localStorage.getItem('solution_seeker_registration_data');
  
  if (!globalState || !orgData) {
    return false;
  }

  try {
    const parsedOrgData = JSON.parse(orgData);
    const organizationId = parsedOrgData.organizationId || parsedOrgData.userId || 'default_org';
    const orgSpecificKey = `membership_pricing_system_state_${organizationId}`;
    
    // Migration needed if global state exists but organization-specific doesn't
    return !localStorage.getItem(orgSpecificKey);
  } catch {
    return false;
  }
};

// Enhanced organization data storage with proper validation
export const saveOrganizationSpecificData = (organizationId: string, organizationName: string, data: any) => {
  try {
    const enhancedData = {
      ...data,
      organization_id: organizationId,
      organization_name: organizationName,
      last_updated: new Date().toISOString(),
      version: (data.version || 0) + 1
    };
    
    // Ensure payment records have organization identifiers
    if (enhancedData.payment_records) {
      enhancedData.payment_records = enhancedData.payment_records.map((record: any) => ({
        ...record,
        organizationId: organizationId,
        organizationName: organizationName,
        organizationEmail: record.organizationEmail || data.organization_email
      }));
    }
    
    const storageKey = `membership_pricing_system_state_${organizationId}`;
    localStorage.setItem(storageKey, JSON.stringify(enhancedData));
    
    console.log(`✅ Saved organization-specific data for: ${organizationName}`, {
      organizationId,
      storageKey,
      dataVersion: enhancedData.version
    });
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to save organization data for ${organizationName}:`, error);
    return false;
  }
};

// Function to get organization-specific data with multiple fallback strategies
export const getOrganizationSpecificData = (organizationId: string, organizationName?: string, email?: string) => {
  // Try multiple storage key strategies
  const possibleKeys = [
    `membership_pricing_system_state_${organizationId}`,
    organizationName ? `membership_pricing_system_state_${organizationName.replace(/\s+/g, '_')}` : null,
    email ? `membership_pricing_system_state_${email}` : null
  ].filter(Boolean);
  
  for (const key of possibleKeys) {
    const orgSpecificData = localStorage.getItem(key as string);
    if (orgSpecificData) {
      try {
        const parsed = JSON.parse(orgSpecificData);
        // Validate data integrity
        if (parsed.organization_id === organizationId || 
            parsed.organization_name === organizationName ||
            parsed.last_updated) {
          console.log(`✅ Found organization data with key: ${key}`);
          return parsed;
        }
      } catch (error) {
        console.warn(`⚠️ Failed to parse organization data from key: ${key}`, error);
      }
    }
  }
  
  console.log(`📭 No organization-specific data found for: ${organizationName || organizationId}`);
  return null;
};

// Function to verify data consistency across storage
export const verifyOrganizationDataConsistency = (organizationId: string, organizationName: string) => {
  const data = getOrganizationSpecificData(organizationId, organizationName);
  if (!data) return { consistent: false, issues: ['No data found'] };
  
  const issues: string[] = [];
  
  // Check organization identifiers
  if (data.organization_id !== organizationId) {
    issues.push(`Organization ID mismatch: stored=${data.organization_id}, expected=${organizationId}`);
  }
  
  if (data.organization_name !== organizationName) {
    issues.push(`Organization name mismatch: stored=${data.organization_name}, expected=${organizationName}`);
  }
  
  // Check payment records consistency
  if (data.payment_records) {
    const inconsistentRecords = data.payment_records.filter((record: any) => 
      record.organizationId && record.organizationId !== organizationId
    );
    
    if (inconsistentRecords.length > 0) {
      issues.push(`${inconsistentRecords.length} payment records have mismatched organization IDs`);
    }
  }
  
  return {
    consistent: issues.length === 0,
    issues,
    data
  };
};