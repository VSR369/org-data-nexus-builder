import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Target, Edit, Trash2, FolderTree, 
  Circle, ChevronDown, ChevronRight 
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industry_segment_id?: string;
  is_active: boolean;
  hierarchy?: {
    categories: Array<{
      id: string;
      name: string;
      description?: string;
      subCategories: Array<{
        id: string;
        name: string;
        description?: string;
      }>;
    }>;
  };
}

interface DomainGroupHierarchyDisplayProps {
  domainGroup: DomainGroup;
  industrySegmentName: string;
  onEdit: (domainGroup: DomainGroup) => void;
  onDelete: (domainGroup: DomainGroup) => void;
  onToggleStatus: (domainGroup: DomainGroup) => void;
}

const DomainGroupHierarchyDisplay: React.FC<DomainGroupHierarchyDisplayProps> = ({
  domainGroup,
  industrySegmentName,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAllCategories = () => {
    const allCategoryIds = new Set(categories.map(cat => cat.id));
    setExpandedCategories(allCategoryIds);
  };

  const collapseAllCategories = () => {
    setExpandedCategories(new Set());
  };

  const categories = domainGroup.hierarchy?.categories || [];
  const totalSubCategories = categories.reduce((sum, cat) => sum + cat.subCategories.length, 0);
  const hasHierarchy = categories.length > 0;

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Main Domain Group Header */}
      <div className="p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {hasHierarchy && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Collapse hierarchy" : "Expand hierarchy"}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{domainGroup.name}</h3>
                <Badge variant={domainGroup.is_active ? "default" : "secondary"}>
                  {domainGroup.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{industrySegmentName}</span>
                {domainGroup.description && (
                  <>
                    <span>•</span>
                    <span>{domainGroup.description}</span>
                  </>
                )}
                {hasHierarchy && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <FolderTree className="w-3 h-3" />
                      <span>{categories.length} categories</span>
                      {totalSubCategories > 0 && (
                        <>
                          <span>•</span>
                          <Circle className="w-3 h-3" />
                          <span>{totalSubCategories} sub-categories</span>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={domainGroup.is_active}
              onCheckedChange={() => onToggleStatus(domainGroup)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(domainGroup)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(domainGroup)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Expandable Hierarchy */}
      {hasHierarchy && isExpanded && (
        <div className="border-t bg-muted/20">
          {/* Hierarchy Controls */}
          <div className="px-4 py-2 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Hierarchy Structure</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={expandAllCategories}
                  className="text-xs h-6"
                >
                  Expand All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={collapseAllCategories}
                  className="text-xs h-6"
                >
                  Collapse All
                </Button>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="p-4 space-y-3">
            {categories.map((category, categoryIndex) => (
              <div key={category.id} className="border rounded-lg bg-card">
                {/* Category Header */}
                <div className="p-3 border-b bg-green-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Category {categoryIndex + 1}
                      </Badge>
                      <FolderTree className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{category.name}</span>
                      {category.description && (
                        <span className="text-sm text-muted-foreground">
                          • {category.description}
                        </span>
                      )}
                      {category.subCategories.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {category.subCategories.length} sub-categories
                        </Badge>
                      )}
                    </div>
                    {category.subCategories.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Sub-Categories */}
                {category.subCategories.length > 0 && (
                  <Collapsible open={expandedCategories.has(category.id)}>
                    <CollapsibleContent>
                      <div className="p-3 space-y-2">
                        {category.subCategories.map((subCategory, subIndex) => (
                          <div 
                            key={subCategory.id} 
                            className="flex items-center gap-3 p-2 rounded bg-orange-50/50 border border-orange-100"
                          >
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                              Sub {subIndex + 1}
                            </Badge>
                            <Circle className="w-3 h-3 text-orange-600 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="font-medium text-sm">{subCategory.name}</span>
                              {subCategory.description && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  • {subCategory.description}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Empty Sub-Categories State */}
                {category.subCategories.length === 0 && (
                  <div className="p-3 text-center text-sm text-muted-foreground">
                    <Circle className="w-4 h-4 mx-auto mb-1 opacity-50" />
                    No sub-categories in this category
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Hierarchy State */}
      {!hasHierarchy && (
        <div className="px-4 py-2 border-t bg-muted/10">
          <div className="text-center text-sm text-muted-foreground">
            <FolderTree className="w-4 h-4 mx-auto mb-1 opacity-50" />
            No categories or sub-categories defined
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainGroupHierarchyDisplay;