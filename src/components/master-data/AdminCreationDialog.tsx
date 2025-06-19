
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Eye, EyeOff } from 'lucide-react';
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
}

const adminSchema = z.object({
  adminName: z.string().min(2, "Administrator name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  userId: z.string().min(3, "User ID must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type AdminFormData = z.infer<typeof adminSchema>;

const AdminCreationDialog: React.FC<AdminCreationDialogProps> = ({
  open,
  onOpenChange,
  seeker,
  onAdminCreated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      adminName: seeker.contactPersonName || '',
      email: seeker.email || '',
      contactNumber: '',
      userId: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: AdminFormData) => {
    setIsSubmitting(true);
    
    try {
      // Check if user ID already exists
      const existingAdmins = JSON.parse(localStorage.getItem('created_administrators') || '[]');
      const userIdExists = existingAdmins.some((admin: any) => admin.userId === data.userId);
      
      if (userIdExists) {
        form.setError('userId', { message: 'User ID already exists' });
        setIsSubmitting(false);
        return;
      }

      // Create administrator data
      const adminData = {
        id: `admin_${Date.now()}`,
        adminName: data.adminName,
        email: data.email,
        contactNumber: data.contactNumber,
        userId: data.userId,
        password: data.password, // In production, this should be hashed
        role: 'administrator',
        organizationId: seeker.organizationId,
        organizationName: seeker.organizationName,
        sourceSeekerId: seeker.id,
        createdAsAdmin: true,
        adminCreatedAt: new Date().toISOString(),
        adminCreatedBy: 'system',
        status: 'active'
      };

      // Save to localStorage
      const updatedAdmins = [...existingAdmins, adminData];
      localStorage.setItem('created_administrators', JSON.stringify(updatedAdmins));

      // Also create a simplified version for the seeker record
      const seekerAdminLink = {
        seekerId: seeker.id,
        adminId: adminData.id,
        adminUserId: data.userId,
        createdAt: new Date().toISOString()
      };
      
      const existingLinks = JSON.parse(localStorage.getItem('seeker_admin_links') || '[]');
      existingLinks.push(seekerAdminLink);
      localStorage.setItem('seeker_admin_links', JSON.stringify(existingLinks));

      // Call the callback to update the parent component
      onAdminCreated(adminData);

      toast({
        title: "Administrator Created Successfully",
        description: `Administrator ${data.adminName} has been created for ${seeker.organizationName}.`,
      });

      // Reset form and close dialog
      form.reset();
      onOpenChange(false);

    } catch (error) {
      console.error('Error creating administrator:', error);
      toast({
        title: "Error",
        description: "Failed to create administrator. Please try again.",
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
            <UserPlus className="h-5 w-5" />
            Create Administrator for {seeker.organizationName}
          </DialogTitle>
        </DialogHeader>

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
                {isSubmitting ? 'Creating...' : 'Create Administrator'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCreationDialog;
