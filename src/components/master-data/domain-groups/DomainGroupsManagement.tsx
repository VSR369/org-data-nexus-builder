
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown, FolderOpen, Folder, FileText } from 'lucide-react';
import { DomainGroup, IndustrySegment } from './types';
import { Label } from "@/components/ui/label";

interface DomainGroupsManagementProps {
  industrySegments: IndustrySegment[];
  selectedIndustrySegment: string;
  onSelectIndustrySegment: (segmentId: string) => void;
  domainGroups: DomainGroup[];
  selectedDomainGroup: string;
  onSelectDomainGroup: (groupId: string) => void;
  onAddDomainGroup: (group: Omit<DomainGroup, 'id' | 'createdAt'>) => void;
  onUpdateDomainGroup: (id: string, updates: Partial<DomainGroup>) => void;
  onDeleteDomainGroup: (id: string) => void;
  showMessage: (message: string) => void;
}

export const DomainGroupsManagement: React.FC<DomainGroupsManagementProps> = ({
  industrySegments,
  selectedIndustrySegment,
  onSelectIndustrySegment,
  domainGroups,
  showMessage
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

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

  const selectedSegmentInfo = industrySegments.find(s => s.id === selectedIndustrySegment);

  return (
    <div className="space-y-6">
      {/* Industry Segment Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Segment Selection</CardTitle>
          <CardDescription>
            Select an industry segment to view its domain groups hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="industry-segment-select">Industry Segment</Label>
              <Select value={selectedIndustrySegment} onValueChange={onSelectIndustrySegment}>
                <SelectTrigger id="industry-segment-select" className="mt-1">
                  <SelectValue placeholder="Select an industry segment" />
                </SelectTrigger>
                <SelectContent>
                  {industrySegments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedIndustrySegment && (
        <>
          {/* Domain Groups Hierarchy View */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Domain Groups Hierarchy - {selectedSegmentInfo?.name}
                  </CardTitle>
                  <CardDescription>
                    Complete hierarchical view with expandable groups, categories, and sub-categories
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Domain Groups Tree Structure */}
              <div className="space-y-3">
                {domainGroups.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No domain groups found for this industry segment.</p>
                  </div>
                ) : (
                  domainGroups.map((group) => (
                    <div key={group.id} className="border rounded-lg">
                      {/* Domain Group Header */}
                      <Collapsible
                        open={expandedGroups.has(group.id)}
                        onOpenChange={() => toggleGroupExpansion(group.id)}
                      >
                        <div className="flex items-center justify-between p-4">
                          <CollapsibleTrigger className="flex items-center gap-2 text-left flex-1 hover:bg-muted/50 p-2 rounded">
                            {expandedGroups.has(group.id) ? (
                              <ChevronDown className="h-4 w-4 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="h-4 w-4 flex-shrink-0" />
                            )}
                            <FolderOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="font-semibold text-lg">{group.name}</div>
                              {group.description && (
                                <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {group.categories?.length || 0} categories
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {group.categories?.reduce((total, cat) => total + (cat.subCategories?.length || 0), 0)} sub-categories
                                </Badge>
                              </div>
                            </div>
                          </CollapsibleTrigger>
                        </div>

                        {/* Categories and Sub-Categories */}
                        <CollapsibleContent>
                          <div className="pl-8 pr-4 pb-4 space-y-2">
                            {group.categories?.length === 0 ? (
                              <div className="text-sm text-muted-foreground italic py-2">
                                No categories found in this domain group.
                              </div>
                            ) : (
                              group.categories?.map((category) => (
                                <Collapsible
                                  key={category.id}
                                  open={expandedCategories.has(category.id)}
                                  onOpenChange={() => toggleCategoryExpansion(category.id)}
                                >
                                  <div className="border rounded-md bg-muted/30">
                                    <CollapsibleTrigger className="flex items-center gap-2 p-3 hover:bg-muted/50 rounded-md w-full text-left">
                                      {expandedCategories.has(category.id) ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                      <Folder className="h-4 w-4 text-green-600" />
                                      <div className="flex-1">
                                        <div className="font-medium">{category.name}</div>
                                        {category.description && (
                                          <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                                        )}
                                      </div>
                                      <Badge variant="outline" className="text-xs">
                                        {category.subCategories?.length || 0} sub-categories
                                      </Badge>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent>
                                      <div className="pl-6 pr-3 pb-3 space-y-1">
                                        {category.subCategories?.length === 0 ? (
                                          <div className="text-xs text-muted-foreground italic py-1">
                                            No sub-categories found in this category.
                                          </div>
                                        ) : (
                                          category.subCategories?.map((subCategory) => (
                                            <div key={subCategory.id} className="flex items-start gap-2 p-2 bg-background rounded border">
                                              <FileText className="h-3 w-3 text-purple-600 mt-1 flex-shrink-0" />
                                              <div className="flex-1">
                                                <div className="font-medium text-sm">{subCategory.name}</div>
                                                {subCategory.description && (
                                                  <div className="text-xs text-muted-foreground mt-1">{subCategory.description}</div>
                                                )}
                                              </div>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </CollapsibleContent>
                                  </div>
                                </Collapsible>
                              ))
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
