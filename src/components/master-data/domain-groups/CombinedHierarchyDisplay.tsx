
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domainGroupsDataManager';
import { industrySegmentDataManager } from './industrySegmentDataManager';
import IndustrySegmentHeader from './display/IndustrySegmentHeader';
import DomainGroupCard from './display/DomainGroupCard';
import HierarchyActionFooter from './display/HierarchyActionFooter';
import EmptyHierarchyState from './display/EmptyHierarchyState';

interface CombinedHierarchyDisplayProps {
  data: DomainGroupsData;
  expandedGroups: Set<string>;
  expandedCategories: Set<string>;
  newlyCreatedIds: Set<string>;
  onToggleGroupExpansion: (groupId: string) => void;
  onToggleCategoryExpansion: (categoryId: string) => void;
  onDataUpdate: (newData: DomainGroupsData) => void;
}

const CombinedHierarchyDisplay: React.FC<CombinedHierarchyDisplayProps> = ({ 
  data, 
  expandedGroups,
  expandedCategories,
  newlyCreatedIds,
  onToggleGroupExpansion,
  onToggleCategoryExpansion,
  onDataUpdate 
}) => {
  const { toast } = useToast();

  // Handle delete
  const handleDelete = (domainGroupId: string) => {
    const updatedData = {
      domainGroups: data.domainGroups.filter(dg => dg.id !== domainGroupId),
      categories: data.categories.filter(cat => cat.domainGroupId !== domainGroupId),
      subCategories: data.subCategories.filter(sub => {
        const category = data.categories.find(cat => cat.id === sub.categoryId);
        return category?.domainGroupId !== domainGroupId;
      })
    };
    
    onDataUpdate(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    toast({
      title: "Deleted",
      description: "Domain group hierarchy deleted successfully",
    });
  };

  // Get hierarchical data grouped by industry segment
  const getGroupedHierarchicalData = () => {
    if (!data.domainGroups || data.domainGroups.length === 0) {
      return {};
    }

    const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
    
    const hierarchicalData = data.domainGroups.map(domainGroup => {
      const categories = data.categories.filter(cat => cat.domainGroupId === domainGroup.id);
      
      return {
        ...domainGroup,
        categories: categories.map(category => ({
          ...category,
          subCategories: data.subCategories.filter(sub => sub.categoryId === category.id)
        }))
      };
    });

    // Group by industry segment
    const grouped = hierarchicalData.reduce((acc, domainGroup) => {
      const segment = industrySegments.find(is => is.id === domainGroup.industrySegmentId);
      const industryKey = segment?.industrySegment || domainGroup.industrySegmentName || 'Unknown Industry';
      
      if (!acc[industryKey]) {
        acc[industryKey] = [];
      }
      acc[industryKey].push(domainGroup);
      return acc;
    }, {} as Record<string, typeof hierarchicalData>);

    return grouped;
  };

  const groupedData = getGroupedHierarchicalData();

  if (Object.keys(groupedData).length === 0) {
    return <EmptyHierarchyState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="w-5 h-5" />
          Domain Group Hierarchies
        </CardTitle>
        <CardDescription>
          Your configured hierarchies organized by industry segment. These are ready for use in competency evaluations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedData).map(([industrySegment, domainGroups]) => (
            <div key={industrySegment} className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <IndustrySegmentHeader
                industrySegment={industrySegment}
                domainGroupsCount={domainGroups.length}
                categoriesCount={domainGroups.reduce((sum, dg) => sum + dg.categories.length, 0)}
                subCategoriesCount={domainGroups.reduce((sum, dg) => 
                  sum + dg.categories.reduce((catSum, cat) => catSum + cat.subCategories.length, 0), 0
                )}
              />

              {/* Domain Groups within this Industry Segment */}
              <div className="space-y-4">
                {domainGroups.map((domainGroup) => (
                  <DomainGroupCard
                    key={domainGroup.id}
                    domainGroup={domainGroup}
                    isNew={newlyCreatedIds.has(domainGroup.id)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <HierarchyActionFooter
          totalHierarchies={Object.values(groupedData).flat().length}
        />
      </CardContent>
    </Card>
  );
};

export default CombinedHierarchyDisplay;
