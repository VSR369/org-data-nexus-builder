
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EntityTypeSelectorProps {
  entityTypes: string[];
  selectedEntityType: string;
  onEntityTypeChange: (value: string) => void;
}

const EntityTypeSelector = ({ entityTypes, selectedEntityType, onEntityTypeChange }: EntityTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Entity Type *</Label>
      <RadioGroup value={selectedEntityType} onValueChange={onEntityTypeChange}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entityTypes.map((entityType) => (
            <div key={entityType} className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedEntityType === entityType 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={entityType} id={entityType} />
                <Label htmlFor={entityType} className="cursor-pointer font-medium">
                  {entityType}
                </Label>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default EntityTypeSelector;
