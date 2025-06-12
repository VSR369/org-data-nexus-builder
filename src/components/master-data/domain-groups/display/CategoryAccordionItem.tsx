
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface CategoryAccordionItemProps {
  category: {
    id: string;
    name: string;
    description?: string;
    subCategories: Array<{
      id: string;
      name: string;
      description?: string;
      isActive: boolean;
    }>;
  };
  categoryIndex: number;
}

const CategoryAccordionItem: React.FC<CategoryAccordionItemProps> = ({
  category,
  categoryIndex
}) => {
  return (
    <AccordionItem value={`category-${category.id}`}>
      <AccordionTrigger className="text-left hover:no-underline">
        <div className="flex items-center gap-3">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {categoryIndex + 1}
          </span>
          <div className="text-left">
            <div className="font-medium">{category.name}</div>
            <div className="text-sm text-muted-foreground">
              {category.subCategories.length} sub-categories
              {category.description && ` • ${category.description}`}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        {/* Sub-Categories Grid */}
        <div className="grid gap-3 ml-6">
          {category.subCategories.map((subCategory, subIndex) => (
            <div key={subCategory.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border-l-2 border-primary/30">
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium mt-0.5 shrink-0">
                {categoryIndex + 1}.{subIndex + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1">{subCategory.name}</h4>
                {subCategory.description && (
                  <p className="text-muted-foreground text-xs leading-relaxed">{subCategory.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {subCategory.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Ready for Evaluation
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategoryAccordionItem;
