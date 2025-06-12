
import React from 'react';
import { Building, User } from 'lucide-react';

interface OrganizationInfoDisplayProps {
  organizationName?: string;
  userId?: string;
}

const OrganizationInfoDisplay = ({ organizationName, userId }: OrganizationInfoDisplayProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Building className="h-5 w-5" />
        Organization Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <Building className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Organization Name</p>
            <p className="font-semibold">{organizationName || 'Not Available'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">User ID</p>
            <p className="font-semibold">{userId || 'Not Available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfoDisplay;
