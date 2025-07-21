
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { SeekerDetails } from './types';

interface DocumentValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seeker: SeekerDetails;
  onValidate: (seekerId: string, status: 'valid' | 'invalid', reason: string) => Promise<void>;
  processing: boolean;
}

const DocumentValidationDialog: React.FC<DocumentValidationDialogProps> = ({
  open,
  onOpenChange,
  seeker,
  onValidate,
  processing
}) => {
  const [validationComments, setValidationComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValidation = async (action: 'approved' | 'rejected') => {
    if (action === 'rejected' && !validationComments.trim()) {
      toast.error('Please provide comments when rejecting documents');
      return;
    }

    setIsSubmitting(true);
    try {
      // Map frontend action to database status
      const validationStatus = action === 'approved' ? 'valid' : 'invalid';
      
      await onValidate(
        seeker.id, 
        validationStatus, 
        validationComments.trim() || `Documents ${action} for ${seeker.organizationName}`
      );
      
      toast.success(`Documents ${action} successfully`);
      setValidationComments('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Document validation error:', error);
      toast.error(`Failed to ${action} documents: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isNonCommercial = ['Non-Profit Organization', 'Society', 'Trust'].includes(seeker.entityType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Validation - {seeker.organizationName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Organization Info */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{seeker.organizationId}</Badge>
              <Badge variant="secondary">{seeker.entityType}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Organization:</span> {seeker.organizationName}
              </div>
              <div>
                <span className="font-medium">Contact:</span> {seeker.contactPersonName}
              </div>
              <div>
                <span className="font-medium">Type:</span> {seeker.organizationType}
              </div>
              <div>
                <span className="font-medium">Country:</span> {seeker.country}
              </div>
            </div>
          </div>

          {/* Document Validation Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Document Validation Required</span>
            </div>
            <p className="text-sm text-blue-700">
              This {seeker.entityType.toLowerCase()} requires document validation as per regulatory requirements. 
              Please review the submitted registration documents and validate their authenticity and completeness.
            </p>
          </div>

          {/* Document List Placeholder */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Submitted Documents</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Registration Certificate</span>
                <Badge variant="outline" className="ml-auto">Submitted</Badge>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Tax Exemption Certificate</span>
                <Badge variant="outline" className="ml-auto">Submitted</Badge>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Board Resolution</span>
                <Badge variant="outline" className="ml-auto">Submitted</Badge>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t">
              <Button variant="outline" size="sm" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View All Documents
              </Button>
            </div>
          </div>

          {/* Validation Comments */}
          <div className="space-y-2">
            <Label htmlFor="validation-comments">Validation Comments</Label>
            <Textarea
              id="validation-comments"
              placeholder="Enter your validation comments here. Required for rejection, optional for approval..."
              value={validationComments}
              onChange={(e) => setValidationComments(e.target.value)}
              rows={4}
              disabled={processing || isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              These comments will be recorded in the audit log and may be shared with the organization.
            </p>
          </div>

          {/* Validation Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={() => handleValidation('approved')}
              disabled={processing || isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? 'Processing...' : 'Mark Valid'}
            </Button>
            <Button 
              onClick={() => handleValidation('rejected')}
              disabled={processing || isSubmitting || !validationComments.trim()}
              variant="destructive"
              className="flex-1"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? 'Processing...' : 'Mark Invalid'}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded">
            <strong>Next Steps:</strong> After document validation, the organization will be eligible for administrator account creation.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentValidationDialog;
