import type { UserRecord } from '@/services/types';

export interface SeekerDetails extends UserRecord {
  approvalStatus: 'pending' | 'approved' | 'rejected';
  membershipStatus?: 'active' | 'inactive' | 'not-member';
  hasAdministrator?: boolean;
  administratorId?: string;
}

export interface ApprovalHandlers {
  onApproval: (seekerId: string, status: 'approved' | 'rejected', reason?: string, documents?: File[]) => Promise<void>;
  onReject: (seeker: SeekerDetails) => void;
  onReapprove: (seeker: SeekerDetails) => void;
  onCreateAdmin: (seeker: SeekerDetails) => void;
}

export interface ProcessingStates {
  processingApproval: string | null;
  processingAdmin: string | null;
}