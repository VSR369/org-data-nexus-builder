import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { checkLifeSciencesExists } from './lifeSciencesExistenceChecker';
import HierarchyExistsMessage from './HierarchyExistsMessage';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { createLifeSciencesHierarchyData } from './lifeSciencesHierarchyData';
import { Zap, Building2, ChevronDown, ChevronRight, Plus, FolderTree, Target, Globe } from 'lucide-react';

interface BulkDomainGroupCreatorProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
  onShowDataEntry?: () => void;
}

const BulkDomainGroupCreator: React.FC<BulkDomainGroupCreatorProps> = ({ 
  data, 
  onDataUpdate,
  onShowDataEntry 
}) => {
  const [forceRefresh, setForceRefresh] = useState(0);
  const [hierarchyExists, setHierarchyExists] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Check if any domain groups exist
  useEffect(() => {
    console.log('🔄 BulkDomainGroupCreator: Checking for existing hierarchies...');
    console.log('📊 BulkDomainGroupCreator: Current data state:', {
      domainGroups: data.domainGroups?.length || 0,
      categories: data.categories?.length || 0,
      subCategories: data.subCategories?.length || 0
    });

    const exists = data.domainGroups && data.domainGroups.length > 0;
    setHierarchyExists(exists);
    
    console.log('📊 BulkDomainGroupCreator: Hierarchy existence result:', exists);
  }, [data, forceRefresh]);

  const handleCreateLifeSciencesHierarchy = async () => {
    setIsCreating(true);
    console.log('🚀 Creating Life Sciences hierarchy...');
    
    try {
      const { newDomainGroups, newCategories, newSubCategories } = createLifeSciencesHierarchyData();
      
      const updatedData: DomainGroupsData = {
        domainGroups: [...data.domainGroups, ...newDomainGroups],
        categories: [...data.categories, ...newCategories],
        subCategories: [...data.subCategories, ...newSubCategories]
      };
      
      console.log('✅ Life Sciences hierarchy created:', {
        newDomainGroups: newDomainGroups.length,
        newCategories: newCategories.length,
        newSubCategories: newSubCategories.length,
        totalDomainGroups: updatedData.domainGroups.length,
        totalCategories: updatedData.categories.length,
        totalSubCategories: updatedData.subCategories.length
      });
      
      onDataUpdate(updatedData);
      setForceRefresh(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error creating Life Sciences hierarchy:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Get hierarchical data grouped by industry segment
  const getGroupedHierarchicalData = () => {
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
      const industryKey = domainGroup.industrySegmentName || 'Unknown Industry';
      if (!acc[industryKey]) {
        acc[industryKey] = [];
      }
      acc[industryKey].push(domainGroup);
      return acc;
    }, {} as Record<string, typeof hierarchicalData>);

    return grouped;
  };

  const groupedData = getGroupedHierarchicalData();

  console.log('🎯 BulkDomainGroupCreator: Render decision:', {
    hierarchyExists,
    dataHasDomainGroups: data.domainGroups?.length > 0
  });

  return (
    <div className="space-y-6">
      {/* Existing Hierarchies Display */}
      {hierarchyExists && (
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
                          onOpenChange={() => toggleGroupExpansion(domainGroup.id)}
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
                                    onOpenChange={() => toggleCategoryExpansion(category.id)}
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
      )}

      {/* Action Buttons */}
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

        {/* Quick Create Life Sciences Button - only show if no Life Sciences exists */}
        {!hierarchyExists && (
          <Card className="flex-1 border-2 border-dashed border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Setup: Life Sciences Hierarchy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Get started quickly with a comprehensive Life Sciences & Pharma competency hierarchy.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="font-medium">4 Domain Groups</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">13 Categories</Badge>
                    <Badge variant="outline" className="text-xs">52 Sub-categories</Badge>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleCreateLifeSciencesHierarchy}
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? 'Creating Life Sciences Hierarchy...' : 'Create Life Sciences Hierarchy'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BulkDomainGroupCreator;
