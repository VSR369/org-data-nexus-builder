
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import SimpleMembershipUpgrade from './SimpleMembershipUpgrade';

interface OrganizationData {
  country?: string;
  organization_type?: string;
  entity_type?: string;
  [key: string]: any;
}

interface MembershipEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  organizationData?: OrganizationData;
  onPaymentSuccess: () => void;
}

export const MembershipEditModal: React.FC<MembershipEditModalProps> = ({
  isOpen,
  onClose,
  userId,
  organizationData,
  onPaymentSuccess
}) => {
  const handlePaymentSuccess = () => {
    onPaymentSuccess();
    onClose();
  };

  // Ensure we have the necessary organization data for membership fee lookup
  const enhancedOrganizationData = {
    country: organizationData?.country || organizationData?.original_profile?.country,
    organization_type: organizationData?.organization_type || organizationData?.original_profile?.organization_type,
    entity_type: organizationData?.entity_type || organizationData?.original_profile?.entity_type,
    ...organizationData
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Activate Premium Membership
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <SimpleMembershipUpgrade
            userId={userId}
            organizationData={enhancedOrganizationData}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
