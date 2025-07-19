import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  CreditCard, 
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import type { SolutionSeekerData } from '@/services/OrganizationDataService';

interface ComprehensiveDataViewProps {
  isOpen: boolean;
  onClose: () => void;
  seeker: SolutionSeekerData;
}

const ComprehensiveDataView: React.FC<ComprehensiveDataViewProps> = ({
  isOpen,
  onClose,
  seeker
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active Member':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Pending Activation':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Registered - No Engagement':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active Member':
        return 'default';
      case 'Pending Activation':
        return 'secondary';
      case 'Registered - No Engagement':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Comprehensive View: {seeker.organization_name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Status Overview */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Status Overview
              </h3>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall Status:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(seeker.overall_status)}
                    <Badge variant={getStatusBadgeVariant(seeker.overall_status)}>
                      {seeker.overall_status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Membership:</span>
                  <Badge variant="outline">{seeker.membership_status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Activation:</span>
                  <Badge variant="outline">{seeker.activation_status}</Badge>
                </div>
              </div>
            </div>

            {/* Organization Information */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organization Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Organization Name</p>
                      <p className="font-medium">{seeker.organization_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Organization ID</p>
                      <p className="font-mono text-sm">{seeker.organization_id}</p>
                    </div>
                  </div>

                  {seeker.organization_type && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Organization Type</p>
                        <p className="font-medium">{seeker.organization_type}</p>
                      </div>
                    </div>
                  )}

                  {seeker.entity_type && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Entity Type</p>
                        <p className="font-medium">{seeker.entity_type}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {seeker.industry_segment && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Industry Segment</p>
                        <p className="font-medium">{seeker.industry_segment}</p>
                      </div>
                    </div>
                  )}

                  {seeker.country && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Country</p>
                        <p className="font-medium">{seeker.country}</p>
                      </div>
                    </div>
                  )}

                  {seeker.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{seeker.address}</p>
                      </div>
                    </div>
                  )}

                  {seeker.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a 
                          href={seeker.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {seeker.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{seeker.contact_person_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-medium">{seeker.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {seeker.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{seeker.phone_number}</p>
                      </div>
                    </div>
                  )}

                  {seeker.country_code && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Country Code</p>
                        <p className="font-medium">{seeker.country_code}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Membership & Engagement Details */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Membership & Engagement Details
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Membership Status</p>
                    <Badge variant="outline">{seeker.membership_status}</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Activation Status</p>
                    <Badge variant="outline">{seeker.activation_status}</Badge>
                  </div>

                  {seeker.pricing_tier && (
                    <div>
                      <p className="text-sm text-muted-foreground">Pricing Tier</p>
                      <p className="font-medium">{seeker.pricing_tier}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {seeker.engagement_model && (
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement Model</p>
                      <p className="font-medium">{seeker.engagement_model}</p>
                    </div>
                  )}

                  {seeker.payment_simulation_status && (
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <Badge variant="outline">{seeker.payment_simulation_status}</Badge>
                    </div>
                  )}

                  {seeker.workflow_step && (
                    <div>
                      <p className="text-sm text-muted-foreground">Workflow Step</p>
                      <p className="font-medium">{seeker.workflow_step}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* System Information */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4" />
                System Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Has User Account</p>
                    <Badge variant={seeker.has_user_account ? "default" : "destructive"}>
                      {seeker.has_user_account ? "Yes" : "No"}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Has Engagement Record</p>
                    <Badge variant={seeker.has_engagement_record ? "default" : "destructive"}>
                      {seeker.has_engagement_record ? "Yes" : "No"}
                    </Badge>
                  </div>

                  {seeker.user_id && (
                    <div>
                      <p className="text-sm text-muted-foreground">User ID</p>
                      <p className="font-mono text-sm">{seeker.user_id}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Registration Date</p>
                      <p className="font-medium">{format(new Date(seeker.created_at), 'PPP')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{format(new Date(seeker.updated_at), 'PPP')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Activity</p>
                      <p className="font-medium">{format(new Date(seeker.last_activity), 'PPP')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComprehensiveDataView;