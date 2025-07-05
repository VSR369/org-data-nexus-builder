import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, AlertCircle } from 'lucide-react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { useToast } from "@/hooks/use-toast";
import AdminCreationDialog from './AdminCreationDialog';
import RejectionDialog from './RejectionDialog';
import { approvalStatusService, type ApprovalRecord, type AdminRecord } from '@/services/ApprovalStatusService';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import type { SeekerDetails, ApprovalHandlers, ProcessingStates } from './solution-seekers/types';
import StatusDiagnosticPanel from './solution-seekers/StatusDiagnosticPanel';
import SeekersList from './solution-seekers/SeekersList';

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
    
    // Check if administrator already exists - look in the main storage first
    let existingAdmin = null;
    
    console.log('🔍 SEARCHING FOR EXISTING ADMIN - Seeker ID:', seeker.id, 'Organization:', seeker.organizationName);
    
    try {
      // First, check the main administrators storage (used by login)
      const mainAdminsData = localStorage.getItem('administrators');
      console.log('🔍 Main administrators raw data:', mainAdminsData ? 'Found' : 'Not found');
      
      if (mainAdminsData) {
        const mainAdmins = JSON.parse(mainAdminsData);
        console.log('🔍 Main administrators parsed:', mainAdmins.length, 'total admins');
        mainAdmins.forEach((admin: any, index: number) => {
          console.log(`   Main Admin ${index + 1}:`, {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            sourceSeekerId: admin.sourceSeekerId,
            organizationName: admin.organizationName
          });
        });
        
        existingAdmin = mainAdmins.find((admin: any) => admin.sourceSeekerId === seeker.id);
        console.log('🔍 Main storage search result:', existingAdmin ? 'FOUND' : 'NOT FOUND');
        if (existingAdmin) {
          console.log('✅ Found admin in main storage:', existingAdmin.name);
        }
      }
      
      // If not found in main storage, check the legacy storage
      if (!existingAdmin) {
        console.log('🔍 Checking legacy storage - administratorRecords count:', administratorRecords.length);
        administratorRecords.forEach((admin, index) => {
          console.log(`   Legacy Admin ${index + 1}:`, {
            id: admin.id,
            adminName: admin.adminName,
            adminEmail: admin.adminEmail,
            sourceSeekerId: admin.sourceSeekerId
          });
        });
        
        const legacyAdmin = administratorRecords.find(admin => admin.sourceSeekerId === seeker.id);
        console.log('🔍 Legacy storage search result:', legacyAdmin ? 'FOUND' : 'NOT FOUND');
        
        if (legacyAdmin) {
          // Convert legacy format to main format for editing
          existingAdmin = {
            id: legacyAdmin.id,
            name: legacyAdmin.adminName,
            adminName: legacyAdmin.adminName,
            email: legacyAdmin.adminEmail,
            adminEmail: legacyAdmin.adminEmail,
            contactNumber: '', // AdminRecord doesn't have this field
            userId: '', // AdminRecord doesn't have this field
            password: '', // Don't populate password for security
            organizationId: seeker.organizationId,
            organizationName: seeker.organizationName,
            sourceSeekerId: seeker.id,
            createdAt: legacyAdmin.createdAt,
            adminCreatedAt: legacyAdmin.createdAt,
            role: 'administrator',
            isActive: true
          };
          console.log('🔍 Found in legacy storage and converted:', legacyAdmin.adminName);
        }
      }
    } catch (error) {
      console.error('❌ Error checking for existing administrator:', error);
    }
    
    if (existingAdmin) {
      console.log('✅ Found existing administrator:', existingAdmin.name || existingAdmin.adminName);
      setExistingAdmin(existingAdmin);
    } else {
      console.log('❌ No existing administrator found');
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


  const handleRefresh = () => {
    setSeekers([]);
    setError(null);
    // Trigger reload by re-running the effect
    window.location.reload();
  };

  // Create approval handlers object
  const approvalHandlers: ApprovalHandlers = {
    onApproval: handleApproval,
    onReject: handleRejectClick,
    onReapprove: handleReapproveClick,
    onCreateAdmin: handleCreateAdministrator
  };

  // Create processing states object
  const processingStates: ProcessingStates = {
    processingApproval,
    processingAdmin
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
      <StatusDiagnosticPanel />

      <SeekersList 
        seekers={seekers} 
        handlers={approvalHandlers} 
        processing={processingStates}
        onRefresh={handleRefresh}
      />
      
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
