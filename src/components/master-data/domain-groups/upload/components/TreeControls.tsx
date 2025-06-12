
import React from 'react';
import { Button } from "@/components/ui/button";
import { FolderTree } from 'lucide-react';

interface TreeControlsProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onIntegrateToMasterData: () => void;
  canIntegrate: boolean;
}

const TreeControls: React.FC<TreeControlsProps> = ({
  onExpandAll,
  onCollapseAll,
  onIntegrateToMasterData,
  canIntegrate
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onExpandAll}>
          Expand All
        </Button>
        <Button variant="outline" size="sm" onClick={onCollapseAll}>
          Collapse All
        </Button>
      </div>
      {canIntegrate && (
        <Button onClick={onIntegrateToMasterData} className="bg-green-600 hover:bg-green-700">
          <FolderTree className="w-4 h-4 mr-2" />
          Integrate to Master Data
        </Button>
      )}
    </div>
  );
};

export default TreeControls;
