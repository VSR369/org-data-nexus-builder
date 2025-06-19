
import React from 'react';
import { Handshake } from 'lucide-react';

export const EngagementModelEmptyState: React.FC = () => {
  return (
    <div className="p-6 text-center">
      <Handshake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Engagement Models Found
      </h3>
      <p className="text-gray-600">
        No engagement models are currently configured. Please contact your administrator 
        to set up engagement models in the master data.
      </p>
    </div>
  );
};
