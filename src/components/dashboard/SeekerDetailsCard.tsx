
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User, Globe } from 'lucide-react';

interface SeekerDetailsCardProps {
  organizationName: string;
  organizationType: string;
  entityType: string;
  country: string;
  userId: string;
}

const SeekerDetailsCard: React.FC<SeekerDetailsCardProps> = ({
  organizationName,
  organizationType,
  entityType,
  country,
  userId
}) => {
  return (
    <Card className="shadow-xl border-0 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Building className="h-6 w-6 text-blue-600" />
          Seeker Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Organization Name */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Building className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Organization Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {organizationName || 'Not Available'}
              </p>
            </div>
          </div>

          {/* Organization Type */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Building className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Organization Type</p>
              <p className="text-lg font-semibold text-gray-900">
                {organizationType || 'Not Available'}
              </p>
            </div>
          </div>

          {/* Entity Type */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Entity Type</p>
              <p className="text-lg font-semibold text-gray-900">
                {entityType || 'Not Available'}
              </p>
            </div>
          </div>

          {/* Country */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Globe className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Country</p>
              <p className="text-lg font-semibold text-gray-900">
                {country || 'Not Available'}
              </p>
            </div>
          </div>

          {/* User ID */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">User ID</p>
              <p className="text-lg font-semibold text-gray-900">
                {userId || 'Not Available'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeekerDetailsCard;
