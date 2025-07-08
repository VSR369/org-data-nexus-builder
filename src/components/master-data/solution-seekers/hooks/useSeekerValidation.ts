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

  // Load seekers data from actual storage
  const refreshSeekers = () => {
    setLoading(true);
    setError(null);
    
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
      
      // Load organization-specific membership state
      const orgSpecificKey = `membership_pricing_system_state_${orgId}`;
      let membershipState = JSON.parse(localStorage.getItem(orgSpecificKey) || '{}');
      
      // Fallback to global state if organization-specific doesn't exist
      if (!membershipState.last_updated) {
        membershipState = JSON.parse(localStorage.getItem('membership_pricing_system_state') || '{}');
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

  // Approval handlers
  const handleApproval = async (seekerId: string, status: 'approved' | 'rejected', reason?: string, documents?: File[]) => {
    setProcessing(prev => ({ ...prev, processingApproval: seekerId }));
    
    try {
      // Save to ApprovalStatusService
      const success = await approvalStatusService.saveApprovalStatus({
        seekerId,
        status,
        reason
      });
      
      if (success && documents && documents.length > 0) {
        await approvalStatusService.saveDocuments(seekerId, documents);
      }
      
      // Update the seeker's approval status in UI
      setSeekers(prevSeekers => 
        prevSeekers.map(seeker => 
          seeker.id === seekerId 
            ? { ...seeker, approvalStatus: status }
            : seeker
        )
      );
      
      console.log(`✅ ${status === 'approved' ? 'Approved' : 'Rejected'} seeker:`, seekerId, reason);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error updating approval status:', error);
    } finally {
      setProcessing(prev => ({ ...prev, processingApproval: null }));
    }
  };

  const handleCreateAdmin = async (seeker: SeekerDetails) => {
    setProcessing(prev => ({ ...prev, processingAdmin: seeker.id }));
    
    try {
      console.log(`Creating administrator for: ${seeker.organizationName}`);
      
      // Create admin record
      const adminRecord = {
        id: `admin_${seeker.id}_${Date.now()}`, 
        sourceSeekerId: seeker.id,
        adminId: `admin_${seeker.organizationId}`,
        adminName: `${seeker.organizationName} Administrator`,
        adminEmail: seeker.email,
        createdAt: new Date().toISOString()
      };
      
      // Save to ApprovalStatusService
      const success = await approvalStatusService.saveAdministrator(adminRecord);
      
      if (success) {
        // Update seeker to have administrator
        setSeekers(prevSeekers => 
          prevSeekers.map(s => 
            s.id === seeker.id 
              ? { ...s, hasAdministrator: true }
              : s
          )
        );
        
        console.log(`✅ Administrator created for: ${seeker.organizationName}`);
      } else {
        throw new Error('Failed to save administrator record');
      }
      
    } catch (error) {
      console.error('Error creating administrator:', error);
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

  useEffect(() => {
    refreshSeekers();
  }, []);

  return {
    seekers,
    setSeekers,
    loading,
    error,
    comprehensiveData,
    processing,
    refreshSeekers,
    loadComprehensiveOrgData,
    handleApproval,
    handleCreateAdmin,
    downloadSeekersData
  };
};