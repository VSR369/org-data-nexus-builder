
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone, MapPin, Globe, User, Calendar, Eye, UserPlus, Edit, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { SolutionSeekerData, ExistingAdmin } from '@/services/OrganizationDataService';

interface OrganizationPreviewCardProps {
  seeker: SolutionSeekerData;
  existingAdmin?: ExistingAdmin | null;
  onCreateAdmin: () => void;
  onEditAdmin?: () => void;
  onViewDetails: () => void;
}

const OrganizationPreviewCard: React.FC<OrganizationPreviewCardProps> = ({
  seeker,
  existingAdmin,
  onCreateAdmin,
  onEditAdmin,
  onViewDetails
}) => {
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

  const hasAdmin = existingAdmin && existingAdmin.is_active;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg truncate">{seeker.organization_name}</CardTitle>
          </div>
          <Badge variant={getStatusBadgeVariant(seeker.overall_status)}>
            {seeker.overall_status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Administrator Status */}
        {hasAdmin && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Administrator Active</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{existingAdmin.admin_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium truncate">{existingAdmin.admin_email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{seeker.contact_person_name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{seeker.email}</span>
          </div>

          {seeker.phone_number && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{seeker.phone_number}</span>
            </div>
          )}

          {seeker.country && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{seeker.country}</span>
            </div>
          )}

          {seeker.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{seeker.website}</span>
            </div>
          )}
        </div>

        {/* Organization Details */}
        <div className="space-y-1 text-sm">
          {seeker.organization_type && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{seeker.organization_type}</span>
            </div>
          )}
          
          {seeker.industry_segment && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Industry:</span>
              <span className="font-medium truncate">{seeker.industry_segment}</span>
            </div>
          )}

          {seeker.pricing_tier && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tier:</span>
              <span className="font-medium">{seeker.pricing_tier}</span>
            </div>
          )}

          {seeker.engagement_model && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model:</span>
              <span className="font-medium truncate">{seeker.engagement_model}</span>
            </div>
          )}
        </div>

        {/* Membership Info */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Membership:</span>
            <Badge variant="outline" className="text-xs">
              {seeker.membership_status}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Activation:</span>
            <Badge variant="outline" className="text-xs">
              {seeker.activation_status}
            </Badge>
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Registered {formatDistanceToNow(new Date(seeker.created_at))} ago</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Last activity {formatDistanceToNow(new Date(seeker.last_activity))} ago</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          
          {hasAdmin ? (
            <Button
              variant="default"
              size="sm"
              onClick={onEditAdmin}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Admin
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onCreateAdmin}
              className="flex-1"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Create Admin
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationPreviewCard;
