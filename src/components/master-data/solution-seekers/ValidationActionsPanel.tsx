
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, UserPlus, FileText } from 'lucide-react';
import type { SeekerDetails } from './types';

interface ValidationActionsPanelProps {
  seeker: SeekerDetails;
  onValidateDocuments: (seeker: SeekerDetails) => void;
  onCreateAdmin: (seeker: SeekerDetails) => void;
  onViewDetails: (seeker: SeekerDetails) => void;
}

const ValidationActionsPanel: React.FC<ValidationActionsPanelProps> = ({
  seeker,
  onValidateDocuments,
  onCreateAdmin,
  onViewDetails
}) => {
  const isNonCommercial = ['Non-Profit Organization', 'Society', 'Trust'].includes(seeker.entityType);
  const needsDocumentValidation = isNonCommercial && seeker.approvalStatus !== 'rejected';
  const canCreateAdmin = seeker.approvalStatus === 'approved';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActionPriority = () => {
    if (seeker.approvalStatus === 'pending' && needsDocumentValidation) {
      return 'document_validation';
    }
    if (seeker.approvalStatus === 'approved') {
      return 'admin_creation';
    }
    return 'payment_validation';
  };

  const actionPriority = getActionPriority();

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon(seeker.approvalStatus)}
          Validation Required: {seeker.organizationName}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{seeker.organizationId}</Badge>
          <Badge className={
            seeker.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
            seeker.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }>
            {seeker.approvalStatus}
          </Badge>
          {isNonCommercial && (
            <Badge variant="secondary">Non-Commercial</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Priority Action */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-orange-800">Next Action Required</span>
          </div>
          
          {actionPriority === 'document_validation' && (
            <div className="space-y-3">
              <p className="text-sm text-orange-700">
                This non-commercial organization requires document validation before administrator creation.
              </p>
              <Button 
                onClick={() => onValidateDocuments(seeker)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Validate Documents
              </Button>
            </div>
          )}

          {actionPriority === 'admin_creation' && (
            <div className="space-y-3">
              <p className="text-sm text-orange-700">
                All validations complete. Ready to create organization administrator.
              </p>
              <Button 
                onClick={() => onCreateAdmin(seeker)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Administrator
              </Button>
            </div>
          )}

          {actionPriority === 'payment_validation' && (
            <div className="space-y-3">
              <p className="text-sm text-orange-700">
                Payment validation is required before proceeding with other validations.
              </p>
              <Button 
                onClick={() => onViewDetails(seeker)}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                View Payment Details
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={() => onViewDetails(seeker)}
            variant="outline"
            size="sm"
          >
            View Full Details
          </Button>
          
          {needsDocumentValidation && actionPriority !== 'document_validation' && (
            <Button 
              onClick={() => onValidateDocuments(seeker)}
              variant="outline" 
              size="sm"
              disabled={seeker.approvalStatus !== 'pending'}
            >
              <FileText className="h-4 w-4 mr-1" />
              Documents
            </Button>
          )}
          
          {canCreateAdmin && (
            <Button 
              onClick={() => onCreateAdmin(seeker)}
              variant="outline" 
              size="sm"
              className="text-green-700 border-green-300 hover:bg-green-50"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Create Admin
            </Button>
          )}
        </div>

        {/* Organization Details Summary */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Type:</span>
            <span>{seeker.organizationType} | {seeker.entityType}</span>
          </div>
          <div className="flex justify-between">
            <span>Contact:</span>
            <span>{seeker.contactPersonName}</span>
          </div>
          <div className="flex justify-between">
            <span>Country:</span>
            <span>{seeker.country}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationActionsPanel;
