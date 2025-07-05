import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import type { AdminRecord } from '@/services/ApprovalStatusService';
import type { SeekerDetails } from '@/components/master-data/solution-seekers/types';

export const useAdministratorManagement = () => {
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [currentSeekerForAdmin, setCurrentSeekerForAdmin] = useState<SeekerDetails | null>(null);
  const [existingAdmin, setExistingAdmin] = useState<any>(null);
  const [processingAdmin, setProcessingAdmin] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    value: administratorRecords,
    setValue: setAdministratorRecords,
    loading: adminsLoading,
    error: adminsError,
    refresh: refreshAdmins
  } = useLocalStorageState<AdminRecord[]>({
    key: 'administrators',
    defaultValue: [],
    validator: (value): value is AdminRecord[] => Array.isArray(value),
    onError: (error, operation) => {
      console.error(`❌ Administrator records ${operation} error:`, error);
      toast({
        title: "Storage Error",
        description: `Failed to ${operation} administrator records: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Retry mechanism for localStorage operations
  const retryLocalStorageOperation = async (operation: () => boolean, maxRetries: number = 3): Promise<boolean> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} for localStorage operation`);
      
      if (operation()) {
        console.log('✅ localStorage operation succeeded on attempt', attempt);
        return true;
      }
      
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying localStorage operation in ${attempt * 500}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
      }
    }
    
    console.error('❌ localStorage operation failed after', maxRetries, 'attempts');
    return false;
  };

  const handleCreateAdministrator = async (seeker: SeekerDetails) => {
    // Prevent double-clicks during processing
    if (processingAdmin === seeker.id) {
      console.log('⏳ Already processing administrator for seeker:', seeker.organizationName);
      return;
    }

    console.log('👥 Opening administrator creation for seeker:', seeker.organizationName);
    setCurrentSeekerForAdmin(seeker);
    
    // Check if administrator already exists - look in the main storage first
    let existingAdmin = null;
    
    console.log('🔍 SEARCHING FOR EXISTING ADMIN - Seeker ID:', seeker.id, 'Organization:', seeker.organizationName);
    
    try {
      // First, check the main administrators storage (used by login)
      const mainAdminsData = localStorage.getItem('administrators');
      console.log('🔍 Main administrators raw data:', mainAdminsData ? 'Found' : 'Not found');
      
      if (mainAdminsData) {
        const mainAdmins = JSON.parse(mainAdminsData);
        console.log('🔍 Main administrators parsed:', mainAdmins.length, 'total admins');
        mainAdmins.forEach((admin: any, index: number) => {
          console.log(`   Main Admin ${index + 1}:`, {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            sourceSeekerId: admin.sourceSeekerId,
            organizationName: admin.organizationName
          });
        });
        
        existingAdmin = mainAdmins.find((admin: any) => admin.sourceSeekerId === seeker.id);
        console.log('🔍 Main storage search result:', existingAdmin ? 'FOUND' : 'NOT FOUND');
        if (existingAdmin) {
          console.log('✅ Found admin in main storage:', existingAdmin.name);
        }
      }
      
      // If not found in main storage, check the legacy storage
      if (!existingAdmin) {
        console.log('🔍 Checking legacy storage - administratorRecords count:', administratorRecords.length);
        administratorRecords.forEach((admin, index) => {
          console.log(`   Legacy Admin ${index + 1}:`, {
            id: admin.id,
            adminName: admin.adminName,
            adminEmail: admin.adminEmail,
            sourceSeekerId: admin.sourceSeekerId
          });
        });
        
        const legacyAdmin = administratorRecords.find(admin => admin.sourceSeekerId === seeker.id);
        console.log('🔍 Legacy storage search result:', legacyAdmin ? 'FOUND' : 'NOT FOUND');
        
        if (legacyAdmin) {
          // Enhanced conversion from legacy format to main format for editing
          existingAdmin = {
            id: legacyAdmin.id,
            name: legacyAdmin.adminName || '',
            adminName: legacyAdmin.adminName || '',
            email: legacyAdmin.adminEmail || '',
            adminEmail: legacyAdmin.adminEmail || '',
            contactNumber: '',
            userId: legacyAdmin.adminId || '',
            adminId: legacyAdmin.adminId || '',
            password: '',
            organizationId: seeker.organizationId || `org_${seeker.id}`,
            organizationName: seeker.organizationName,
            sourceSeekerId: legacyAdmin.sourceSeekerId,
            createdAt: legacyAdmin.createdAt || new Date().toISOString(),
            isActive: true,
            role: 'administrator',
            adminCreatedBy: 'system'
          };
          console.log('✅ Converted legacy admin for editing:', {
            name: existingAdmin.name,
            email: existingAdmin.email,
            userId: existingAdmin.userId,
            contactNumber: existingAdmin.contactNumber
          });
        }
      }
    } catch (error) {
      console.error('❌ Error checking for existing administrator:', error);
    }
    
    if (existingAdmin) {
      console.log('✅ Found existing administrator:', existingAdmin.name || existingAdmin.adminName);
      setExistingAdmin(existingAdmin);
    } else {
      console.log('❌ No existing administrator found');
      setExistingAdmin(null);
    }
    
    setAdminDialogOpen(true);
  };

  const handleAdminCreated = async (adminData: any) => {
    console.log('👥 Processing admin creation with synchronized state for seeker:', currentSeekerForAdmin?.organizationName, 'Admin data:', adminData);
    
    // Set loading state
    if (currentSeekerForAdmin) {
      setProcessingAdmin(currentSeekerForAdmin.id);
    }
    
    try {
      // Show loading toast
      toast({
        title: "Processing...",
        description: `${existingAdmin ? 'Updating' : 'Creating'} administrator. Please wait...`,
      });

      // Create administrator record
      const adminRecord: AdminRecord = {
        id: adminData.id,
        sourceSeekerId: currentSeekerForAdmin?.id || '',
        adminId: adminData.adminId,
        adminName: adminData.adminName,
        adminEmail: adminData.adminEmail,
        createdAt: new Date().toISOString()
      };
      
      // Update administrator records using synchronized hook with retry mechanism
      const updatedAdmins = administratorRecords.filter(admin => admin.sourceSeekerId !== adminRecord.sourceSeekerId);
      updatedAdmins.push(adminRecord);
      
      const saveSuccess = await retryLocalStorageOperation(() => setAdministratorRecords(updatedAdmins));
      
      if (!saveSuccess) {
        console.error('❌ Failed to save administrator after retries');
        toast({
          title: "Storage Error",
          description: "Failed to save administrator after multiple attempts. localStorage may be full, disabled, or corrupted. Please try again or contact support.",
          variant: "destructive"
        });
        return;
      }
      
      // Component state will automatically sync via useEffect
      console.log('✅ Administrator record saved, component state will auto-sync');
      
      toast({
        title: existingAdmin ? "✅ Administrator Updated" : "✅ Administrator Created",
        description: `Administrator ${adminData.adminName} has been successfully ${existingAdmin ? 'updated' : 'created'}. Status synchronized across sessions.`,
      });
      
    } catch (error) {
      console.error('❌ Exception during synchronized admin creation processing:', error);
      toast({
        title: "Processing Error",
        description: `Failed to process administrator: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      // Clear loading state
      setProcessingAdmin(null);
    }
  };

  return {
    adminDialogOpen,
    setAdminDialogOpen,
    currentSeekerForAdmin,
    setCurrentSeekerForAdmin,
    existingAdmin,
    setExistingAdmin,
    processingAdmin,
    administratorRecords,
    adminsLoading,
    handleCreateAdministrator,
    handleAdminCreated
  };
};