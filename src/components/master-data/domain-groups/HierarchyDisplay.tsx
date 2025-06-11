
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Building2, ChevronDown, ChevronRight, Target, Globe, FolderTree } from 'lucide-react';
import { DomainGroupsData } from '@/types/domainGroups';

interface HierarchyDisplayProps {
  data: DomainGroupsData;
  expandedGroups: Set<string>;
  expandedCategories: Set<string>;
  onToggleGroupExpansion: (groupId: string) => void;
  onToggleCategoryExpansion: (categoryId: string) => void;
}

const HierarchyDisplay: React.FC<HierarchyDisplayProps> = ({
  data,
  expandedGroups,
  expandedCategories,
  onToggleGroupExpansion,
  onToggleCategoryExpansion
}) => {
  // Get hierarchical data grouped by industry segment
  const getGroupedHierarchicalData = () => {
    if (!data.domainGroups || data.domainGroups.length === 0) {
      console.log('⚠️ No domain groups found in data');
      return {};
    }

    console.log('🔍 Processing hierarchical data with:', {
      domainGroups: data.domainGroups.length,
      categories: data.categories.length,
      subCategories: data.subCategories.length
    });

    const hierarchicalData = data.domainGroups.map(domainGroup => {
      const categories = data.categories.filter(cat => cat.domainGroupId === domainGroup.id);
      console.log(`📂 Domain Group "${domainGroup.name}" has ${categories.length} categories`);
      
      return {
        ...domainGroup,
        categories: categories.map(category => {
          const subCategories = data.subCategories.filter(sub => sub.categoryId === category.id);
          console.log(`📁 Category "${category.name}" has ${subCategories.length} sub-categories`);
          
          return {
            ...category,
            subCategories
          };
        })
      };
    });

    // Group by industry segment
    const grouped = hierarchicalData.reduce((acc, domainGroup) => {
      const industryKey = domainGroup.industrySegmentName || 'Unknown Industry';
      if (!acc[industryKey]) {
        acc[industryKey] = [];
      }
      acc[industryKey].push(domainGroup);
      return acc;
    }, {} as Record<string, typeof hierarchicalData>);

    console.log('🗂️ Grouped data:', Object.keys(grouped).map(key => `${key}: ${grouped[key].length} groups`));
    return grouped;
  };

  const groupedData = getGroupedHierarchicalData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="w-5 h-5" />
          Existing Domain Group Hierarchies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedData).map(([industrySegment, domainGroups]) => (
            <div key={industrySegment} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              {/* Industry Segment Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">{industrySegment}</h3>
                  <p className="text-sm text-blue-700">
                    {domainGroups.length} Domain Groups • {' '}
                    {domainGroups.reduce((sum, dg) => sum + dg.categories.length, 0)} Categories
                  </p>
                </div>
              </div>

              {/* Domain Groups */}
              <div className="space-y-3">
                {domainGroups.map((domainGroup) => (
                  <div key={domainGroup.id} className="bg-white border rounded-lg">
                    <Collapsible 
                      open={expandedGroups.has(domainGroup.id)}
                      onOpenChange={() => onToggleGroupExpansion(domainGroup.id)}
                    >
                      <CollapsibleTrigger className="w-full p-4 text-left hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-primary" />
                            <div>
                              <h4 className="font-medium">{domainGroup.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {domainGroup.categories.length} categories
                              </p>
                            </div>
                          </div>
                          {expandedGroups.has(domainGroup.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="space-y-2 ml-8">
                          {domainGroup.categories.map((category) => (
                            <div key={category.id} className="border-l-2 border-primary/20 pl-4">
                              <Collapsible
                                open={expandedCategories.has(category.id)}
                                onOpenChange={() => onToggleCategoryExpansion(category.id)}
                              >
                                <CollapsibleTrigger className="w-full text-left p-2 hover:bg-gray-50 rounded">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Target className="w-4 h-4 text-primary" />
                                      <span className="font-medium text-sm">{category.name}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {category.subCategories.length} sub-categories
                                      </Badge>
                                    </div>
                                    {expandedCategories.has(category.id) ? (
                                      <ChevronDown className="w-3 h-3" />
                                    ) : (
                                      <ChevronRight className="w-3 h-3" />
                                    )}
                                  </div>
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent className="mt-2">
                                  <div className="space-y-1 ml-6">
                                    {category.subCategories.map((subCategory, index) => (
                                      <div key={subCategory.id} className="flex items-start gap-2 p-2 bg-muted/30 rounded text-sm">
                                        <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium shrink-0">
                                          {index + 1}
                                        </span>
                                        <div>
                                          <div className="font-medium">{subCategory.name}</div>
                                          {subCategory.description && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                              {subCategory.description}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HierarchyDisplay;
