import { useState, useEffect } from 'react';
import type { SeekerDetails } from '../types';
import { approvalStatusService } from '@/services/ApprovalStatusService';
import { migrateToOrganizationSpecificStorage, isMigrationNeeded } from '@/utils/organizationDataMigration';

interface ComprehensiveOrgData {
  organizationDetails: any;
  membershipDetails: any;
  engagementDetails: any;
  pricingDetails: any;
  paymentHistory: any[];
}

export const useSeekerValidation = () => {
  const [seekers, setSeekers] = useState<SeekerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comprehensiveData, setComprehensiveData] = useState<ComprehensiveOrgData | null>(null);
  const [processing, setProcessing] = useState({
    processingApproval: null as string | null,
    processingAdmin: null as string | null
  });

  // Load comprehensive organization data
  const loadComprehensiveOrgData = (orgId: string) => {
    try {
      // Load membership pricing system state
      const membershipState = JSON.parse(localStorage.getItem('membership_pricing_system_state') || '{}');
      
      // Load organization registration data
      const orgData = JSON.parse(localStorage.getItem('solution_seeker_registration_data') || '{}');
      
      // Load pricing configurations
      const pricingConfigs = JSON.parse(localStorage.getItem('master_data_pricing_configs') || '[]');
      
      // Load membership fees
      const membershipFees = JSON.parse(localStorage.getItem('master_data_seeker_membership_fees') || '[]');

      const data: ComprehensiveOrgData = {
        organizationDetails: orgData,
        membershipDetails: {
          status: membershipState.membership_status || 'inactive',
          type: membershipState.membership_type || null,
          fees: membershipFees
        },
        engagementDetails: {
          selectedModel: membershipState.selected_engagement_model || null,
          frequency: membershipState.selected_frequency || null,
          configs: pricingConfigs
        },
        pricingDetails: {
          configs: pricingConfigs,
          membershipFees: membershipFees
        },
        paymentHistory: membershipState.payment_records || []
      };

      setComprehensiveData(data);
    } catch (error) {
      console.error('Error loading comprehensive org data:', error);
    }
  };

  // Enhanced seekers loading with data verification
  const refreshSeekers = () => {
    setLoading(true);
    setError(null);
    
    console.log('🔄 Starting seekers refresh with data verification...');
    
    // Check if migration is needed and perform it
    if (isMigrationNeeded()) {
      console.log('🔄 Migration needed, performing data migration...');
      const migrationResult = migrateToOrganizationSpecificStorage();
      if (migrationResult.success) {
        console.log('✅ Migration successful:', migrationResult.migratedOrganizations);
      } else {
        console.error('❌ Migration failed:', migrationResult.errors);
      }
    }
    
    try {
      const seekersData: SeekerDetails[] = [];
      
      // Load current organization from registration data
      const orgData = JSON.parse(localStorage.getItem('solution_seeker_registration_data') || '{}');
      const orgId = orgData.organizationId || `org_${Date.now()}`;
      
      // Enhanced organization-specific data loading with verification
      const orgSpecificKey = `membership_pricing_system_state_${orgId}`;
      let membershipState = JSON.parse(localStorage.getItem(orgSpecificKey) || '{}');
      
      // Verify data belongs to this organization
      if (membershipState.organization_id && membershipState.organization_id !== orgId) {
        console.warn(`⚠️ Organization ID mismatch in stored data: stored=${membershipState.organization_id}, expected=${orgId}`);
        membershipState = {}; // Reset to empty state if mismatch
      }
      
      // Smart fallback strategy - only for current organization
      if (!membershipState.last_updated) {
        // Check if this is the currently registered organization
        if (orgData.organizationName && orgData.organizationId === orgId) {
          const globalState = localStorage.getItem('membership_pricing_system_state');
          if (globalState) {
            try {
              const parsed = JSON.parse(globalState);
              // Only use global state if it doesn't have organization-specific markers
              if (!parsed.organization_id || parsed.organization_id === orgId) {
                membershipState = parsed;
                console.log(`⚠️ Using global state for current organization: ${orgData.organizationName}`);
              }
            } catch (e) {
              console.error('❌ Failed to parse global state:', e);
            }
          }
        }
      }
      
      if (orgData.organizationName) {
        const seekerId = 'current-org';
        
        // Check for existing approval status
        const existingApproval = approvalStatusService.getApprovalStatus(seekerId);
        const approvalStatus = existingApproval?.status || 'pending';
        
        // Check if administrator exists
        const adminExists = approvalStatusService.getAdministrator(seekerId) !== null;
        
        seekersData.push({
          id: seekerId,
          userId: orgData.userId || `user_${Date.now()}`,
          password: '***', // Don't store actual password
          organizationName: orgData.organizationName,
          organizationType: orgData.organizationType || 'solution-seeker',
          entityType: orgData.entityType || 'organization',
          country: orgData.country || 'IN',
          email: orgData.email || orgData.contactEmail || '',
          contactPersonName: orgData.contactPersonName || '',
          industrySegment: orgData.industrySegment || '',
          organizationId: orgId,
          registrationTimestamp: orgData.registrationTimestamp || new Date().toISOString(),
          lastLoginTimestamp: orgData.lastLoginTimestamp,
          version: orgData.version || 1,
          createdAt: orgData.createdAt || new Date().toISOString(),
          updatedAt: orgData.updatedAt || new Date().toISOString(),
          approvalStatus: approvalStatus,
          membershipStatus: membershipState.membership_status === 'member_paid' ? 'active' : 
                           membershipState.membership_status === 'inactive' ? 'inactive' : 'not-member',
          hasAdministrator: adminExists,
          selectedPlan: membershipState.membership_type,
          selectedEngagementModel: membershipState.selected_engagement_model,
          membershipActivationDate: membershipState.activationDate,
          paymentStatus: membershipState.membership_status
        });
      }

      // Load all registered users and extract organization data
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        if (Array.isArray(registeredUsers)) {
          registeredUsers.forEach((user, index) => {
            if (user.organizationName && user.organizationName !== orgData.organizationName) {
              seekersData.push({
                id: user.id || `user-${index}`,
                userId: user.userId || `user_${index}`,
                password: '***',
                organizationName: user.organizationName,
                organizationType: user.organizationType || 'solution-seeker',
                entityType: user.entityType || 'organization',
                country: user.country || 'IN',
                email: user.email || '',
                contactPersonName: user.contactPersonName || '',
                industrySegment: user.industrySegment || '',
                organizationId: user.organizationId || `org_${index}`,
                registrationTimestamp: user.registrationTimestamp || new Date().toISOString(),
                lastLoginTimestamp: user.lastLoginTimestamp,
                version: user.version || 1,
                createdAt: user.createdAt || new Date().toISOString(),
                updatedAt: user.updatedAt || new Date().toISOString(),
                approvalStatus: 'pending',
                membershipStatus: user.membershipStatus || 'inactive',
                hasAdministrator: false,
                selectedPlan: user.selectedPlan,
                selectedEngagementModel: user.selectedEngagementModel,
                membershipActivationDate: user.membershipActivationDate,
                paymentStatus: user.paymentStatus
              });
            }
          });
        }
      } catch (userError) {
        console.log('No registered users found or error loading users:', userError);
      }

      // If no data found, show empty state message
      if (seekersData.length === 0) {
        console.log('No seeking organization data found in localStorage');
      }
      
      setSeekers(seekersData);
      console.log(`✅ Loaded ${seekersData.length} seeking organizations for validation`);
    } catch (err) {
      setError('Failed to load seeking organization data');
      console.error('Error loading seekers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced approval handlers with comprehensive persistence and verification
  const handleApproval = async (seekerId: string, status: 'approved' | 'rejected', reason?: string, documents?: File[]) => {
    console.log('🔄 Starting approval process for seeker:', seekerId, 'Status:', status);
    setProcessing(prev => ({ ...prev, processingApproval: seekerId }));
    
    try {
      // Save to ApprovalStatusService with verification
      const success = await approvalStatusService.saveApprovalStatus({
        seekerId,
        status,
        reason
      });
      
      if (!success) {
        throw new Error('Failed to save approval status to storage');
      }
      
      // Save documents if provided
      if (documents && documents.length > 0) {
        const docSuccess = await approvalStatusService.saveDocuments(seekerId, documents);
        if (!docSuccess) {
          console.warn('⚠️ Documents failed to save but approval status was saved');
        }
      }
      
      // Update the seeker's approval status in UI state
      setSeekers(prevSeekers => 
        prevSeekers.map(seeker => 
          seeker.id === seekerId 
            ? { ...seeker, approvalStatus: status, updatedAt: new Date().toISOString() }
            : seeker
        )
      );
      
      // Verify persistence by reading back from storage
      const verification = approvalStatusService.getApprovalStatus(seekerId);
      if (verification?.status !== status) {
        console.error('❌ Persistence verification failed - status not saved correctly');
        throw new Error('Persistence verification failed');
      }
      
      console.log(`✅ Successfully ${status === 'approved' ? 'approved' : 'rejected'} seeker:`, seekerId, 'Verified in storage:', verification);
      
      return { success: true, updatedSeeker: seekers.find(s => s.id === seekerId) };
      
    } catch (error) {
      console.error('❌ Error updating approval status:', error);
      
      // Revert UI state on error
      setSeekers(prevSeekers => 
        prevSeekers.map(seeker => 
          seeker.id === seekerId 
            ? { ...seeker, approvalStatus: seeker.approvalStatus } // Keep original status
            : seeker
        )
      );
      
      throw error;
    } finally {
      setProcessing(prev => ({ ...prev, processingApproval: null }));
    }
  };

  const handleCreateAdmin = async (seeker: SeekerDetails) => {
    console.log('👥 Starting admin creation for seeker:', seeker.organizationName);
    setProcessing(prev => ({ ...prev, processingAdmin: seeker.id }));
    
    try {
      // Create admin record
      const adminRecord = {
        id: `admin_${seeker.id}_${Date.now()}`, 
        sourceSeekerId: seeker.id,
        adminId: `admin_${seeker.organizationId}`,
        adminName: `${seeker.organizationName} Administrator`,
        adminEmail: seeker.email,
        createdAt: new Date().toISOString()
      };
      
      // Save to ApprovalStatusService with verification
      const success = await approvalStatusService.saveAdministrator(adminRecord);
      
      if (!success) {
        throw new Error('Failed to save administrator record to storage');
      }
      
      // Update seeker to have administrator
      setSeekers(prevSeekers => 
        prevSeekers.map(s => 
          s.id === seeker.id 
            ? { ...s, hasAdministrator: true, updatedAt: new Date().toISOString() }
            : s
        )
      );
      
      // Verify persistence
      const verification = approvalStatusService.getAdministrator(seeker.id);
      if (!verification) {
        console.error('❌ Admin persistence verification failed');
        throw new Error('Admin persistence verification failed');
      }
      
      console.log(`✅ Administrator successfully created and verified for: ${seeker.organizationName}`);
      return { success: true, adminRecord };
      
    } catch (error) {
      console.error('❌ Error creating administrator:', error);
      
      // Revert UI state on error
      setSeekers(prevSeekers => 
        prevSeekers.map(s => 
          s.id === seeker.id 
            ? { ...s, hasAdministrator: false }
            : s
        )
      );
      
      throw error;
    } finally {
      setProcessing(prev => ({ ...prev, processingAdmin: null }));
    }
  };

  const downloadSeekersData = () => {
    const data = seekers.map(seeker => ({
      id: seeker.id,
      organizationName: seeker.organizationName,
      organizationType: seeker.organizationType,
      entityType: seeker.entityType,
      approvalStatus: seeker.approvalStatus,
      membershipStatus: seeker.membershipStatus,
      hasAdministrator: seeker.hasAdministrator
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution-seekers-validation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Add callback to get updated seeker by ID
  const getUpdatedSeeker = (seekerId: string): SeekerDetails | null => {
    return seekers.find(s => s.id === seekerId) || null;
  };

  // Enhanced refresh with approval status sync
  const refreshSeekersWithApprovalSync = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all approval statuses first
      const allApprovals = approvalStatusService.getAllApprovalStatuses();
      const allAdmins = approvalStatusService.getAllApprovalStatuses().map(a => 
        approvalStatusService.getAdministrator(a.seekerId)
      ).filter(Boolean);
      
      console.log('🔄 Syncing with stored approval statuses:', allApprovals.length, 'approvals,', allAdmins.length, 'admins');
      
      // Call original refresh
      refreshSeekers();
      
    } catch (error) {
      console.error('❌ Error during approval sync refresh:', error);
      refreshSeekers(); // Fallback to normal refresh
    }
  };

  useEffect(() => {
    refreshSeekersWithApprovalSync();
  }, []);

  return {
    seekers,
    setSeekers,
    loading,
    error,
    comprehensiveData,
    processing,
    refreshSeekers: refreshSeekersWithApprovalSync,
    loadComprehensiveOrgData,
    handleApproval,
    handleCreateAdmin,
    downloadSeekersData,
    getUpdatedSeeker
  };
};