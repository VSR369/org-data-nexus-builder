
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import SimpleMembershipUpgrade from './SimpleMembershipUpgrade';

interface MembershipEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  organizationData?: any;
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
            organizationData={organizationData}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
