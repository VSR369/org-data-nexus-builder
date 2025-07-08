import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { SeekerDetails, ApprovalHandlers, ProcessingStates } from './types';
import { loadEngagementPricingDetails } from './utils/viewDetailsHelpers';
import OrganizationInfoSection from './components/OrganizationInfoSection';
import PaymentDetailsSection from './components/PaymentDetailsSection';
import ApprovalActionsSection from './components/ApprovalActionsSection';

interface ViewDetailsDialogProps {
  seeker: SeekerDetails;
  handlers: ApprovalHandlers;
  processing: ProcessingStates;
  onSeekerUpdate?: (updatedSeeker: SeekerDetails) => void;
}

const ViewDetailsDialog: React.FC<ViewDetailsDialogProps> = ({ seeker, handlers, processing, onSeekerUpdate }) => {
  const [currentSeeker, setCurrentSeeker] = React.useState(seeker);
  const isMobile = useIsMobile();
  const { membershipData, pricingData, adminExists } = loadEngagementPricingDetails(currentSeeker);
  
  // Update local seeker state when prop changes and notify parent
  React.useEffect(() => {
    console.log('🔄 ViewDetailsDialog: Seeker prop changed, updating local state', {
      newStatus: seeker.approvalStatus,
      currentStatus: currentSeeker.approvalStatus,
      seekerName: seeker.organizationName
    });
    setCurrentSeeker(seeker);
  }, [seeker, currentSeeker.approvalStatus]);
  
  console.log('👁️ ViewDetailsDialog rendering for seeker:', currentSeeker.organizationName, 'Approval Status:', currentSeeker.approvalStatus);
  
  const handleApprovalWithConfirmation = async (status: 'approved' | 'rejected') => {
    // Prevent double-clicks during processing
    if (processing.processingApproval === currentSeeker.id) {
      console.log('⏳ Already processing approval for seeker:', currentSeeker.organizationName);
      return;
    }

    // Show confirmation dialog for approval only
    if (status === 'approved') {
      const confirmed = window.confirm(
        `Are you sure you want to approve ${currentSeeker.organizationName}?\n\nThis will allow them to create an administrator account.`
      );
      
      if (!confirmed) {
        console.log('❌ User cancelled approval action for:', currentSeeker.organizationName);
        return;
      }
    }
    
    try {
      console.log('🔄 ViewDetailsDialog: Starting approval process for status:', status);
      
      // Call the handler and wait for completion
      await handlers.onApproval(currentSeeker.id, status);
      
      // Update local state immediately for responsive UI
      const updatedSeeker = {
        ...currentSeeker,
        approvalStatus: status,
        updatedAt: new Date().toISOString()
      };
      
      setCurrentSeeker(updatedSeeker);
      
      // Notify parent component of the update
      if (onSeekerUpdate) {
        onSeekerUpdate(updatedSeeker);
      }
      
      console.log('✅ ViewDetailsDialog: Approval completed successfully, local state updated');
      
    } catch (error) {
      console.error('❌ ViewDetailsDialog: Approval failed:', error);
      // State will be reverted by the hook's error handling
    }
  };
  
  return (
    <DialogContent className={isMobile 
      ? "w-[95vw] max-h-[85vh] overflow-y-auto p-3 m-2" 
      : "max-w-6xl w-[90vw] max-h-[85vh] overflow-y-auto p-6"
    }>
      <DialogHeader className={isMobile ? "pb-3" : "pb-6"}>
        <DialogTitle className={`flex items-center gap-2 ${isMobile ? "text-lg" : "text-xl"}`}>
          <Users className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
          <span className={isMobile ? "truncate" : ""}>{seeker.organizationName} - Detailed View</span>
        </DialogTitle>
      </DialogHeader>
      
      <div className={`space-y-${isMobile ? "4" : "6"} pb-4`}>
        <OrganizationInfoSection seeker={currentSeeker} isMobile={isMobile} />
        
        <PaymentDetailsSection 
          membershipData={membershipData} 
          pricingData={pricingData}
          isMobile={isMobile}
        />

        <ApprovalActionsSection 
          seeker={currentSeeker}
          handlers={handlers}
          processing={processing}
          adminExists={adminExists}
          onApprovalWithConfirmation={handleApprovalWithConfirmation}
          isMobile={isMobile}
        />
      </div>
    </DialogContent>
  );
};

export default ViewDetailsDialog;