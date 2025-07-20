import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  FileText, 
  DollarSign,
  AlertTriangle,
  UserPlus,
  Eye
} from 'lucide-react';
import { useValidationWorkflow } from '../hooks/useValidationWorkflow';

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
    fetchValidationStatus, 
    updateValidationStatus,
    createAdministrator 
  } = useValidationWorkflow(organizationId);

  const [actionReason, setActionReason] = useState('');
  const [adminData, setAdminData] = useState({
    admin_name: '',
    admin_email: ''
  });

  useEffect(() => {
    fetchValidationStatus();
  }, [organizationId]);

  const handleValidationAction = async (
    type: 'payment' | 'document' | 'admin_authorization',
    status: string
  ) => {
    if (!actionReason.trim() && (status === 'declined' || status === 'invalid')) {
      alert('Please provide a reason for declining/marking invalid');
      return;
    }

    const success = await updateValidationStatus({
      type,
      status,
      reason: actionReason.trim() || undefined
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
      case 'approved':
      case 'valid':
      case 'authorized':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'declined':
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
      case 'not_ready':
      case 'ready':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'valid':
      case 'authorized':
        return 'bg-green-100 text-green-800';
      case 'declined':
      case 'invalid':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'ready':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_ready':
        return 'bg-gray-100 text-gray-800';
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
      {/* Payment Validation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(validationStatus.validation_status?.payment_validation_status)}
              <span className="font-medium">Payment Status</span>
              <Badge className={getStatusColor(validationStatus.validation_status?.payment_validation_status)}>
                {validationStatus.validation_status?.payment_validation_status || 'pending'}
              </Badge>
            </div>
          </div>

          {/* Display payment information */}
          {organization.mem_payment_amount && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Amount:</strong> {organization.mem_payment_currency} {organization.mem_payment_amount}</p>
              <p><strong>Date:</strong> {organization.mem_payment_date || 'N/A'}</p>
              <p><strong>Method:</strong> {organization.mem_payment_method || 'N/A'}</p>
              <p><strong>Receipt:</strong> {organization.mem_receipt_number || 'N/A'}</p>
            </div>
          )}

          {/* Payment validation actions */}
          {validationStatus.validation_status?.payment_validation_status === 'pending' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="payment-reason">Reason (required for decline)</Label>
                <Textarea
                  id="payment-reason"
                  placeholder="Enter reason for approval/decline..."
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleValidationAction('payment', 'approved')}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Payment
                </Button>
                <Button 
                  onClick={() => handleValidationAction('payment', 'declined')}
                  disabled={loading || !actionReason.trim()}
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline Payment
                </Button>
              </div>
            </div>
          )}

          {/* Show validation reason if exists */}
          {validationStatus.validation_status?.payment_validation_reason && (
            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm">
                <strong>Validation Reason:</strong> {validationStatus.validation_status.payment_validation_reason}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Validation Section (Non-commercial only) */}
      {isNonCommercial && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Validation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(validationStatus.validation_status?.document_validation_status)}
                <span className="font-medium">Document Status</span>
                <Badge className={getStatusColor(validationStatus.validation_status?.document_validation_status)}>
                  {validationStatus.validation_status?.document_validation_status || 'pending'}
                </Badge>
              </div>
            </div>

            {/* Document validation actions */}
            {validationStatus.validation_status?.document_validation_status === 'pending' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="document-reason">Validation Comments</Label>
                  <Textarea
                    id="document-reason"
                    placeholder="Enter comments about document validation..."
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleValidationAction('document', 'valid')}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Valid
                  </Button>
                  <Button 
                    onClick={() => handleValidationAction('document', 'invalid')}
                    disabled={loading || !actionReason.trim()}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Mark Invalid
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Documents
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Organization Documents</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Document viewing functionality would be implemented here.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}

            {/* Show validation reason if exists */}
            {validationStatus.validation_status?.document_validation_reason && (
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm">
                  <strong>Validation Comments:</strong> {validationStatus.validation_status.document_validation_reason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Administrator Authorization Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Administrator Authorization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(validationStatus.validation_status?.admin_authorization_status)}
              <span className="font-medium">Authorization Status</span>
              <Badge className={getStatusColor(validationStatus.validation_status?.admin_authorization_status)}>
                {validationStatus.validation_status?.admin_authorization_status || 'not_ready'}
              </Badge>
            </div>
          </div>

          {/* Prerequisites check */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="font-medium text-sm">Prerequisites:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                {validationStatus.payment_approved ? 
                  <CheckCircle className="h-4 w-4 text-green-600" /> : 
                  <XCircle className="h-4 w-4 text-red-600" />
                }
                Payment Validation
              </div>
              {isNonCommercial && (
                <div className="flex items-center gap-2 text-sm">
                  {validationStatus.document_validated ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-red-600" />
                  }
                  Document Validation
                </div>
              )}
            </div>
          </div>

          {/* Admin creation form */}
          {validationStatus.can_authorize_admin && validationStatus.validation_status?.admin_authorization_status === 'ready' && (
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
          {!validationStatus.can_authorize_admin && (
            <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
              <p className="text-sm">
                Administrator authorization is not available until payment{isNonCommercial ? ' and document' : ''} validation is completed.
              </p>
            </div>
          )}

          {validationStatus.validation_status?.admin_authorization_status === 'authorized' && (
            <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
              <p className="text-sm">
                <strong>Administrator Authorized:</strong> Administrator account has been successfully created and authorized.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationWorkflowSection;