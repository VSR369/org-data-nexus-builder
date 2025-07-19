import { LocalStorageManager } from '@/utils/storage/LocalStorageManager';

export interface ApprovalRecord {
  seekerId: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  processedAt: string;
  processedBy: string;
  documents?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

export interface AdminRecord {
  id: string;
  sourceSeekerId: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  createdAt: string;
}

class ApprovalStatusService {
  private approvalManager: LocalStorageManager<ApprovalRecord[]>;
  private adminManager: LocalStorageManager<AdminRecord[]>;
  private documentManager: LocalStorageManager<any[]>;

  constructor() {
    // Initialize storage managers with proper validation and error handling
    this.approvalManager = new LocalStorageManager<ApprovalRecord[]>({
      key: 'seeker_approvals',
      version: 1,
      defaultData: [],
      enableBackup: true,
      validateData: (data) => Array.isArray(data)
    });

    this.adminManager = new LocalStorageManager<AdminRecord[]>({
      key: 'created_administrators',
      version: 1,
      defaultData: [],
      enableBackup: true,
      validateData: (data) => Array.isArray(data)
    });

    this.documentManager = new LocalStorageManager<any[]>({
      key: 'seeker_documents',
      version: 1,
      defaultData: [],
      enableBackup: true,
      validateData: (data) => Array.isArray(data)
    });
  }

  /**
   * Save approval/rejection status with comprehensive error handling
   */
  async saveApprovalStatus(record: Omit<ApprovalRecord, 'processedAt' | 'processedBy'>): Promise<boolean> {
    console.log('🔄 ApprovalStatusService: Saving approval status for seeker:', record.seekerId, 'Status:', record.status);
    
    try {
      // Load existing approvals
      const existingResult = this.approvalManager.load();
      if (!existingResult.success) {
        console.error('❌ Failed to load existing approvals:', existingResult.error);
        return false;
      }

      const existingApprovals = existingResult.data || [];
      
      // Create the complete record
      const completeRecord: ApprovalRecord = {
        ...record,
        processedAt: new Date().toISOString(),
        processedBy: 'admin'
      };

      // Remove any existing record for this seeker and add the new one
      const updatedApprovals = existingApprovals.filter(a => a.seekerId !== record.seekerId);
      updatedApprovals.push(completeRecord);

      // Save with error handling
      const saveResult = this.approvalManager.save(updatedApprovals);
      
      if (saveResult.success) {
        console.log('✅ ApprovalStatusService: Successfully saved approval status:', completeRecord);
        
        // Verify the save worked by reading it back
        const verifyResult = this.approvalManager.load();
        if (verifyResult.success) {
          const verifyRecord = verifyResult.data?.find(a => a.seekerId === record.seekerId);
          console.log('🔍 ApprovalStatusService: Verification - Status saved correctly:', verifyRecord);
          return true;
        } else {
          console.error('❌ ApprovalStatusService: Verification failed:', verifyResult.error);
          return false;
        }
      } else {
        console.error('❌ ApprovalStatusService: Failed to save approval status:', saveResult.error);
        return false;
      }
    } catch (error) {
      console.error('❌ ApprovalStatusService: Exception during save:', error);
      return false;
    }
  }

  /**
   * Load approval status for a specific seeker
   */
  getApprovalStatus(seekerId: string): ApprovalRecord | null {
    console.log('📤 ApprovalStatusService: Loading approval status for seeker:', seekerId);
    
    try {
      const result = this.approvalManager.load();
      if (!result.success) {
        console.error('❌ ApprovalStatusService: Failed to load approvals:', result.error);
        return null;
      }

      const approvals = result.data || [];
      const approval = approvals.find(a => a.seekerId === seekerId);
      
      console.log('🔍 ApprovalStatusService: Found approval status:', approval || 'No status found');
      return approval || null;
    } catch (error) {
      console.error('❌ ApprovalStatusService: Exception during load:', error);
      return null;
    }
  }

  /**
   * Load all approval statuses
   */
  getAllApprovalStatuses(): ApprovalRecord[] {
    console.log('📤 ApprovalStatusService: Loading all approval statuses');
    
    try {
      const result = this.approvalManager.load();
      if (!result.success) {
        console.error('❌ ApprovalStatusService: Failed to load all approvals:', result.error);
        return [];
      }

      const approvals = result.data || [];
      console.log('✅ ApprovalStatusService: Loaded', approvals.length, 'approval records');
      return approvals;
    } catch (error) {
      console.error('❌ ApprovalStatusService: Exception during load all:', error);
      return [];
    }
  }

  /**
   * Save administrator record
   */
  async saveAdministrator(admin: AdminRecord): Promise<boolean> {
    console.log('👥 ApprovalStatusService: Saving administrator for seeker:', admin.sourceSeekerId);
    
    try {
      const existingResult = this.adminManager.load();
      if (!existingResult.success) {
        console.error('❌ Failed to load existing administrators:', existingResult.error);
        return false;
      }

      const existingAdmins = existingResult.data || [];
      
      // Remove any existing admin for this seeker and add the new one
      const updatedAdmins = existingAdmins.filter(a => a.sourceSeekerId !== admin.sourceSeekerId);
      updatedAdmins.push(admin);

      const saveResult = this.adminManager.save(updatedAdmins);
      
      if (saveResult.success) {
        console.log('✅ ApprovalStatusService: Successfully saved administrator:', admin);
        return true;
      } else {
        console.error('❌ ApprovalStatusService: Failed to save administrator:', saveResult.error);
        return false;
      }
    } catch (error) {
      console.error('❌ ApprovalStatusService: Exception during admin save:', error);
      return false;
    }
  }

  /**
   * Check if administrator exists for seeker
   */
  getAdministrator(sourceSeekerId: string): AdminRecord | null {
    console.log('👥 ApprovalStatusService: Looking for administrator for seeker:', sourceSeekerId);
    
    try {
      const result = this.adminManager.load();
      if (!result.success) {
        console.error('❌ ApprovalStatusService: Failed to load administrators:', result.error);
        return null;
      }

      const admins = result.data || [];
      const admin = admins.find(a => a.sourceSeekerId === sourceSeekerId);
      
      console.log('🔍 ApprovalStatusService: Found administrator:', admin || 'No admin found');
      return admin || null;
    } catch (error) {
      console.error('❌ ApprovalStatusService: Exception during admin lookup:', error);
      return null;
    }
  }

  /**
   * Save documents with error handling
   */
  async saveDocuments(seekerId: string, documents: File[]): Promise<boolean> {
    if (!documents || documents.length === 0) return true;
    
    console.log('📄 ApprovalStatusService: Saving', documents.length, 'documents for seeker:', seekerId);
    
    try {
      const existingResult = this.documentManager.load();
      if (!existingResult.success) {
        console.error('❌ Failed to load existing documents:', existingResult.error);
        return false;
      }

      const existingDocs = existingResult.data || [];
      
      // Convert files to storable format
      const documentData = {
        seekerId,
        documents: await Promise.all(documents.map(async (file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          data: await file.arrayBuffer(),
          uploadedAt: new Date().toISOString()
        })))
      };

      // Remove existing docs for this seeker and add new ones
      const updatedDocs = existingDocs.filter((doc: any) => doc.seekerId !== seekerId);
      updatedDocs.push(documentData);

      const saveResult = this.documentManager.save(updatedDocs);
      
      if (saveResult.success) {
        console.log('✅ ApprovalStatusService: Successfully saved documents');
        return true;
      } else {
        console.error('❌ ApprovalStatusService: Failed to save documents:', saveResult.error);
        return false;
      }
    } catch (error) {
      console.error('❌ ApprovalStatusService: Exception during document save:', error);
      return false;
    }
  }

  /**
   * Get storage health information
   */
  getStorageHealth() {
    return {
      approvals: this.approvalManager.getHealth(),
      administrators: this.adminManager.getHealth(),
      documents: this.documentManager.getHealth()
    };
  }

  /**
   * Clear all data (for testing/reset purposes)
   */
  clearAllData(): boolean {
    console.log('🗑️ ApprovalStatusService: Clearing all data');
    
    try {
      const results = [
        this.approvalManager.remove(),
        this.adminManager.remove(),
        this.documentManager.remove()
      ];
      
      const success = results.every(r => r);
      console.log(success ? '✅ All data cleared successfully' : '❌ Some data failed to clear');
      return success;
    } catch (error) {
      console.error('❌ ApprovalStatusService: Exception during clear:', error);
      return false;
    }
  }
}

// Export singleton instance
export const approvalStatusService = new ApprovalStatusService();