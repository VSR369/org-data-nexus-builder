
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { EngagementModel } from '@/components/master-data/engagement-models/types';

interface ModelInfoSectionProps {
  model: EngagementModel;
  currentSelectedModel?: EngagementModel | null;
}

export const ModelInfoSection: React.FC<ModelInfoSectionProps> = ({
  model,
  currentSelectedModel
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-semibold text-lg">{model.name}</h4>
        <Badge variant="default">Active</Badge>
        {currentSelectedModel?.id === model.id && (
          <Badge variant="secondary">Currently Selected</Badge>
        )}
      </div>
      <p className="text-gray-600 text-sm">
        {model.description}
      </p>
    </div>
  );
};
