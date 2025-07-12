import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Eye, EyeOff, Edit, AlertTriangle, Key } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

import type { UserRecord } from '@/services/types';

interface SeekerDetails extends UserRecord {
  approvalStatus: 'pending' | 'approved' | 'rejected';
  membershipStatus?: 'active' | 'inactive' | 'not-member';
}

interface AdminCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seeker: SeekerDetails;
  onAdminCreated: (adminData: any) => void;
  existingAdmin?: any;
}

// Simple password validation schema
const adminSchema = z.object({
  adminName: z.string()
    .min(2, "Administrator name must be at least 2 characters")
    .max(50, "Administrator name must not exceed 50 characters"),
  email: z.string()
    .email("Please enter a valid email address")
    .toLowerCase(),
  contactNumber: z.string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must not exceed 15 digits"),
  userId: z.string()
    .min(3, "User ID must be at least 3 characters")
    .max(20, "User ID must not exceed 20 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type AdminFormData = z.infer<typeof adminSchema>;

// Unified Administrator data structure
interface AdminData {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  userId: string;
  password: string; // This will be hashed
  organizationId: string;
  createdAt: string;
  isActive: boolean;
  // Additional tracking fields
  organizationName: string;
  sourceSeekerId: string;
  role: string;
  adminCreatedBy: string;
  lastUpdated?: string;
  updatedBy?: string;
}

// Legacy administrator format for backward compatibility
interface LegacyAdminData {
  id: string;
  adminName: string;
  adminEmail: string;
  email: string;
  contactNumber?: string;
  userId?: string;
  password: string;
  organizationId: string;
  organizationName: string;
  sourceSeekerId: string;
  adminCreatedAt: string;
  adminCreatedBy: string;
  role: string;
  status: string;
  lastUpdated?: string;
  updatedBy?: string;
}

// localStorage operations with enhanced error handling
class AdminStorageManager {
  private static readonly STORAGE_KEY = 'administrators';
  private static readonly BACKUP_KEY = 'administrators_backup';
  private static readonly MAX_RETRIES = 3;

  static async saveAdministrators(administrators: AdminData[]): Promise<{ success: boolean; error?: string }> {
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        // Create backup before saving
        const existing = this.getAdministrators();
        if (existing.length > 0) {
          localStorage.setItem(this.BACKUP_KEY, JSON.stringify(existing));
        }

        // Validate data before saving
        if (!Array.isArray(administrators)) {
          throw new Error('Invalid data format: administrators must be an array');
        }

        const serializedData = JSON.stringify(administrators);
        
        // Check if we have enough storage space
        const testKey = `__storage_test_${Date.now()}`;
        try {
          localStorage.setItem(testKey, serializedData);
          localStorage.removeItem(testKey);
        } catch (e) {
          throw new Error('Storage quota exceeded. Please clear some browser data and try again.');
        }

        localStorage.setItem(this.STORAGE_KEY, serializedData);
        
        // Verify the save was successful
        const verification = localStorage.getItem(this.STORAGE_KEY);
        if (verification !== serializedData) {
          throw new Error('Data verification failed after save');
        }

        console.log(`✅ Successfully saved ${administrators.length} administrators`);
        return { success: true };

      } catch (error) {
        console.error(`❌ Attempt ${attempt}/${this.MAX_RETRIES} failed:`, error);
        
        if (attempt === this.MAX_RETRIES) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown storage error' 
          };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, attempt * 100));
      }
    }
    
    return { success: false, error: 'Maximum retry attempts exceeded' };
  }

  static getAdministrators(): AdminData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      
      // Validate the parsed data
      if (!Array.isArray(parsed)) {
        console.warn('⚠️ Invalid administrator data format, attempting recovery');
        return this.recoverFromBackup();
      }

      // Validate each administrator object
      const validAdmins = parsed.filter(admin => 
        admin && 
        typeof admin === 'object' && 
        admin.id && 
        admin.name && 
        admin.email && 
        admin.userId
      );

      if (validAdmins.length !== parsed.length) {
        console.warn(`⚠️ Filtered out ${parsed.length - validAdmins.length} invalid administrator records`);
      }

      return validAdmins;

    } catch (error) {
      console.error('❌ Error reading administrators:', error);
      return this.recoverFromBackup();
    }
  }

  static recoverFromBackup(): AdminData[] {
    try {
      console.log('🔄 Attempting to recover from backup...');
      const backup = localStorage.getItem(this.BACKUP_KEY);
      if (!backup) {
        console.log('📭 No backup available');
        return [];
      }

      const parsed = JSON.parse(backup);
      if (Array.isArray(parsed)) {
        console.log('✅ Successfully recovered from backup');
        // Restore the main data from backup
        localStorage.setItem(this.STORAGE_KEY, backup);
        return parsed;
      }
    } catch (error) {
      console.error('❌ Backup recovery failed:', error);
    }
    
    return [];
  }

  static checkForDuplicates(email: string, userId: string, excludeId?: string): { emailExists: boolean; userIdExists: boolean } {
    const administrators = this.getAdministrators();
    
    const emailExists = administrators.some(admin => 
      admin.email.toLowerCase() === email.toLowerCase() && admin.id !== excludeId
    );
    
    const userIdExists = administrators.some(admin => 
      admin.userId === userId && admin.id !== excludeId
    );

    return { emailExists, userIdExists };
  }

}

