
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import ActiveMemberDetailsView from '@/components/master-data/solution-seekers/components/ActiveMemberDetailsView';

interface MembershipViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  membershipData: any;
  engagementData?: any;
}

export const MembershipViewModal: React.FC<MembershipViewModalProps> = ({
  isOpen,
  onClose,
  membershipData,
  engagementData
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Membership Details - View Only
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
          <ActiveMemberDetailsView 
            membershipData={membershipData}
            engagementData={engagementData}
            isMobile={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
