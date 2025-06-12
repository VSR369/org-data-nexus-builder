
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface DomainGroupsHeaderProps {
  onStartManualEntry: () => void;
  onScrollToDataEntry: () => void;
}

const DomainGroupsHeader: React.FC<DomainGroupsHeaderProps> = ({
  onStartManualEntry,
  onScrollToDataEntry
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Domain Groups Configuration</h1>
      <p className="text-muted-foreground mb-4">Manage domain groups for the platform</p>
      <div className="flex items-center gap-3">
        <Button 
          onClick={onScrollToDataEntry}
          className="flex items-center gap-2"
          size="lg"
        >
          <Plus className="w-4 h-4" />
          Add New Domain Hierarchy
        </Button>
      </div>
    </div>
  );
};

export default DomainGroupsHeader;
