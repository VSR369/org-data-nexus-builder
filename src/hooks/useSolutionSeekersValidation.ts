import { useState, useEffect, useCallback } from 'react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { useToast } from "@/hooks/use-toast";
import { approvalStatusService, type ApprovalRecord } from '@/services/ApprovalStatusService';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import type { SeekerDetails } from '@/components/master-data/solution-seekers/types';
import { EngagementValidator } from '@/utils/engagementValidator';

export const useSolutionSeekersValidation = () => {
  const [seekers, setSeekers] = useState<SeekerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingApproval, setProcessingApproval] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    value: approvalStatuses,
    setValue: setApprovalStatuses,
    loading: approvalsLoading
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

  const syncApprovalStatuses = useCallback((seekersList: SeekerDetails[]): SeekerDetails[] => {
    if (approvalsLoading) return seekersList;
    
    return seekersList.map(seeker => {
      const approval = approvalStatuses.find(a => a.seekerId === seeker.id);
      return {
        ...seeker,
        approvalStatus: approval ? approval.status : 'pending'
      };
    });
  }, [approvalStatuses, approvalsLoading]);

  const loadSeekers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await unifiedUserStorageService.initialize();
      const allUsers = await unifiedUserStorageService.getAllUsers();
      
      let solutionSeekers = allUsers.filter(user => {
        const isSolutionSeeker = user.entityType?.toLowerCase().includes('solution') ||
                               user.entityType?.toLowerCase().includes('seeker') ||
                               user.entityType === 'solution-seeker' ||
                               user.entityType === 'Solution Seeker';
        
        const isOrgSeeker = user.organizationType?.toLowerCase().includes('seeker');
        
        // Show all solution seekers regardless of engagement details
        // Engagement validation will be enforced at approval/rejection time
        return isSolutionSeeker || isOrgSeeker;
      }) as SeekerDetails[];
      
      console.log('✅ Solution seekers found (before engagement filter):', solutionSeekers.length);
      
      // Log engagement status for each seeker for debugging
      solutionSeekers.forEach(seeker => {
        const engagementValidation = EngagementValidator.validateSeekerEngagement(
          seeker.id, seeker.organizationId, seeker.organizationName
        );
        console.log(`🔍 ${seeker.organizationName}: engagement=${engagementValidation.hasEngagementModel}, pricing=${engagementValidation.hasPricing}`);
      });
      
      solutionSeekers = solutionSeekers.map(seeker => ({
        ...seeker,
        approvalStatus: 'pending' as const,
        hasAdministrator: false
      }));
      
      setSeekers(syncApprovalStatuses(solutionSeekers));
    } catch (err: any) {
      setError(err.message || 'Failed to load solution seekers.');
    } finally {
      setLoading(false);
    }
  }, [syncApprovalStatuses]);

  const handleApproval = async (seekerId: string, status: 'approved' | 'rejected', reason?: string, documents?: File[]) => {
    setProcessingApproval(seekerId);
    
    try {
      const approvalRecord: ApprovalRecord = {
        seekerId,
        status,
        reason: reason || '',
        processedAt: new Date().toISOString(),
        processedBy: 'admin',
        documents: documents ? documents.map(file => ({ name: file.name, size: file.size, type: file.type })) : []
      };
      
      const updatedApprovals = approvalStatuses.filter(a => a.seekerId !== seekerId);
      updatedApprovals.push(approvalRecord);
      setApprovalStatuses(updatedApprovals);
      
      toast({
        title: status === 'approved' ? "✅ Seeker Approved" : "❌ Seeker Rejected",
        description: `Seeker has been ${status} successfully.`,
        variant: status === 'approved' ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to update approval status.",
        variant: "destructive"
      });
    } finally {
      setProcessingApproval(null);
    }
  };

  useEffect(() => {
    if (!approvalsLoading) {
      loadSeekers();
    }
  }, [approvalsLoading, loadSeekers]);

  const refresh = () => {
    setSeekers([]);
    setError(null);
    loadSeekers();
  };

  return {
    seekers,
    loading,
    error,
    processingApproval,
    handleApproval,
    refresh
  };
};