
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from 'lucide-react';
import CategoryCard from './CategoryCard';

interface SubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  domainGroupId: string;
  isActive: boolean;
  createdAt: string;
  subCategories: SubCategory[];
}

interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industrySegmentId: string;
  isActive: boolean;
  createdAt: string;
  categories: Category[];
}

interface DomainGroupCardProps {
  domainGroup: DomainGroup;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  expandedCategories: Set<string>;
  onToggleCategoryExpansion: (categoryId: string) => void;
  competencyData: any;
  updateCompetencyData: (domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

const DomainGroupCard: React.FC<DomainGroupCardProps> = ({
  domainGroup,
  isExpanded,
  onToggleExpansion,
  expandedCategories,
  onToggleCategoryExpansion,
  competencyData,
  updateCompetencyData
}) => {
  return (
    <Card>
      <CardHeader>
        <Collapsible open={isExpanded} onOpenChange={onToggleExpansion}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <div>
              <CardTitle className="text-lg">{domainGroup.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {domainGroup.categories.length} categories
              </p>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="space-y-3">
              {domainGroup.categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  domainGroupName={domainGroup.name}
                  isExpanded={expandedCategories.has(category.id)}
                  onToggleExpansion={() => onToggleCategoryExpansion(category.id)}
                  competencyData={competencyData}
                  updateCompetencyData={updateCompetencyData}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  );
};

export default DomainGroupCard;
