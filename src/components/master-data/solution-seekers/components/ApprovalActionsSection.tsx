import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX, UserPlus, RefreshCw, RotateCcw } from 'lucide-react';
import type { SeekerDetails, ApprovalHandlers, ProcessingStates } from '../types';

interface ApprovalActionsSectionProps {
  seeker: SeekerDetails;
  handlers: ApprovalHandlers;
  processing: ProcessingStates;
  adminExists: boolean;
  onApprovalWithConfirmation: (status: 'approved' | 'rejected') => Promise<void>;
  isMobile?: boolean;
}

const ApprovalActionsSection: React.FC<ApprovalActionsSectionProps> = ({ 
  seeker, 
  handlers, 
  processing, 
  adminExists, 
  onApprovalWithConfirmation,
  isMobile 
}) => {
  return (
    <div className={`${isMobile ? "space-y-4" : "flex justify-between items-center"} pt-4 border-t`}>
      <div className={`flex items-center gap-2 ${isMobile ? "justify-center" : ""}`}>
        <span className="text-sm font-medium">Approval Status:</span>
        <Badge variant={
          seeker.approvalStatus === 'approved' ? 'default' : 
          seeker.approvalStatus === 'rejected' ? 'destructive' : 'secondary'
        }>
          {seeker.approvalStatus}
        </Badge>
      </div>
      
      <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
        {seeker.approvalStatus === 'pending' && (
          <>
            <Button 
              size={isMobile ? "default" : "sm"}
              variant="outline" 
              className={`text-green-600 border-green-600 hover:bg-green-50 ${isMobile ? "w-full min-h-[44px]" : ""}`}
              onClick={() => onApprovalWithConfirmation('approved')}
              disabled={processing.processingApproval === seeker.id}
            >
              {processing.processingApproval === seeker.id ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <UserCheck className="h-4 w-4 mr-1" />
              )}
              {processing.processingApproval === seeker.id ? 'Processing...' : 'Approve'}
            </Button>
            <Button 
              size={isMobile ? "default" : "sm"}
              variant="outline" 
              className={`text-red-600 border-red-600 hover:bg-red-50 ${isMobile ? "w-full min-h-[44px]" : ""}`}
              onClick={() => handlers.onReject(seeker)}
              disabled={processing.processingApproval === seeker.id}
            >
              <UserX className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </>
        )}
        
        {seeker.approvalStatus === 'rejected' && (
          <Button 
            size={isMobile ? "default" : "sm"}
            variant="outline" 
            className={`text-orange-600 border-orange-600 hover:bg-orange-50 ${isMobile ? "w-full min-h-[44px]" : ""}`}
            onClick={() => handlers.onReapprove(seeker)}
            disabled={processing.processingApproval === seeker.id}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reapprove
          </Button>
        )}
        
        {seeker.approvalStatus === 'approved' && !adminExists && (
          <Button 
            size={isMobile ? "default" : "sm"}
            className={`bg-blue-600 hover:bg-blue-700 ${isMobile ? "w-full min-h-[44px]" : ""}`}
            onClick={() => handlers.onCreateAdmin(seeker)}
            disabled={processing.processingAdmin === seeker.id}
          >
            {processing.processingAdmin === seeker.id ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4 mr-1" />
            )}
            {processing.processingAdmin === seeker.id ? 'Processing...' : 'Create Administrator'}
          </Button>
        )}
        
        {seeker.approvalStatus === 'approved' && adminExists && (
          <Button 
            size={isMobile ? "default" : "sm"}
            variant="outline"
            className={`bg-green-600 hover:bg-green-700 text-white border-green-600 ${isMobile ? "w-full min-h-[44px]" : ""}`}
            onClick={() => handlers.onCreateAdmin(seeker)}
            disabled={processing.processingAdmin === seeker.id}
          >
            {processing.processingAdmin === seeker.id ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <UserCheck className="h-4 w-4 mr-1" />
            )}
            {processing.processingAdmin === seeker.id ? 'Processing...' : 'Edit Administrator'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApprovalActionsSection;