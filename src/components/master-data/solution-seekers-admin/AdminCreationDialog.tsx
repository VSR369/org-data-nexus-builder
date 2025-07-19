import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, User, Mail, Phone, Building2, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { OrganizationDataService } from '@/services/OrganizationDataService';
import { type SolutionSeekerData, type OrganizationSummary } from './types';

interface AdminCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  seeker: SolutionSeekerData;
  onAdminCreated: () => void;
}

const AdminCreationDialog: React.FC<AdminCreationDialogProps> = ({
  isOpen,
  onClose,
  seeker,
  onAdminCreated
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [orgSummary, setOrgSummary] = useState<OrganizationSummary | null>(null);
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
    if (isOpen && seeker) {
      loadOrganizationSummary();
    }
  }, [isOpen, seeker]);

  const loadOrganizationSummary = async () => {
    try {
      setLoadingData(true);
      console.log('📋 Loading organization summary for:', seeker.organization_id);
      
      const summary = await OrganizationDataService.getSeekerForAdminCreation(seeker.organization_id);
      setOrgSummary(summary);
      
      // Pre-fill form with organization contact info
      setFormData(prev => ({
        ...prev,
        admin_name: seeker.contact_person_name || '',
        admin_email: seeker.email || '',
        contact_number: seeker.phone_number || ''
      }));
      
      console.log('✅ Organization summary loaded successfully');
    } catch (error) {
      console.error('❌ Error loading organization summary:', error);
      toast({
        title: "Error",
        description: "Failed to load organization details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // NO VALIDATION - Just save whatever is provided
  const handleCreateAdmin = async () => {
    try {
      setLoading(true);
      console.log('🔧 Starting admin creation process (no validation)...');
      
      // Minimal password processing - just store as-is for testing
      const passwordToStore = formData.password || 'defaultpass123';
      
      const adminId = await OrganizationDataService.createOrganizationAdmin({
        organization_id: seeker.organization_id,
        admin_name: formData.admin_name || 'Test Admin',
        admin_email: formData.admin_email || 'test@example.com',
        contact_number: formData.contact_number || undefined,
        admin_password_hash: passwordToStore, // Store plain text for testing
        organization_name: seeker.organization_name
      });

      console.log('✅ Administrator created successfully with ID:', adminId);

      toast({
        title: "✅ Success",
        description: `Administrator account created for ${formData.admin_name || 'Test Admin'}`,
      });

      onAdminCreated();
      onClose();
    } catch (error) {
      console.error('❌ Error creating administrator:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create administrator account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading organization details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Create Organization Administrator (No Validation Mode)
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

          {/* No Validation Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="font-semibold text-yellow-800">No Validation Mode</span>
            </div>
            <p className="text-sm text-yellow-700">
              All validation checks are disabled. Any data will be saved directly to test functionality.
            </p>
          </div>

          {/* Existing Admin Check */}
          {orgSummary?.existing_admin && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Administrator Already Exists</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                This organization already has an active administrator account. Creating another for testing.
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="font-medium">{orgSummary.existing_admin.admin_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">{orgSummary.existing_admin.admin_email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Admin Creation Form - NO VALIDATION */}
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-semibold">Administrator Account Details (Optional)</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin_name">
                  <User className="h-4 w-4 inline mr-1" />
                  Administrator Name (Optional)
                </Label>
                <Input
                  id="admin_name"
                  value={formData.admin_name}
                  onChange={(e) => handleInputChange('admin_name', e.target.value)}
                  placeholder="Enter administrator name or leave empty"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_email">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address (Optional)
                </Label>
                <Input
                  id="admin_email"
                  value={formData.admin_email}
                  onChange={(e) => handleInputChange('admin_email', e.target.value)}
                  placeholder="Enter email address or leave empty"
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
                placeholder="Enter contact number or leave empty"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password (Optional)</Label>
                <Input
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password or leave empty"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password (Optional)</Label>
                <Input
                  id="confirm_password"
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  placeholder="Confirm password or leave empty"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes about this administrator"
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
              onClick={handleCreateAdmin} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Administrator (No Validation)'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCreationDialog;
