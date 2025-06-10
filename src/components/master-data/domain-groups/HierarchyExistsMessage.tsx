
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FolderTree, Eye } from 'lucide-react';
import { DomainGroupsData } from '@/types/domainGroups';

interface HierarchyExistsMessageProps {
  data?: DomainGroupsData;
}

const HierarchyExistsMessage: React.FC<HierarchyExistsMessageProps> = ({ data }) => {
  const lifeSciencesDomainGroups = data?.domainGroups?.filter(dg => 
    dg.industrySegmentName === 'Life Sciences' || 
    dg.industrySegmentId === '1' ||
    (dg.name && dg.name.toLowerCase().includes('life sciences'))
  ) || [];

  const lifeSciencesCategories = data?.categories?.filter(cat =>
    lifeSciencesDomainGroups.some(dg => dg.id === cat.domainGroupId)
  ) || [];

  const lifeSciencesSubCategories = data?.subCategories?.filter(subCat =>
    lifeSciencesCategories.some(cat => cat.id === subCat.categoryId)
  ) || [];

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-green-900 flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              Life Sciences Hierarchy Already Created
            </h3>
            <p className="text-sm text-green-700 mt-1">
              The Life Sciences domain group hierarchy is configured with{' '}
              <strong>{lifeSciencesDomainGroups.length} domain groups</strong>,{' '}
              <strong>{lifeSciencesCategories.length} categories</strong>, and{' '}
              <strong>{lifeSciencesSubCategories.length} sub-categories</strong>.{' '}
              You can view and manage the complete hierarchy in the expandable sections below.
            </p>
            {lifeSciencesDomainGroups.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Domain Groups: {lifeSciencesDomainGroups.map(dg => dg.name).join(', ')}
                </p>
              </div>
            )}
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ✓ Complete
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default HierarchyExistsMessage;
