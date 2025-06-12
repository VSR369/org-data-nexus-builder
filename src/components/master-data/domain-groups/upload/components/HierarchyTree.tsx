
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronRight, 
  Building2, 
  Target, 
  Globe 
} from 'lucide-react';
import { HierarchyData } from '../types';

interface HierarchyTreeProps {
  hierarchyData: HierarchyData;
  expandedIndustries: Set<string>;
  expandedDomainGroups: Set<string>;
  expandedCategories: Set<string>;
  onToggleIndustry: (industry: string) => void;
  onToggleDomainGroup: (key: string) => void;
  onToggleCategory: (key: string) => void;
}

const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  hierarchyData,
  expandedIndustries,
  expandedDomainGroups,
  expandedCategories,
  onToggleIndustry,
  onToggleDomainGroup,
  onToggleCategory
}) => {
  return (
    <div className="space-y-4">
      {Object.entries(hierarchyData).map(([industrySegment, domainGroups]) => (
        <div key={industrySegment} className="border rounded-lg">
          <Collapsible 
            open={expandedIndustries.has(industrySegment)}
            onOpenChange={() => onToggleIndustry(industrySegment)}
          >
            <CollapsibleTrigger className="w-full p-4 text-left hover:bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-lg">{industrySegment}</h4>
                    <p className="text-sm text-muted-foreground">
                      {Object.keys(domainGroups).length} domain groups
                    </p>
                  </div>
                </div>
                {expandedIndustries.has(industrySegment) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="px-4 pb-4">
              <div className="space-y-3 ml-6">
                {Object.entries(domainGroups).map(([domainGroup, categories]) => {
                  const dgKey = `${industrySegment}_${domainGroup}`;
                  return (
                    <div key={domainGroup} className="border-l-2 border-blue-200 pl-4">
                      <Collapsible
                        open={expandedDomainGroups.has(dgKey)}
                        onOpenChange={() => onToggleDomainGroup(dgKey)}
                      >
                        <CollapsibleTrigger className="w-full text-left p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-primary" />
                              <span className="font-medium">{domainGroup}</span>
                              <Badge variant="outline" className="text-xs">
                                {Object.keys(categories).length} categories
                              </Badge>
                            </div>
                            {expandedDomainGroups.has(dgKey) ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="mt-2">
                          <div className="space-y-2 ml-6">
                            {Object.entries(categories).map(([category, subCategories]) => {
                              const catKey = `${dgKey}_${category}`;
                              return (
                                <div key={category} className="border-l-2 border-primary/20 pl-4">
                                  <Collapsible
                                    open={expandedCategories.has(catKey)}
                                    onOpenChange={() => onToggleCategory(catKey)}
                                  >
                                    <CollapsibleTrigger className="w-full text-left p-2 hover:bg-gray-50 rounded">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Target className="w-3 h-3 text-primary" />
                                          <span className="text-sm font-medium">{category}</span>
                                          <Badge variant="secondary" className="text-xs">
                                            {subCategories.length} sub-categories
                                          </Badge>
                                        </div>
                                        {expandedCategories.has(catKey) ? (
                                          <ChevronDown className="w-3 h-3" />
                                        ) : (
                                          <ChevronRight className="w-3 h-3" />
                                        )}
                                      </div>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent className="mt-2">
                                      <div className="grid gap-1 ml-4">
                                        {subCategories.map((subCategory, index) => (
                                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm">
                                            <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium shrink-0">
                                              {index + 1}
                                            </span>
                                            <span>{subCategory}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              );
                            })}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
};

export default HierarchyTree;
