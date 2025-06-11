
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from 'lucide-react';
import { Category, SubCategory } from './types';
import SubCategoryItem from './SubCategoryItem';

interface CategoryCardProps {
  category: Category;
  categoryIndex: number;
  canRemove: boolean;
  onUpdateCategory: (field: keyof Category, value: string) => void;
  onRemoveCategory: () => void;
  onAddSubCategory: () => void;
  onUpdateSubCategory: (subCategoryId: string, field: keyof SubCategory, value: string) => void;
  onRemoveSubCategory: (subCategoryId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  categoryIndex,
  canRemove,
  onUpdateCategory,
  onRemoveCategory,
  onAddSubCategory,
  onUpdateSubCategory,
  onRemoveSubCategory
}) => {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Category {categoryIndex + 1}</h4>
          {canRemove && (
            <Button
              onClick={onRemoveCategory}
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Minus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category Name *</Label>
            <Input
              placeholder="Enter category name"
              value={category.name}
              onChange={(e) => onUpdateCategory('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Category Description</Label>
            <Input
              placeholder="Enter category description"
              value={category.description}
              onChange={(e) => onUpdateCategory('description', e.target.value)}
            />
          </div>
        </div>

        {/* Sub-Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Sub-Categories</Label>
            <Button
              onClick={onAddSubCategory}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-3 h-3" />
              Add Sub-Category
            </Button>
          </div>

          <div className="space-y-3">
            {category.subCategories.map((subCategory, subIndex) => (
              <SubCategoryItem
                key={subCategory.id}
                subCategory={subCategory}
                subIndex={subIndex}
                canRemove={category.subCategories.length > 1}
                onUpdate={(field, value) => onUpdateSubCategory(subCategory.id, field, value)}
                onRemove={() => onRemoveSubCategory(subCategory.id)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
