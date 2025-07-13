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

  const categories = domainGroup.hierarchy?.categories || [];
  const totalSubCategories = categories.reduce((sum, cat) => sum + cat.subCategories.length, 0);

  return (
    <div className="border rounded-lg p-4">
      {/* Main Domain Group Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Target className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{domainGroup.name}</h3>
              {categories.length > 0 && (
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{industrySegmentName}</span>
              {domainGroup.description && (
                <>
                  <span>•</span>
                  <span>{domainGroup.description}</span>
                </>
              )}
              {categories.length > 0 && (
                <>
                  <span>•</span>
                  <span>{categories.length} categories</span>
                  {totalSubCategories > 0 && (
                    <>
                      <span>•</span>
                      <span>{totalSubCategories} sub-categories</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <Badge variant={domainGroup.is_active ? "default" : "secondary"}>
            {domainGroup.is_active ? 'Active' : 'Inactive'}
          </Badge>
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

      {/* Expandable Hierarchy */}
      {categories.length > 0 && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="mt-4">
            <div className="ml-8 space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="border-l-2 border-muted pl-4">
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{category.name}</span>
                    {category.description && (
                      <span className="text-sm text-muted-foreground">
                        • {category.description}
                      </span>
                    )}
                    {category.subCategories.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
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
                  
                  {/* Sub-Categories */}
                  {expandedCategories.has(category.id) && category.subCategories.length > 0 && (
                    <div className="ml-6 mt-2 space-y-1">
                      {category.subCategories.map((subCategory) => (
                        <div key={subCategory.id} className="flex items-center gap-2 text-sm">
                          <Circle className="w-3 h-3 text-orange-600" />
                          <span>{subCategory.name}</span>
                          {subCategory.description && (
                            <span className="text-muted-foreground">
                              • {subCategory.description}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default DomainGroupHierarchyDisplay;