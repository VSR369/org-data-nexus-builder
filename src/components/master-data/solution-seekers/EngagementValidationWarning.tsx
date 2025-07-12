import React from 'react';
import { AlertCircle } from 'lucide-react';
import { EngagementValidator } from '@/utils/engagementValidator';

const EngagementValidationWarning: React.FC = () => {
  const globalEngagementValidation = EngagementValidator.validateGlobalEngagement();
  
  if (globalEngagementValidation.isValid) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center gap-2 text-amber-800 mb-2">
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">Engagement Configuration Required</span>
      </div>
      <p className="text-amber-700 mb-3">
        {EngagementValidator.getValidationMessage(globalEngagementValidation)}
      </p>
      <div className="text-sm text-amber-600">
        <strong>Impact:</strong> Solution seeker approval/rejection actions are disabled until engagement model configuration is complete.
      </div>
    </div>
  );
};

export default EngagementValidationWarning;