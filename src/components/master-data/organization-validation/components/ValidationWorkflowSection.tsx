import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  DollarSign,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { useValidationWorkflow } from '../hooks/useValidationWorkflow';
import AdminCredentialsDisplay from './AdminCredentialsDisplay';

interface ValidationWorkflowSectionProps {
  organizationId: string;
  organization: any;
  isNonCommercial: boolean;
}

const ValidationWorkflowSection: React.FC<ValidationWorkflowSectionProps> = ({
  organizationId,
  organization,
  isNonCommercial
}) => {
  const { 
    loading, 
    validationStatus, 
    adminCredentials,
    fetchValidationStatus, 
    updateValidationStatus,
    createAdministrator,
    clearAdminCredentials
  } = useValidationWorkflow(organizationId);

  const [actionReason, setActionReason] = useState('');
  const [adminData, setAdminData] = useState({
    admin_name: '',
    admin_email: ''
  });

  useEffect(() => {
    fetchValidationStatus();
  }, [organizationId]);

  const handleValidationAction = async (action: string) => {
    if (!actionReason.trim() && (action === 'rejected' || action === 'declined')) {
      alert('Please provide a reason for declining/rejecting');
      return;
    }

    const success = await updateValidationStatus({
      action,
      notes: actionReason.trim() || undefined
    });

    if (success) {
      setActionReason('');
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminData.admin_name.trim() || !adminData.admin_email.trim()) {
      alert('Please provide both admin name and email');
      return;
    }

    const success = await createAdministrator(adminData);
    if (success) {
      setAdminData({ admin_name: '', admin_email: '' });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!validationStatus) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Loading Validation Status</h3>
            <p className="text-muted-foreground">
              Please wait while we fetch the validation status...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Credentials Display - Show at the top when available */}
      {adminCredentials && (
        <AdminCredentialsDisplay 
          credentials={adminCredentials}
          onClose={clearAdminCredentials}
        />
      )}

      {/* Organization Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Organization Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(validationStatus.status)}
              <span className="font-medium">Status</span>
              <Badge className={getStatusColor(validationStatus.status)}>
                {validationStatus.status}
              </Badge>
            </div>
          </div>

          {/* Organization details */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p><strong>Organization:</strong> {validationStatus.organization_name}</p>
            <p><strong>Organization ID:</strong> {validationStatus.organization_id}</p>
            <p><strong>Admin Exists:</strong> {validationStatus.has_admin ? 'Yes' : 'No'}</p>
            {organization.mem_payment_amount && (
              <>
                <p><strong>Payment Amount:</strong> {organization.mem_payment_currency} {organization.mem_payment_amount}</p>
                <p><strong>Payment Date:</strong> {organization.mem_payment_date || 'N/A'}</p>
              </>
            )}
          </div>

          {/* Validation actions */}
          {validationStatus.status === 'pending' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="validation-reason">Validation Notes</Label>
                <Textarea
                  id="validation-reason"
                  placeholder="Enter reason for approval/rejection..."
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleValidationAction('approved')}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Organization
                </Button>
                <Button 
                  onClick={() => handleValidationAction('rejected')}
                  disabled={loading || !actionReason.trim()}
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Organization
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Administrator Creation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Administrator Creation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {validationStatus.has_admin ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <Clock className="h-4 w-4 text-yellow-600" />
              }
              <span className="font-medium">Administrator Status</span>
              <Badge className={validationStatus.has_admin ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {validationStatus.has_admin ? 'Created' : 'Pending'}
              </Badge>
            </div>
          </div>

          {/* Admin creation form */}
          {!validationStatus.has_admin && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Administrator Name</Label>
                <Input
                  id="admin-name"
                  placeholder="Enter administrator name..."
                  value={adminData.admin_name}
                  onChange={(e) => setAdminData(prev => ({ ...prev, admin_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Administrator Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter administrator email..."
                  value={adminData.admin_email}
                  onChange={(e) => setAdminData(prev => ({ ...prev, admin_email: e.target.value }))}
                />
              </div>
              <Button 
                onClick={handleCreateAdmin}
                disabled={loading || !adminData.admin_name.trim() || !adminData.admin_email.trim()}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Administrator Account
              </Button>
            </div>
          )}

          {/* Status messages */}
          {validationStatus.has_admin && (
            <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
              <p className="text-sm">
                <strong>Administrator Created:</strong> Administrator account has been successfully created and is ready for use.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationWorkflowSection;