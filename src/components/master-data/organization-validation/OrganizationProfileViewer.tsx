
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  CreditCard, 
  Shield, 
  Target, 
  Award,
  FileText,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import ValidationWorkflowSection from './components/ValidationWorkflowSection';

interface Organization {
  id: string;
  organization_name?: string;
  organization_id?: string;
  organization_type?: string;
  entity_type?: string;
  industry_segment?: string;
  country?: string;
  contact_person_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  website?: string;
  approval_status?: string;
  membership_status?: string;
  pricing_tier?: string;
  engagement_model?: string;
  created_at?: string;
  updated_at?: string;
  workflow_completed?: boolean;
  tier_features?: any;
  engagement_model_details?: any;
  mem_payment_amount?: number;
  mem_payment_currency?: string;
  mem_payment_date?: string;
  mem_payment_status?: string;
  mem_payment_method?: string;
  mem_receipt_number?: string;
  workflow_step?: string;
  tier_selected_at?: string;
  engagement_model_selected_at?: string;
}

interface OrganizationProfileViewerProps {
  organizationId: string;
  organizations: Organization[];
}

const OrganizationProfileViewer: React.FC<OrganizationProfileViewerProps> = ({
  organizationId,
  organizations
}) => {
  const organization = organizations.find(org => org.id === organizationId);

  if (!organization) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Organization Not Found</h3>
            <p className="text-muted-foreground">
              The selected organization could not be found.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return dateString;
    }
  };

  // Check if organization is non-commercial (requires document validation)
  const isNonCommercial = organization.entity_type?.toLowerCase().includes('non') || 
                          organization.entity_type?.toLowerCase().includes('profit');

  return (
    <div className="space-y-6">
      {/* Validation Workflow Section - NEW ADDITION */}
      <ValidationWorkflowSection 
        organizationId={organization.organization_id || organizationId}
        organization={organization}
        isNonCommercial={isNonCommercial}
      />
      
      <Separator />
      
      {/* Organization Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
                <p className="text-sm font-medium">{organization.organization_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Organization ID</label>
                <p className="text-sm font-mono">{organization.organization_id || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Organization Type</label>
                <p className="text-sm">{organization.organization_type || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                <p className="text-sm">{organization.entity_type || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Industry Segment</label>
                <p className="text-sm">{organization.industry_segment || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Country</label>
                <p className="text-sm">{organization.country || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                <p className="text-sm">{formatDate(organization.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">{formatDate(organization.updated_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                  <p className="text-sm font-medium">{organization.contact_person_name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{organization.email || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <p className="text-sm">{organization.phone_number || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Website</label>
                  <p className="text-sm">{organization.website || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          {organization.address && (
            <div className="flex items-start gap-2 pt-2 border-t">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm">{organization.address}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Approval Status</p>
              <Badge className={getStatusColor(organization.approval_status || 'pending')}>
                {organization.approval_status || 'Pending'}
              </Badge>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Workflow Status</p>
              <Badge variant={organization.workflow_completed ? "default" : "outline"}>
                {organization.workflow_completed ? 'Completed' : 'In Progress'}
              </Badge>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Current Step</p>
              <Badge variant="secondary">
                {organization.workflow_step || 'Not Started'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Details */}
      {organization.membership_status && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Membership Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm font-medium">
                    <Badge className={getStatusColor(organization.membership_status)}>
                      {organization.membership_status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Amount</label>
                  <p className="text-sm">
                    {organization.mem_payment_amount && organization.mem_payment_currency ? 
                      `${organization.mem_payment_currency} ${organization.mem_payment_amount}` : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Date</label>
                  <p className="text-sm">{formatDate(organization.mem_payment_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                  <p className="text-sm">{organization.mem_payment_method || 'N/A'}</p>
                </div>
              </div>
            </div>
            {organization.mem_receipt_number && (
              <div className="pt-2 border-t">
                <label className="text-sm font-medium text-muted-foreground">Receipt Number</label>
                <p className="text-sm font-mono">{organization.mem_receipt_number}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tier Pricing */}
      {organization.pricing_tier && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Pricing Tier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{organization.pricing_tier}</p>
                <p className="text-sm text-muted-foreground">
                  Selected on {formatDate(organization.tier_selected_at)}
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {organization.pricing_tier}
              </Badge>
            </div>
            {organization.tier_features && (
              <div className="pt-2 border-t">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Tier Features</label>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                  {JSON.stringify(organization.tier_features, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Engagement Model */}
      {organization.engagement_model && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Engagement Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{organization.engagement_model}</p>
                <p className="text-sm text-muted-foreground">
                  Selected on {formatDate(organization.engagement_model_selected_at)}
                </p>
              </div>
              <Badge variant="outline">
                {organization.engagement_model}
              </Badge>
            </div>
            {organization.engagement_model_details && (
              <div className="pt-2 border-t">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Model Details</label>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                  {JSON.stringify(organization.engagement_model_details, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrganizationProfileViewer;
