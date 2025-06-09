
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SubCategory, CompetencyCapability, CompetencyAssessment } from './types';

interface SubCategoryItemProps {
  subCategory: SubCategory;
  groupId: string;
  categoryId: string;
  competencyAssessments: Record<string, CompetencyAssessment>;
  activeCapabilities: CompetencyCapability[];
  onUpdateCapability: (groupId: string, categoryId: string, subCategoryId: string, capability: string) => void;
  getCapabilityBadgeColor: (capabilityName: string) => string;
}

const SubCategoryItem: React.FC<SubCategoryItemProps> = ({
  subCategory,
  groupId,
  categoryId,
  competencyAssessments,
  activeCapabilities,
  onUpdateCapability,
  getCapabilityBadgeColor
}) => {
  const assessmentKey = `${groupId}-${categoryId}-${subCategory.id}`;
  const currentCapability = competencyAssessments[assessmentKey]?.capability || 'Advanced';

  const handleCapabilityChange = (value: string) => {
    console.log('Capability changed:', { groupId, categoryId, subCategoryId: subCategory.id, value });
    onUpdateCapability(groupId, categoryId, subCategory.id, value);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
      <div className="flex-1">
        <div className="text-sm font-medium mb-1">
          {subCategory.name}
        </div>
        {subCategory.description && (
          <div className="text-xs text-muted-foreground">
            {subCategory.description}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        <Label className="text-xs font-medium">Capability:</Label>
        <Select
          value={currentCapability}
          onValueChange={handleCapabilityChange}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-50">
            {activeCapabilities.map((capability) => (
              <SelectItem 
                key={capability.id} 
                value={capability.name}
                className="cursor-pointer"
              >
                <div className="flex flex-col py-1">
                  <span className="font-medium">{capability.name}</span>
                  <span className="text-xs text-muted-foreground leading-tight whitespace-normal">
                    {capability.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge className={`min-w-[90px] justify-center text-xs ${getCapabilityBadgeColor(currentCapability)}`}>
          {currentCapability}
        </Badge>
      </div>
    </div>
  );
};

export default SubCategoryItem;
