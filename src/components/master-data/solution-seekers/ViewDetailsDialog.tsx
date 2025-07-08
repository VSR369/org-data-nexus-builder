import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users } from 'lucide-react';
import type { SeekerDetails, ApprovalHandlers, ProcessingStates } from './types';
import { loadEngagementPricingDetails } from './utils/viewDetailsHelpers';
import OrganizationInfoSection from './components/OrganizationInfoSection';
import PaymentDetailsSection from './components/PaymentDetailsSection';
import ApprovalActionsSection from './components/ApprovalActionsSection';

interface ViewDetailsDialogProps {
  seeker: SeekerDetails;
  handlers: ApprovalHandlers;
  processing: ProcessingStates;
}

const ViewDetailsDialog: React.FC<ViewDetailsDialogProps> = ({ seeker, handlers, processing }) => {
  const [currentSeeker, setCurrentSeeker] = React.useState(seeker);
  const { membershipData, pricingData, adminExists } = loadEngagementPricingDetails(currentSeeker);
  
  // Update local seeker state when prop changes
  React.useEffect(() => {
    setCurrentSeeker(seeker);
  }, [seeker]);
  
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
      
      await handlers.onApproval(currentSeeker.id, status);
      
      // Update local state immediately after approval
      setCurrentSeeker(prev => ({
        ...prev,
        approvalStatus: status
      }));
    }
  };
  
  return (
    <DialogContent className="max-w-6xl w-[98vw] max-h-[95vh] overflow-y-auto p-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {seeker.organizationName} - Detailed View
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <OrganizationInfoSection seeker={currentSeeker} />
        
        <PaymentDetailsSection 
          membershipData={membershipData} 
          pricingData={pricingData} 
        />

        <ApprovalActionsSection 
          seeker={currentSeeker}
          handlers={handlers}
          processing={processing}
          adminExists={adminExists}
          onApprovalWithConfirmation={handleApprovalWithConfirmation}
        />
      </div>
    </DialogContent>
  );
};

export default ViewDetailsDialog;