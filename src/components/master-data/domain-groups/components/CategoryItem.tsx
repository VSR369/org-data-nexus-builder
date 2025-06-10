
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import { Category } from '../types';

interface CategoryItemProps {
  category: Category;
  isExpanded: boolean;
  onToggleExpansion: (categoryId: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isExpanded,
  onToggleExpansion
}) => {
  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={() => onToggleExpansion(category.id)}
    >
      <div className="border rounded-md bg-muted/30">
        <CollapsibleTrigger className="flex items-center gap-2 p-3 hover:bg-muted/50 rounded-md w-full text-left">
          {isExpanded ? (
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
  );
};
