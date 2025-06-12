
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { FolderTree } from 'lucide-react';

interface SummaryFooterProps {
  totalHierarchies: number;
}

const SummaryFooter: React.FC<SummaryFooterProps> = ({ totalHierarchies }) => {
  return (
    <div className="mt-6 pt-6 border-t bg-muted/20 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">Configured Hierarchies Overview</p>
          <p className="text-xs text-muted-foreground">
            These hierarchies are available for competency evaluation
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <FolderTree className="w-3 h-3 mr-1" />
          {totalHierarchies} Hierarchies
        </Badge>
      </div>
    </div>
  );
};

export default SummaryFooter;
