
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { FolderTree } from 'lucide-react';

interface HierarchyActionFooterProps {
  totalHierarchies: number;
}

const HierarchyActionFooter: React.FC<HierarchyActionFooterProps> = ({
  totalHierarchies
}) => {
  return (
    <div className="mt-6 pt-6 border-t bg-muted/20 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">Ready for Competency Evaluation</p>
          <p className="text-xs text-muted-foreground">
            These hierarchies are saved and available in Self Enrollment → Competency Evaluation
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <FolderTree className="w-3 h-3 mr-1" />
          {totalHierarchies} Hierarchies Saved
        </Badge>
      </div>
    </div>
  );
};

export default HierarchyActionFooter;
