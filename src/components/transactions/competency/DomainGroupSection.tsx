
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DomainGroup, CompetencyCapability, CompetencyAssessment } from './types';
import CategorySection from './CategorySection';

interface DomainGroupSectionProps {
  group: DomainGroup;
  competencyAssessments: Record<string, CompetencyAssessment>;
  activeCapabilities: CompetencyCapability[];
  onUpdateCapability: (groupId: string, categoryId: string, subCategoryId: string, capability: string) => void;
  getCapabilityBadgeColor: (capabilityName: string) => string;
}

const DomainGroupSection: React.FC<DomainGroupSectionProps> = ({
  group,
  competencyAssessments,
  activeCapabilities,
  onUpdateCapability,
  getCapabilityBadgeColor
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`group-${group.id}`} className="border rounded-lg">
        <AccordionTrigger className="px-6 py-4 text-left hover:bg-muted/50">
          <div>
            <div className="text-lg font-semibold">{group.name}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {group.categories.length} categories • {group.categories.reduce((total, cat) => total + cat.subCategories.length, 0)} sub-categories
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <div className="space-y-3">
            {group.categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                groupId={group.id}
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

export default DomainGroupSection;