const AdminCreationDialog: React.FC<AdminCreationDialogProps> = ({
  open,
  onOpenChange,
  seeker,
  onAdminCreated,
  existingAdmin
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { toast } = useToast();

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      adminName: '',
      email: '',
      contactNumber: '',
      userId: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Update form when dialog opens - fix form population
  useEffect(() => {
    console.log('🔄 FORM EFFECT TRIGGERED - Open:', open, 'ExistingAdmin:', !!existingAdmin);
    
    if (open) {
      if (existingAdmin) {
        setIsEditMode(true);
        console.log('✏️ EDIT MODE - Raw admin data:', JSON.stringify(existingAdmin, null, 2));
        
        // Extract form data with explicit field mapping
        const formData = {
          adminName: existingAdmin.name || existingAdmin.adminName || '',
          email: existingAdmin.email || existingAdmin.adminEmail || '',
          contactNumber: existingAdmin.contactNumber || '',
          userId: existingAdmin.userId || existingAdmin.adminId || '',
          password: existingAdmin.password || '',
          confirmPassword: existingAdmin.password || ''
        };
        
        console.log('✏️ FORM DATA EXTRACTED:', JSON.stringify(formData, null, 2));
        
        // Reset form with delay to ensure proper population
        setTimeout(() => {
          form.reset(formData);
          console.log('✅ FORM RESET COMPLETED with data:', formData);
        }, 100);
        
      } else {
        setIsEditMode(false);
        console.log('➕ CREATE MODE - Clearing form');
        setTimeout(() => {
          form.reset({
            adminName: '',
            email: '',
            contactNumber: '',
            userId: '',
            password: '',
            confirmPassword: ''
          });
        }, 50);
      }
    }
  }, [open, existingAdmin, form]);

  const onSubmit = async (data: AdminFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('🔄 Starting administrator creation/update process...');

      
      // Check for duplicates first
      const { emailExists, userIdExists } = AdminStorageManager.checkForDuplicates(
        data.email, 
        data.userId, 
        isEditMode ? existingAdmin?.id : undefined
      );

      if (emailExists) {
        form.setError('email', { message: 'Email address already exists' });
        toast({
          title: "Validation Error",
          description: "An administrator with this email address already exists.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (userIdExists) {
        form.setError('userId', { message: 'User ID already exists' });
        toast({
          title: "Validation Error", 
          description: "An administrator with this User ID already exists.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Get current administrators
      const existingAdmins = AdminStorageManager.getAdministrators();
      let adminData: AdminData;
      let updatedAdmins: AdminData[];

      if (isEditMode && existingAdmin) {
        // Update existing administrator
        adminData = {
          ...existingAdmin,
          name: data.adminName,
          email: data.email.toLowerCase(),
          contactNumber: data.contactNumber,
          userId: data.userId,
          password: data.password,
          lastUpdated: new Date().toISOString(),
          updatedBy: 'system'
        };

        // Update the administrator in the array
        updatedAdmins = existingAdmins.map(admin => 
          admin.id === existingAdmin.id ? adminData : admin
        );

        console.log('✏️ Updated existing administrator:', adminData.name);
      } else {
        // Create new administrator with enhanced structure
        adminData = {
          id: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: data.adminName,
          email: data.email.toLowerCase(),
          contactNumber: data.contactNumber,
          userId: data.userId,
          password: data.password,
          organizationId: seeker.organizationId || `org_${seeker.id}`,
          createdAt: new Date().toISOString(),
          isActive: true,
          // Additional tracking fields
          organizationName: seeker.organizationName,
          sourceSeekerId: seeker.id,
          role: 'administrator',
          adminCreatedBy: 'system'
        };

        updatedAdmins = [...existingAdmins, adminData];
        console.log('➕ Created new administrator:', adminData.name);
      }

      // Save to localStorage with enhanced error handling
      console.log('💾 SAVING ADMINISTRATORS - Current admins count:', updatedAdmins.length);
      console.log('💾 SAVING ADMINISTRATORS - Admin being saved:', {
        id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        userId: adminData.userId,
        organizationName: adminData.organizationName
      });
      
      const saveResult = await AdminStorageManager.saveAdministrators(updatedAdmins);
      
      if (!saveResult.success) {
        console.error('❌ SAVE FAILED:', saveResult.error);
        throw new Error(saveResult.error || 'Failed to save administrator data');
      }
      
      console.log('✅ SAVE SUCCESSFUL - Verifying storage...');
      
      // Immediately verify the save worked
      const verification = AdminStorageManager.getAdministrators();
      console.log('🔍 VERIFICATION - Administrators in storage:', verification.length);
      verification.forEach((admin, index) => {
        console.log(`   Admin ${index + 1}:`, {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          userId: admin.userId
        });
      });

      console.log('✅ Administrator saved to single unified storage successfully');

      if (!isEditMode) {
        // Create seeker-admin link for new administrators
        try {
          const seekerAdminLink = {
            seekerId: seeker.id,
            adminId: adminData.id,
            adminUserId: data.userId,
            createdAt: new Date().toISOString()
          };
          
          const existingLinks = JSON.parse(localStorage.getItem('seeker_admin_links') || '[]');
          existingLinks.push(seekerAdminLink);
          localStorage.setItem('seeker_admin_links', JSON.stringify(existingLinks));
        } catch (linkError) {
          console.warn('⚠️ Failed to create seeker-admin link:', linkError);
        }
      }

      // Call the callback to update the parent component
      onAdminCreated(adminData);

      toast({
        title: `✅ Administrator ${isEditMode ? 'Updated' : 'Created'} Successfully`,
        description: `Administrator ${data.adminName} has been ${isEditMode ? 'updated' : 'created'} for ${seeker.organizationName}.`,
      });

      // Reset form and close dialog
      form.reset({
        adminName: '',
        email: '',
        contactNumber: '',
        userId: '',
        password: '',
        confirmPassword: ''
      });
      
      onOpenChange(false);

      console.log('✅ Administrator creation/update process completed successfully');

    } catch (error) {
      console.error('❌ Error during administrator operation:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('quota')) {
          errorMessage = 'Storage space is full. Please clear some browser data and try again.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: `❌ Failed to ${isEditMode ? 'Update' : 'Create'} Administrator`,
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? <Edit className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            {isEditMode ? 'Edit Administrator' : 'Create Administrator'} for {seeker.organizationName}
          </DialogTitle>
        </DialogHeader>

        {/* Show existing admin details when in edit mode */}
        {isEditMode && existingAdmin && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border">
            <h4 className="font-medium text-blue-900 mb-2">Current Administrator Details</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div><span className="font-medium">Name:</span> {existingAdmin.name || existingAdmin.adminName || 'Not provided'}</div>
              <div><span className="font-medium">Email:</span> {existingAdmin.email || existingAdmin.adminEmail || 'Not provided'}</div>
              <div><span className="font-medium">Contact:</span> {existingAdmin.contactNumber || 'Not provided'}</div>
              <div><span className="font-medium">User ID:</span> {existingAdmin.userId || existingAdmin.adminId || 'Not provided'}</div>
              <div><span className="font-medium">Created:</span> {
                existingAdmin.createdAt || existingAdmin.adminCreatedAt 
                  ? new Date(existingAdmin.createdAt || existingAdmin.adminCreatedAt).toLocaleDateString()
                  : 'Not available'
              }</div>
              {(existingAdmin.lastUpdated) && (
                <div><span className="font-medium">Last Updated:</span> {new Date(existingAdmin.lastUpdated).toLocaleDateString()}</div>
              )}
            </div>
          </div>
        )}

        {/* Storage Status Indicator */}
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Security Notice</span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Administrator data will be stored securely. Please keep your password safe.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="adminName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Administrator Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter administrator name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter unique user ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password fields - always show in edit mode */}
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter password"
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="Confirm password"
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditMode ? 'Updating...' : 'Creating...') 
                  : (isEditMode ? 'Update Administrator' : 'Create Administrator')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCreationDialog;
