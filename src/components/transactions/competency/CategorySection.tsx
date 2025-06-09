
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Category, CompetencyCapability, CompetencyAssessment } from './types';
import SubCategoryItem from './SubCategoryItem';

interface CategorySectionProps {
  category: Category;
  groupId: string;
  competencyAssessments: Record<string, CompetencyAssessment>;
  activeCapabilities: CompetencyCapability[];
  onUpdateCapability: (groupId: string, categoryId: string, subCategoryId: string, capability: string) => void;
  getCapabilityBadgeColor: (capabilityName: string) => string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  groupId,
  competencyAssessments,
  activeCapabilities,
  onUpdateCapability,
  getCapabilityBadgeColor
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`category-${category.id}`} className="border rounded-md">
        <AccordionTrigger className="px-4 py-3 text-left hover:bg-muted/30">
          <div>
            <div className="text-base font-medium">{category.name}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {category.subCategories.length} sub-categories
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-3">
          <div className="space-y-3">
            {category.subCategories.map((subCategory) => (
              <SubCategoryItem
                key={subCategory.id}
                subCategory={subCategory}
                groupId={groupId}
                categoryId={category.id}
                competencyAssessments={competencyAssessments}
                activeCapabilities={activeCapabilities}
                onUpdateCapability={onUpdateCapability}
                getCapabilityBadgeColor={getCapabilityBadgeColor}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategorySection;
