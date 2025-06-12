
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Building2, FolderTree } from 'lucide-react';
import { IndustrySegment } from '@/types/industrySegments';

interface HierarchyDisplayProps {
  selectedSegment?: IndustrySegment;
  domainGroupName: string;
}

const HierarchyDisplay: React.FC<HierarchyDisplayProps> = ({
  selectedSegment,
  domainGroupName
}) => {
  if (!selectedSegment && !domainGroupName) {
    return null;
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl">
      <div className="space-y-3">
        {/* Industry Segment - Large Font */}
        {selectedSegment && (
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary mb-1">{selectedSegment.industrySegment}</p>
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                Industry Segment
              </Badge>
            </div>
          </div>
        )}
        
        {/* Domain Group Name - Underneath */}
        {domainGroupName && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center">
              <FolderTree className="w-3 h-3 text-secondary-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-secondary-foreground">{domainGroupName}</p>
              <Badge variant="outline" className="text-xs">
                Domain Group
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyDisplay;
