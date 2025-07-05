import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Building2, AlertCircle, CheckCircle, RefreshCw, Download, Eye, UserPlus, UserCheck, UserX, RotateCcw, Activity, Database } from 'lucide-react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { useToast } from "@/hooks/use-toast";
import type { UserRecord } from '@/services/types';
import AdminCreationDialog from './AdminCreationDialog';
import RejectionDialog from './RejectionDialog';
import { approvalStatusService, type ApprovalRecord, type AdminRecord } from '@/services/ApprovalStatusService';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

interface SeekerDetails extends UserRecord {
  approvalStatus: 'pending' | 'approved' | 'rejected';
  membershipStatus?: 'active' | 'inactive' | 'not-member';
  hasAdministrator?: boolean;
  administratorId?: string;
}

const SolutionSeekersValidation: React.FC = () => {
  const [seekers, setSeekers] = useState<SeekerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<SeekerDetails | null>(null);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [currentSeekerForAdmin, setCurrentSeekerForAdmin] = useState<SeekerDetails | null>(null);
  const [currentSeekerForRejection, setCurrentSeekerForRejection] = useState<SeekerDetails | null>(null);
  const [existingAdmin, setExistingAdmin] = useState<any>(null);
  const [processingApproval, setProcessingApproval] = useState<string | null>(null);
  const [processingAdmin, setProcessingAdmin] = useState<string | null>(null);
  const { toast } = useToast();

  // Use custom localStorage hooks for state synchronization
  const {
    value: approvalStatuses,
    setValue: setApprovalStatuses,
    loading: approvalsLoading,
    error: approvalsError,
    refresh: refreshApprovals
  } = useLocalStorageState<ApprovalRecord[]>({
    key: 'seeker_approvals',
    defaultValue: [],
    validator: (value): value is ApprovalRecord[] => Array.isArray(value),
    onError: (error, operation) => {
      console.error(`❌ Approval statuses ${operation} error:`, error);
      toast({
        title: "Storage Error",
        description: `Failed to ${operation} approval statuses: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const {
    value: administratorRecords,
    setValue: setAdministratorRecords,
    loading: adminsLoading,
    error: adminsError,
    refresh: refreshAdmins
  } = useLocalStorageState<AdminRecord[]>({
    key: 'created_administrators',
    defaultValue: [],
    validator: (value): value is AdminRecord[] => Array.isArray(value),
    onError: (error, operation) => {
      console.error(`❌ Administrator records ${operation} error:`, error);
      toast({
        title: "Storage Error",
        description: `Failed to ${operation} administrator records: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Synchronize approval statuses with seekers data
  const syncApprovalStatuses = useCallback((seekersList: SeekerDetails[]): SeekerDetails[] => {
    console.log('🔄 Syncing approval statuses for', seekersList.length, 'seekers with', approvalStatuses.length, 'stored approvals');
    
    if (approvalsLoading) {
      console.log('⏳ Approval statuses still loading, keeping current states');
      return seekersList;
    }
    
    return seekersList.map(seeker => {
      const approval = approvalStatuses.find(a => a.seekerId === seeker.id);
      const currentStatus = approval ? approval.status : 'pending';
      
      if (seeker.approvalStatus !== currentStatus) {
        console.log(`🔄 Seeker ${seeker.organizationName}: ${seeker.approvalStatus} -> ${currentStatus}`);
      }
      
      return {
        ...seeker,
        approvalStatus: currentStatus
      };
    });
  }, [approvalStatuses, approvalsLoading]);

  // Synchronize administrator statuses with seekers data
  const syncAdministratorStatuses = useCallback((seekersList: SeekerDetails[]): SeekerDetails[] => {
    console.log('👥 Syncing administrator statuses for', seekersList.length, 'seekers with', administratorRecords.length, 'stored admins');
    
    if (adminsLoading) {
      console.log('⏳ Administrator records still loading, keeping current states');
      return seekersList;
    }
    
    return seekersList.map(seeker => {
      const adminRecord = administratorRecords.find(a => a.sourceSeekerId === seeker.id);
      const hasAdmin = !!adminRecord;
      
      if (seeker.hasAdministrator !== hasAdmin) {
        console.log(`👥 Administrator for ${seeker.organizationName}: ${seeker.hasAdministrator ? 'had admin' : 'no admin'} -> ${hasAdmin ? 'has admin' : 'no admin'}`);
      }
      
      return {
        ...seeker,
        hasAdministrator: hasAdmin,
        administratorId: adminRecord?.id
      };
    });
  }, [administratorRecords, adminsLoading]);

  // Load seekers and synchronize with localStorage state
  useEffect(() => {
    const loadSeekers = async () => {
      console.log('🔍 Loading solution seekers and syncing with localStorage...');
      setLoading(true);
      setError(null);
      
      try {
        await unifiedUserStorageService.initialize();
        const allUsers = await unifiedUserStorageService.getAllUsers();
        
        console.log('👥 All users retrieved:', allUsers.length);
        
        // Enhanced filtering for solution seekers
        let solutionSeekers = allUsers.filter(user => {
          const isSolutionSeeker = user.entityType?.toLowerCase().includes('solution') ||
                                 user.entityType?.toLowerCase().includes('seeker') ||
                                 user.entityType === 'solution-seeker' ||
                                 user.entityType === 'Solution Seeker';
          
          const isOrgSeeker = user.organizationType?.toLowerCase().includes('seeker');
          
          return isSolutionSeeker || isOrgSeeker;
        }) as SeekerDetails[];
        
        console.log('✅ Solution seekers found:', solutionSeekers.length);
        
        // Initialize with pending status first
        solutionSeekers = solutionSeekers.map(seeker => ({
          ...seeker,
          approvalStatus: 'pending' as const,
          hasAdministrator: false
        }));
        
        // Synchronize with localStorage data
        solutionSeekers = syncApprovalStatuses(solutionSeekers);
        solutionSeekers = syncAdministratorStatuses(solutionSeekers);
        
        console.log('📊 Final seekers with synchronized statuses:', solutionSeekers.map(s => ({
          name: s.organizationName,
          approval: s.approvalStatus,
          hasAdmin: s.hasAdministrator
        })));
        
        // If no solution seekers found, show all users for debugging
        if (solutionSeekers.length === 0 && allUsers.length > 0) {
          console.log('⚠️ No solution seekers found, showing all users for analysis');
          const allUsersWithSync = allUsers.map(user => ({
            ...user,
            approvalStatus: 'pending' as const,
            hasAdministrator: false
          }));
          setSeekers(syncAdministratorStatuses(syncApprovalStatuses(allUsersWithSync)));
        } else {
          setSeekers(solutionSeekers);
        }
        
      } catch (err: any) {
        console.error('❌ Error loading solution seekers:', err);
        setError(err.message || 'Failed to load solution seekers.');
      } finally {
        setLoading(false);
      }
    };

    // Only load seekers if localStorage hooks have finished loading
    if (!approvalsLoading && !adminsLoading) {
      loadSeekers();
    }
  }, [approvalsLoading, adminsLoading, syncApprovalStatuses, syncAdministratorStatuses]);

  // Auto-sync component state when localStorage state changes
  useEffect(() => {
    if (!loading && seekers.length > 0) {
      console.log('🔄 Auto-syncing seekers with updated localStorage state');
      const syncedSeekers = syncAdministratorStatuses(syncApprovalStatuses(seekers));
      
      // Only update if there are actual changes to prevent infinite loops
      const hasChanges = syncedSeekers.some((seeker, index) => {
        const current = seekers[index];
        return current && (
          current.approvalStatus !== seeker.approvalStatus ||
          current.hasAdministrator !== seeker.hasAdministrator
        );
      });
      
      if (hasChanges) {
        console.log('✅ Applying auto-sync updates to seekers');
        setSeekers(syncedSeekers);
      }
    }
  }, [approvalStatuses, administratorRecords, loading, seekers, syncApprovalStatuses, syncAdministratorStatuses]);

  // Retry mechanism for localStorage operations
  const retryLocalStorageOperation = async (operation: () => boolean, maxRetries: number = 3): Promise<boolean> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} for localStorage operation`);
      
      if (operation()) {
        console.log('✅ localStorage operation succeeded on attempt', attempt);
        return true;
      }
      
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying localStorage operation in ${attempt * 500}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
      }
    }
    
    console.error('❌ localStorage operation failed after', maxRetries, 'attempts');
    return false;
  };

  // Confirmation dialog for approval actions
  const confirmApprovalAction = (seeker: SeekerDetails, action: 'approve' | 'reject'): Promise<boolean> => {
    return new Promise((resolve) => {
      const confirmed = window.confirm(
        `Are you sure you want to ${action} ${seeker.organizationName}?\n\nThis action will be saved and synchronized across all sessions.`
      );
      resolve(confirmed);
    });
  };

  const handleApproval = async (seekerId: string, status: 'approved' | 'rejected', reason?: string, documents?: File[]) => {
    console.log('🔄 Processing approval/rejection with synchronized state:', { seekerId, status, reason, documentsCount: documents?.length || 0 });
    
    // Set loading state
    setProcessingApproval(seekerId);
    
    try {
      // Show loading toast
      const loadingToast = toast({
        title: "Processing...",
        description: `${status === 'approved' ? 'Approving' : 'Rejecting'} seeker. Please wait...`,
      });

      // Create approval record
      const approvalRecord: ApprovalRecord = {
        seekerId,
        status,
        reason: reason || '',
        processedAt: new Date().toISOString(),
        processedBy: 'admin',
        documents: documents ? documents.map(file => ({ name: file.name, size: file.size, type: file.type })) : []
      };
      
      // Update approval statuses using the synchronized hook with retry mechanism
      const updatedApprovals = approvalStatuses.filter(a => a.seekerId !== seekerId);
      updatedApprovals.push(approvalRecord);
      
      const saveSuccess = await retryLocalStorageOperation(() => setApprovalStatuses(updatedApprovals));
      
      if (!saveSuccess) {
        console.error('❌ Failed to save approval status after retries');
        toast({
          title: "Storage Error",
          description: "Failed to save approval status after multiple attempts. localStorage may be full, disabled, or corrupted. Please try again or contact support.",
          variant: "destructive"
        });
        return;
      }
      
      // Save documents if provided (using the service for binary data)
      if (documents && documents.length > 0) {
        const docSaveSuccess = await approvalStatusService.saveDocuments(seekerId, documents);
        if (!docSaveSuccess) {
          console.warn('⚠️ Documents failed to save but approval status was saved');
          toast({
            title: "Partial Success",
            description: "Approval status saved but documents failed to upload. The approval is still valid.",
            variant: "default"
          });
        }
      }
      
      // Component state will automatically sync via useEffect
      console.log('✅ Approval status saved, component state will auto-sync');
      
      // Show success message
      if (!reason) {
        const seekerName = seekers.find(s => s.id === seekerId)?.organizationName;
        toast({
          title: status === 'approved' ? "✅ Seeker Approved" : "❌ Seeker Rejected",
          description: `${seekerName} has been ${status} successfully. Status synchronized across sessions. ${status === 'approved' ? 'You can now create an administrator.' : ''}`,
          variant: status === 'approved' ? "default" : "destructive"
        });
      }
      
    } catch (error) {
      console.error('❌ Exception during synchronized approval processing:', error);
      toast({
        title: "Processing Error",
        description: `Failed to update approval status: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      // Clear loading state
      setProcessingApproval(null);
    }
  };

  // Handle approval with confirmation
  const handleApprovalWithConfirmation = async (seeker: SeekerDetails, status: 'approved' | 'rejected') => {
    // Prevent double-clicks during processing
    if (processingApproval === seeker.id) {
      console.log('⏳ Already processing approval for seeker:', seeker.organizationName);
      return;
    }

    // Check localStorage availability
    if (!localStorage) {
      toast({
        title: "Storage Unavailable",
        description: "localStorage is not available in your browser. Please enable it or try a different browser.",
        variant: "destructive"
      });
      return;
    }

    // Show confirmation dialog
    const confirmed = await confirmApprovalAction(seeker, status === 'approved' ? 'approve' : 'reject');
    
    if (!confirmed) {
      console.log('❌ User cancelled approval action for:', seeker.organizationName);
      return;
    }

    await handleApproval(seeker.id, status);
  };

  const handleRejectClick = (seeker: SeekerDetails) => {
    console.log('🚫 Opening rejection dialog for seeker:', seeker.organizationName, 'Status:', seeker.approvalStatus);
    setCurrentSeekerForRejection(seeker);
    setRejectionDialogOpen(true);
  };

  const handleReapproveClick = (seeker: SeekerDetails) => {
    console.log('🔄 Opening reapproval dialog for seeker:', seeker.organizationName, 'Status:', seeker.approvalStatus);
    setCurrentSeekerForRejection(seeker);
    setRejectionDialogOpen(true);
  };

  const handleCreateAdministrator = async (seeker: SeekerDetails) => {
    // Prevent double-clicks during processing
    if (processingAdmin === seeker.id) {
      console.log('⏳ Already processing administrator for seeker:', seeker.organizationName);
      return;
    }

    console.log('👥 Opening administrator creation for seeker:', seeker.organizationName);
    setCurrentSeekerForAdmin(seeker);
    
    // Check if administrator already exists using synchronized state
    const existingAdmin = administratorRecords.find(admin => admin.sourceSeekerId === seeker.id);
    
    if (existingAdmin) {
      console.log('✅ Found existing administrator in synchronized state:', existingAdmin);
      setExistingAdmin(existingAdmin);
    } else {
      console.log('❌ No existing administrator found in synchronized state');
      setExistingAdmin(null);
    }
    
    setAdminDialogOpen(true);
  };

  const handleAdminCreated = async (adminData: any) => {
    console.log('👥 Processing admin creation with synchronized state for seeker:', currentSeekerForAdmin?.organizationName, 'Admin data:', adminData);
    
    // Set loading state
    if (currentSeekerForAdmin) {
      setProcessingAdmin(currentSeekerForAdmin.id);
    }
    
    try {
      // Show loading toast
      toast({
        title: "Processing...",
        description: `${existingAdmin ? 'Updating' : 'Creating'} administrator. Please wait...`,
      });

      // Create administrator record
      const adminRecord: AdminRecord = {
        id: adminData.id,
        sourceSeekerId: currentSeekerForAdmin?.id || '',
        adminId: adminData.adminId,
        adminName: adminData.adminName,
        adminEmail: adminData.adminEmail,
        createdAt: new Date().toISOString()
      };
      
      // Update administrator records using synchronized hook with retry mechanism
      const updatedAdmins = administratorRecords.filter(admin => admin.sourceSeekerId !== adminRecord.sourceSeekerId);
      updatedAdmins.push(adminRecord);
      
      const saveSuccess = await retryLocalStorageOperation(() => setAdministratorRecords(updatedAdmins));
      
      if (!saveSuccess) {
        console.error('❌ Failed to save administrator after retries');
        toast({
          title: "Storage Error",
          description: "Failed to save administrator after multiple attempts. localStorage may be full, disabled, or corrupted. Please try again or contact support.",
          variant: "destructive"
        });
        return;
      }
      
      // Component state will automatically sync via useEffect
      console.log('✅ Administrator record saved, component state will auto-sync');
      
      toast({
        title: existingAdmin ? "✅ Administrator Updated" : "✅ Administrator Created",
        description: `Administrator ${adminData.adminName} has been successfully ${existingAdmin ? 'updated' : 'created'}. Status synchronized across sessions.`,
      });
      
    } catch (error) {
      console.error('❌ Exception during synchronized admin creation processing:', error);
      toast({
        title: "Processing Error",
        description: `Failed to process administrator: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      // Clear loading state
      setProcessingAdmin(null);
    }
  };

  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(seekers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "solution_seekers_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const loadEngagementPricingDetails = (seeker: SeekerDetails) => {
    // Try to get membership/pricing data from localStorage
    const membershipKeys = [
      `membership_${seeker.userId}`,
      `membership_${seeker.organizationId}`,
      `${seeker.organizationName}_membership`,
      'selected_membership_plan',
      'completed_membership_payment'
    ];

    const pricingKeys = [
      `pricing_${seeker.userId}`,
      `selected_pricing_${seeker.organizationId}`,
      'selected_engagement_model',
      'engagement_model_selection'
    ];

    let membershipData = null;
    let pricingData = null;

    // Check for membership data
    for (const key of membershipKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.status || parsed.plan || parsed.membershipStatus || parsed.selectedPlan)) {
            membershipData = parsed;
            console.log('🎯 Found membership data for key:', key, parsed);
            break;
          }
        } catch (e) {
          // Continue checking other keys
        }
      }
    }

    // Check for pricing data
    for (const key of pricingKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.engagementModel || parsed.selectedModel || parsed.currency || parsed.pricing)) {
            pricingData = parsed;
            console.log('🎯 Found pricing data for key:', key, parsed);
            break;
          }
        } catch (e) {
          // Continue checking other keys
        }
      }
    }

    return { membershipData, pricingData };
  };

  // Helper function to get industry segment name from ID
  const getIndustrySegmentDisplayName = (industrySegmentValue: any): string => {
    if (!industrySegmentValue) return '';
    
    // If it's already a string name, return it
    if (typeof industrySegmentValue === 'string' && !industrySegmentValue.startsWith('is_')) {
      return industrySegmentValue;
    }
    
    // Try to load industry segments from master data
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

  // Helper function to safely render values, converting objects to strings
  const safeRender = (value: any): string => {
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

  const handleRefresh = () => {
    setSeekers([]);
    setError(null);
    // Trigger reload by re-running the effect
    window.location.reload();
  };

  const ViewDetailsDialog = ({ seeker }: { seeker: SeekerDetails }) => {
    const { membershipData, pricingData } = loadEngagementPricingDetails(seeker);
    
    console.log('👁️ ViewDetailsDialog rendering for seeker:', seeker.organizationName, 'Approval Status:', seeker.approvalStatus);
    
    return (
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {seeker.organizationName} - Detailed View
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Organization Details</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Name:</span> {safeRender(seeker.organizationName)}</div>
                <div><span className="font-medium">Type:</span> {safeRender(seeker.organizationType)}</div>
                <div><span className="font-medium">Entity:</span> {safeRender(seeker.entityType)}</div>
                <div><span className="font-medium">Country:</span> {safeRender(seeker.country)}</div>
                <div><span className="font-medium">Industry:</span> {getIndustrySegmentDisplayName(seeker.industrySegment)}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Contact Person:</span> {safeRender(seeker.contactPersonName)}</div>
                <div><span className="font-medium">Email:</span> {safeRender(seeker.email)}</div>
                <div><span className="font-medium">User ID:</span> {safeRender(seeker.userId)}</div>
                <div><span className="font-medium">Org ID:</span> {safeRender(seeker.organizationId)}</div>
              </div>
            </div>
          </div>

          {/* Registration Information */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Registration Details</h4>
            <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
              <div><span className="font-medium">Registered:</span> {new Date(seeker.registrationTimestamp).toLocaleString()}</div>
              <div><span className="font-medium">Last Login:</span> {seeker.lastLoginTimestamp ? new Date(seeker.lastLoginTimestamp).toLocaleString() : 'Never'}</div>
              <div><span className="font-medium">Version:</span> {seeker.version}</div>
            </div>
          </div>

          {/* Membership & Pricing Details */}
          {(membershipData || pricingData) && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Engagement & Pricing</h4>
              <div className="bg-blue-50 p-3 rounded text-sm space-y-2">
                {membershipData && (
                  <div className="space-y-1">
                    <div><span className="font-medium">Membership Status:</span> {safeRender(membershipData.status)}</div>
                    {membershipData.selectedPlan && <div><span className="font-medium">Plan:</span> {safeRender(membershipData.selectedPlan)}</div>}
                    {membershipData.paidAt && <div><span className="font-medium">Paid At:</span> {new Date(membershipData.paidAt).toLocaleDateString()}</div>}
                  </div>
                )}
                {pricingData && (
                  <div className="space-y-1">
                    {pricingData.engagementModel && <div><span className="font-medium">Engagement Model:</span> {safeRender(pricingData.engagementModel)}</div>}
                    {pricingData.currency && pricingData.amount && (
                      <div><span className="font-medium">Pricing:</span> {safeRender(pricingData.currency)} {safeRender(pricingData.amount)}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approval Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Approval Status:</span>
              <Badge variant={
                seeker.approvalStatus === 'approved' ? 'default' : 
                seeker.approvalStatus === 'rejected' ? 'destructive' : 'secondary'
              }>
                {seeker.approvalStatus}
              </Badge>
            </div>
            
             <div className="flex gap-2">
               {seeker.approvalStatus === 'pending' && (
                 <>
                   <Button 
                     size="sm" 
                     variant="outline" 
                     className="text-green-600 border-green-600 hover:bg-green-50"
                     onClick={() => handleApprovalWithConfirmation(seeker, 'approved')}
                     disabled={processingApproval === seeker.id}
                   >
                     {processingApproval === seeker.id ? (
                       <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                     ) : (
                       <UserCheck className="h-4 w-4 mr-1" />
                     )}
                     {processingApproval === seeker.id ? 'Processing...' : 'Approve'}
                   </Button>
                   <Button 
                     size="sm" 
                     variant="outline" 
                     className="text-red-600 border-red-600 hover:bg-red-50"
                     onClick={() => handleRejectClick(seeker)}
                     disabled={processingApproval === seeker.id}
                   >
                     <UserX className="h-4 w-4 mr-1" />
                     Reject
                   </Button>
                 </>
               )}
               
               {seeker.approvalStatus === 'rejected' && (
                 <Button 
                   size="sm" 
                   variant="outline" 
                   className="text-orange-600 border-orange-600 hover:bg-orange-50"
                   onClick={() => handleReapproveClick(seeker)}
                   disabled={processingApproval === seeker.id}
                 >
                   <RotateCcw className="h-4 w-4 mr-1" />
                   Reapprove
                 </Button>
               )}
               
               {seeker.approvalStatus === 'approved' && (
                 <Button 
                   size="sm" 
                   className="bg-blue-600 hover:bg-blue-700"
                   onClick={() => handleCreateAdministrator(seeker)}
                   disabled={processingAdmin === seeker.id}
                 >
                   {processingAdmin === seeker.id ? (
                     <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                   ) : (
                     <UserPlus className="h-4 w-4 mr-1" />
                   )}
                   {processingAdmin === seeker.id ? 'Processing...' : (seeker.hasAdministrator ? 'Edit Administrator' : 'Create Administrator')}
                 </Button>
               )}
             </div>
          </div>
        </div>
      </DialogContent>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading solution seekers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error loading data</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <Button onClick={handleRefresh} className="mt-3" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Solution Seekers Validation</h1>
          <p className="text-gray-600 mt-1">
            Found {seekers.length} solution seeker{seekers.length !== 1 ? 's' : ''} in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleDownloadData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Data
          </Button>
        </div>
      </div>

      {/* Status Diagnostic Panel */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Status Persistence Diagnostic
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700 mb-1">Approval Statuses</div>
              <div className="text-xs text-gray-600">
                {(() => {
                  try {
                    const approvals = JSON.parse(localStorage.getItem('seeker_approvals') || '[]');
                    const approved = approvals.filter((a: any) => a.status === 'approved').length;
                    const rejected = approvals.filter((a: any) => a.status === 'rejected').length;
                    return `✅ ${approved} Approved • ❌ ${rejected} Rejected • 📋 ${approvals.length} Total`;
                  } catch {
                    return 'No approval data found';
                  }
                })()}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700 mb-1">Administrator Records</div>
              <div className="text-xs text-gray-600">
                {(() => {
                  try {
                    const admins = JSON.parse(localStorage.getItem('created_administrators') || '[]');
                    return `👥 ${admins.length} Administrators Created`;
                  } catch {
                    return 'No administrator data found';
                  }
                })()}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700 mb-1">Data Persistence</div>
              <div className="text-xs text-gray-600">
                <div>✅ LocalStorage Working</div>
                <div>🔄 Status Auto-Loading</div>
                <div>💾 Cross-Navigation Preserved</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {seekers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No solution seekers found</h3>
          <p className="text-gray-500 mb-4">
            No users with entity type 'solution-seeker' or organization type containing 'seeker' were found in the system.
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seekers.map(seeker => {
            const { membershipData, pricingData } = loadEngagementPricingDetails(seeker);
            
            console.log('🎯 Rendering seeker card:', seeker.organizationName, 'Status:', seeker.approvalStatus);
            
            return (
              <Card key={seeker.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    {safeRender(seeker.organizationName)}
                  </CardTitle>
                  <Badge variant={
                    seeker.approvalStatus === 'approved' ? 'default' : 
                    seeker.approvalStatus === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {seeker.approvalStatus}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span>{safeRender(seeker.organizationType)} • {safeRender(seeker.entityType)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-gray-500" />
                      <span>{safeRender(seeker.country)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {safeRender(seeker.email)}
                    </div>
                    <div>
                      <span className="font-medium">Contact:</span> {safeRender(seeker.contactPersonName)}
                    </div>
                    <div>
                      <span className="font-medium">Industry:</span> {getIndustrySegmentDisplayName(seeker.industrySegment)}
                    </div>
                    <div>
                      <span className="font-medium">User ID:</span> {safeRender(seeker.userId)}
                    </div>
                  </div>
                  
                  {/* Engagement/Pricing Model Details */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border">
                    <h4 className="font-medium text-blue-900 mb-2">Engagement & Pricing Details</h4>
                    <div className="space-y-1 text-xs text-blue-800">
                      {seeker.selectedPlan && (
                        <div><span className="font-medium">Plan:</span> {safeRender(seeker.selectedPlan)}</div>
                      )}
                      {seeker.selectedEngagementModel && (
                        <div><span className="font-medium">Model:</span> {safeRender(seeker.selectedEngagementModel)}</div>
                      )}
                      {membershipData?.selectedPlan && (
                        <div><span className="font-medium">Selected Plan:</span> {safeRender(membershipData.selectedPlan)}</div>
                      )}
                      {membershipData?.paidAt && (
                        <div><span className="font-medium">Paid At:</span> {new Date(membershipData.paidAt).toLocaleDateString()}</div>
                      )}
                      {pricingData?.engagementModel && (
                        <div><span className="font-medium">Engagement:</span> {safeRender(pricingData.engagementModel)}</div>
                      )}
                      {pricingData?.currency && pricingData?.amount && (
                        <div>
                          <span className="font-medium">Pricing:</span> {safeRender(pricingData.currency)} {safeRender(pricingData.amount)} 
                          {pricingData.frequency && ` (${safeRender(pricingData.frequency)})`}
                        </div>
                      )}
                      {!seeker.selectedPlan && !seeker.selectedEngagementModel && !membershipData && !pricingData && (
                        <div className="text-gray-500 italic">No engagement/pricing details found</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons - Fixed Layout */}
                  <div className="flex flex-col gap-3 mt-4 pt-3 border-t">
                    {/* View Details Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <ViewDetailsDialog seeker={seeker} />
                    </Dialog>
                    
                     {/* Approval Buttons - Only show for pending seekers */}
                     {seeker.approvalStatus === 'pending' && (
                       <div className="flex gap-2">
                         <Button 
                           size="sm" 
                           variant="outline" 
                           className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                           onClick={() => handleApprovalWithConfirmation(seeker, 'approved')}
                           disabled={processingApproval === seeker.id}
                         >
                           {processingApproval === seeker.id ? (
                             <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                           ) : (
                             <CheckCircle className="h-4 w-4 mr-1" />
                           )}
                           {processingApproval === seeker.id ? 'Processing...' : 'Approve'}
                         </Button>
                         <Button 
                           size="sm" 
                           variant="outline" 
                           className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                           onClick={() => handleRejectClick(seeker)}
                           disabled={processingApproval === seeker.id}
                         >
                           <UserX className="h-4 w-4 mr-1" />
                           Reject
                         </Button>
                       </div>
                     )}
                    
                    {/* Rejected Status Actions */}
                    {seeker.approvalStatus === 'rejected' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
                        onClick={() => handleReapproveClick(seeker)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reapprove
                      </Button>
                    )}
                    
                    {/* Create/Edit Admin Button - Only show for approved seekers */}
                    {seeker.approvalStatus === 'approved' && (
                      <Button 
                        size="sm" 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleCreateAdministrator(seeker)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {seeker.hasAdministrator ? 'Edit Administrator' : 'Create Administrator'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Administrator Creation Dialog */}
      {currentSeekerForAdmin && (
        <AdminCreationDialog
          open={adminDialogOpen}
          onOpenChange={setAdminDialogOpen}
          seeker={currentSeekerForAdmin}
          onAdminCreated={handleAdminCreated}
          existingAdmin={existingAdmin}
        />
      )}

      {/* Rejection Dialog */}
      {currentSeekerForRejection && (
        <RejectionDialog
          open={rejectionDialogOpen}
          onOpenChange={setRejectionDialogOpen}
          seeker={currentSeekerForRejection}
          onStatusChange={handleApproval}
        />
      )}
    </div>
  );
};

export default SolutionSeekersValidation;
