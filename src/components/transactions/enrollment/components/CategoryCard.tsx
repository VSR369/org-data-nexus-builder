
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from 'lucide-react';
import RatingSlider from './RatingSlider';

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

interface CategoryCardProps {
  category: Category;
  domainGroupName: string;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  competencyData: any;
  updateCompetencyData: (domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  domainGroupName,
  isExpanded,
  onToggleExpansion,
  competencyData,
  updateCompetencyData
}) => {
  return (
    <div className="border rounded-lg">
      <Collapsible open={isExpanded} onOpenChange={onToggleExpansion}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left p-4 hover:bg-muted/30">
          <div>
            <div className="font-medium">{category.name}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {category.subCategories.length} sub-categories
            </p>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          <div className="space-y-4">
            {category.subCategories.map((subCategory) => {
              const currentRating = competencyData[domainGroupName]?.[category.name]?.[subCategory.name] || 0;
              
              return (
                <div key={subCategory.id} className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{subCategory.name}</h4>
                      {subCategory.description && (
                        <p className="text-muted-foreground text-xs">{subCategory.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <RatingSlider
                    currentRating={currentRating}
                    onRatingChange={(rating) => 
                      updateCompetencyData(domainGroupName, category.name, subCategory.name, rating)
                    }
                  />
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CategoryCard;
