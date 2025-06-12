
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree } from 'lucide-react';
import { DomainGroup } from '@/types/domainGroups';
import { IndustrySegment } from '@/types/industrySegments';
import IndustrySegmentCard from './IndustrySegmentCard';
import EmptyStateDisplay from './EmptyStateDisplay';

interface ExistingDataTreeViewProps {
  industrySegments: IndustrySegment[];
  groupedDomainGroups: Record<string, DomainGroup[]>;
}

const ExistingDataTreeView: React.FC<ExistingDataTreeViewProps> = ({
  industrySegments,
  groupedDomainGroups
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="w-5 h-5" />
          Existing Domain Group Hierarchies
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedDomainGroups).length === 0 ? (
          <EmptyStateDisplay />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedDomainGroups).map(([industrySegment, domainGroups]) => (
              <IndustrySegmentCard
                key={industrySegment}
                industrySegment={industrySegment}
                domainGroups={domainGroups}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExistingDataTreeView;
