
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Globe, Phone, Mail, User } from 'lucide-react';

interface OrganizationDetailsCardProps {
  data: any;
}

const OrganizationDetailsCard: React.FC<OrganizationDetailsCardProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Organization Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Organization Name and Type */}
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Organization Name</div>
            <div className="text-lg font-semibold">{data.organization_name}</div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">
              {data.organization_type || data.organization_type_name}
            </Badge>
            <Badge variant="outline">
              {data.entity_type || data.entity_type_name}
            </Badge>
            <Badge variant="outline">
              {data.industry_segment || data.industry_segment_name}
            </Badge>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Contact Information</h4>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Contact Person</div>
                <div className="text-sm text-muted-foreground">{data.contact_person_name}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="text-sm text-muted-foreground">{data.email}</div>
              </div>
            </div>
            
            {data.phone_number && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">{data.phone_number}</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Location</div>
                <div className="text-sm text-muted-foreground">
                  {data.address && `${data.address}, `}{data.country || data.country_name}
                </div>
              </div>
            </div>
            
            {data.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Website</div>
                  <a 
                    href={data.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {data.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Registration Date */}
        {(data.registration_date || data.created_at) && (
          <div>
            <div className="text-sm font-medium text-muted-foreground">Registration Date</div>
            <div className="text-sm">{formatDate(data.registration_date || data.created_at)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrganizationDetailsCard;
