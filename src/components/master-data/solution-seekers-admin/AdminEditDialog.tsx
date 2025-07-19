
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, User, Mail, Phone, Building2, Shield, Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { OrganizationDataService } from '@/services/OrganizationDataService';
import { type SolutionSeekerData, type ExistingAdmin } from './types';

interface AdminEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  seeker: SolutionSeekerData;
  existingAdmin: ExistingAdmin;
  onAdminUpdated: () => void;
}

const AdminEditDialog: React.FC<AdminEditDialogProps> = ({
  isOpen,
  onClose,
  seeker,
  existingAdmin,
  onAdminUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    admin_name: '',
    admin_email: '',
    contact_number: '',
    password: '',
    confirm_password: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && existingAdmin) {
      setFormData({
        admin_name: existingAdmin.admin_name || '',
        admin_email: existingAdmin.admin_email || '',
        contact_number: existingAdmin.contact_number || '',
        password: '',
        confirm_password: '',
        notes: ''
      });
    }
  }, [isOpen, existingAdmin]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.admin_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Administrator name is required",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.admin_email.trim()) {
      toast({
        title: "Validation Error",
        description: "Administrator email is required",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password && formData.password !== formData.confirm_password) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password && formData.password.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleUpdateAdmin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const updateData: any = {
        organization_id: seeker.organization_id,
        admin_name: formData.admin_name,
        admin_email: formData.admin_email,
        contact_number: formData.contact_number || undefined,
        organization_name: seeker.organization_name
      };

      // Only hash password if provided
      if (formData.password.trim()) {
        updateData.admin_password_hash = btoa(formData.password); // Simple base64 encoding for demo
      }
      
      await OrganizationDataService.updateOrganizationAdmin(existingAdmin.id, updateData);

      toast({
        title: "✅ Success",
        description: `Administrator ${formData.admin_name} has been updated successfully`,
      });

      onAdminUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating administrator:', error);
      toast({
        title: "Error",
        description: "Failed to update administrator account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Organization Administrator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Organization Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Organization Details
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{seeker.organization_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono">{seeker.organization_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline">{seeker.overall_status}</Badge>
              </div>
            </div>
          </div>

          {/* Current Admin Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-800">Current Administrator</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Name:</span>
                <span className="font-medium">{existingAdmin.admin_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium">{existingAdmin.admin_email}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={existingAdmin.is_active ? "default" : "secondary"}>
                  {existingAdmin.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />
          
          {/* Edit Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Update Administrator Details</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin_name">
                  <User className="h-4 w-4 inline mr-1" />
                  Administrator Name
                </Label>
                <Input
                  id="admin_name"
                  value={formData.admin_name}
                  onChange={(e) => handleInputChange('admin_name', e.target.value)}
                  placeholder="Enter administrator name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_email">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address
                </Label>
                <Input
                  id="admin_email"
                  type="email"
                  value={formData.admin_email}
                  onChange={(e) => handleInputChange('admin_email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_number">
                <Phone className="h-4 w-4 inline mr-1" />
                Contact Number (Optional)
              </Label>
              <Input
                id="contact_number"
                value={formData.contact_number}
                onChange={(e) => handleInputChange('contact_number', e.target.value)}
                placeholder="Enter contact number"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">New Password (Optional)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Update Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notes about this update"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <Button 
              onClick={handleUpdateAdmin} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Administrator'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEditDialog;
