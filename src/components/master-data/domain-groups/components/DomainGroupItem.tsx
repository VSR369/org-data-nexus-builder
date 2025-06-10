
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown, FolderOpen } from 'lucide-react';
import { DomainGroup } from '../types';
import { CategoryItem } from './CategoryItem';

interface DomainGroupItemProps {
  group: DomainGroup;
  isExpanded: boolean;
  onToggleExpansion: (groupId: string) => void;
  expandedCategories: Set<string>;
  onToggleCategoryExpansion: (categoryId: string) => void;
}

export const DomainGroupItem: React.FC<DomainGroupItemProps> = ({
  group,
  isExpanded,
  onToggleExpansion,
  expandedCategories,
  onToggleCategoryExpansion
}) => {
  return (
    <div className="border rounded-lg">
      <Collapsible
        open={isExpanded}
        onOpenChange={() => onToggleExpansion(group.id)}
      >
        <div className="flex items-center justify-between p-4">
          <CollapsibleTrigger className="flex items-center gap-2 text-left flex-1 hover:bg-muted/50 p-2 rounded">
            {isExpanded ? (
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

        <CollapsibleContent>
          <div className="pl-8 pr-4 pb-4 space-y-2">
            {group.categories?.length === 0 ? (
              <div className="text-sm text-muted-foreground italic py-2">
                No categories found in this domain group.
              </div>
            ) : (
              group.categories?.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isExpanded={expandedCategories.has(category.id)}
                  onToggleExpansion={onToggleCategoryExpansion}
                />
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
