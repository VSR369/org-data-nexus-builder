
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User, Globe } from 'lucide-react';

interface OrganizationDetailsSectionProps {
  organizationName?: string;
  entityType?: string;
  country?: string;
}

export const OrganizationDetailsSection = ({ 
  organizationName, 
  entityType, 
  country 
}: OrganizationDetailsSectionProps) => {
  return (
    <>
      {/* Organization Details Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization Details</h2>
        <p className="text-sm text-gray-600">Review your organization information below</p>
      </div>

      {/* Organization Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Name */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Organization Name
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-900">
              {organizationName || 'Not Available'}
            </p>
          </CardContent>
        </Card>

        {/* Entity Type */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Entity Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-900">
              {entityType || 'Not Available'}
            </p>
          </CardContent>
        </Card>

        {/* Country */}
        <Card className="border border-gray-200 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-900">
              {country || 'Not Available'}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
