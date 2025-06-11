
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus } from 'lucide-react';
import { SubCategory } from './types';

interface SubCategoryItemProps {
  subCategory: SubCategory;
  subIndex: number;
  canRemove: boolean;
  onUpdate: (field: keyof SubCategory, value: string) => void;
  onRemove: () => void;
}

const SubCategoryItem: React.FC<SubCategoryItemProps> = ({
  subCategory,
  subIndex,
  canRemove,
  onUpdate,
  onRemove
}) => {
  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">
          Sub-Category {subIndex + 1}
        </span>
        {canRemove && (
          <Button
            onClick={onRemove}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive h-6 w-6 p-0"
          >
            <Minus className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Sub-Category Name *</Label>
          <Input
            placeholder="Enter sub-category name"
            value={subCategory.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Sub-Category Description</Label>
          <Input
            placeholder="Enter sub-category description"
            value={subCategory.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
};

export default SubCategoryItem;
