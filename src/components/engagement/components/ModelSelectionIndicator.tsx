
import React from 'react';
import { Check } from 'lucide-react';

interface ModelSelectionIndicatorProps {
  isSelected: boolean;
}

export const ModelSelectionIndicator: React.FC<ModelSelectionIndicatorProps> = ({
  isSelected
}) => {
  if (!isSelected) return null;

  return (
    <div className="flex items-center gap-2 text-blue-600 mt-2">
      <Check className="h-4 w-4" />
      <span className="text-sm font-medium">Selected</span>
    </div>
  );
};
