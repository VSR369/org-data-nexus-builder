
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface ActionsSectionProps {
  hasData: boolean;
  isCreating: boolean;
  onShowDataEntry?: () => void;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
  hasData,
  isCreating,
  onShowDataEntry
}) => {
  return (
    <div className="flex gap-4">
      {/* Add New Domain Hierarchy Button */}
      <Button 
        onClick={onShowDataEntry}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add New Domain Hierarchy
      </Button>
    </div>
  );
};

export default ActionsSection;
