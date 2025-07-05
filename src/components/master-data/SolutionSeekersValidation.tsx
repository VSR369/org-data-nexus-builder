import React, { useState } from 'react';
import AdminCreationDialog from './AdminCreationDialog';
import RejectionDialog from './RejectionDialog';
import type { SeekerDetails, ApprovalHandlers, ProcessingStates } from './solution-seekers/types';
import StatusDiagnosticPanel from './solution-seekers/StatusDiagnosticPanel';
import SeekersList from './solution-seekers/SeekersList';
import EngagementValidationWarning from './solution-seekers/EngagementValidationWarning';
import ValidationHeader from './solution-seekers/ValidationHeader';
import ValidationLoadingError from './solution-seekers/ValidationLoadingError';
import { useSolutionSeekersValidation } from '@/hooks/useSolutionSeekersValidation';
import SeekerValidationDiagnostic from './solution-seekers/SeekerValidationDiagnostic';
import { useAdministratorManagement } from '@/hooks/useAdministratorManagement';

const SolutionSeekersValidation: React.FC = () => {
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [currentSeekerForRejection, setCurrentSeekerForRejection] = useState<SeekerDetails | null>(null);

  // Use custom hooks for data management
  const { 
    seekers, 
    loading, 
    error, 
    processingApproval, 
    handleApproval, 
    refresh 
  } = useSolutionSeekersValidation();

  const {
    adminDialogOpen,
    setAdminDialogOpen,
    currentSeekerForAdmin,
    existingAdmin,
    processingAdmin,
    handleCreateAdministrator,
    handleAdminCreated
  } = useAdministratorManagement();



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

  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(seekers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "solution_seekers_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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

  // Show loading or error states
  const loadingErrorComponent = (
    <ValidationLoadingError 
      loading={loading} 
      error={error} 
      onRefresh={refresh} 
    />
  );
  
  if (loading || error) {
    return loadingErrorComponent;
  }

  return (
    <div className="container mx-auto p-4">
      <ValidationHeader 
        seekersCount={seekers.length}
        onRefresh={refresh}
        onDownload={handleDownloadData}
      />

      <EngagementValidationWarning />

      <SeekerValidationDiagnostic />

      <StatusDiagnosticPanel />

      <SeekersList 
        seekers={seekers} 
        handlers={approvalHandlers} 
        processing={processingStates}
        onRefresh={refresh}
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
