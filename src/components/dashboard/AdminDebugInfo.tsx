
import React from 'react';
import { Database } from "lucide-react";

interface AdminDebugInfoProps {
  userData: {
    organizationName?: string;
    entityType?: string;
    country?: string;
    organizationType?: string;
  };
}

const AdminDebugInfo: React.FC<AdminDebugInfoProps> = ({ userData }) => {
  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-2">
        <Database className="h-4 w-4 text-blue-600" />
        <p className="text-sm text-blue-700 font-medium">
          Administrator View - Registration Details
        </p>
      </div>
      <div className="text-xs text-blue-600 space-y-1">
        <p>• Organization: {userData.organizationName || 'Not found'}</p>
        <p>• Entity Type: {userData.entityType}</p>
        <p>• Country: {userData.country}</p>
        <p>• Organization Type: {userData.organizationType}</p>
        <p>• Status: Registration Complete</p>
      </div>
    </div>
  );
};

export default AdminDebugInfo;
