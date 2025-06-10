
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from 'lucide-react';
import { DomainGroup, IndustrySegment } from '../types';
import { DomainGroupItem } from './DomainGroupItem';

interface DomainGroupHierarchyProps {
  domainGroups: DomainGroup[];
  selectedSegmentInfo?: IndustrySegment;
}

export const DomainGroupHierarchy: React.FC<DomainGroupHierarchyProps> = ({
  domainGroups,
  selectedSegmentInfo
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

  return (
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
        <div className="space-y-3">
          {domainGroups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No domain groups found for this industry segment.</p>
            </div>
          ) : (
            domainGroups.map((group) => (
              <DomainGroupItem
                key={group.id}
                group={group}
                isExpanded={expandedGroups.has(group.id)}
                onToggleExpansion={toggleGroupExpansion}
                expandedCategories={expandedCategories}
                onToggleCategoryExpansion={toggleCategoryExpansion}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
