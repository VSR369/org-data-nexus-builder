
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';

interface ManualDataEntryProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface Category {
  id: string;
  name: string;
  description: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  description: string;
}

const ManualDataEntry: React.FC<ManualDataEntryProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: '',
      description: '',
      subCategories: [{ id: '1', name: '', description: '' }]
    }
  ]);

  useEffect(() => {
    // Validate the manual data
    const hasValidData = categories.some(cat => 
      cat.name.trim() && cat.subCategories.some(sub => sub.name.trim())
    );
    
    onValidationChange(hasValidData);
    
    // Update wizard data
    const manualData = {
      categories: categories.filter(cat => cat.name.trim()).map(cat => ({
        name: cat.name,
        description: cat.description
      })),
      subCategories: categories.flatMap(cat => 
        cat.subCategories
          .filter(sub => sub.name.trim())
          .map(sub => ({
            name: sub.name,
            description: sub.description,
            categoryName: cat.name
          }))
      )
    };
    
    onUpdate({ manualData });
  }, [categories, onUpdate, onValidationChange]);

  const addCategory = () => {
    const newId = (categories.length + 1).toString();
    setCategories([
      ...categories,
      {
        id: newId,
        name: '',
        description: '',
        subCategories: [{ id: '1', name: '', description: '' }]
      }
    ]);
  };

  const removeCategory = (categoryId: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  const updateCategory = (categoryId: string, field: keyof Category, value: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    ));
  };

  const addSubCategory = (categoryId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        const newSubId = (cat.subCategories.length + 1).toString();
        return {
          ...cat,
          subCategories: [
            ...cat.subCategories,
            { id: newSubId, name: '', description: '' }
          ]
        };
      }
      return cat;
    }));
  };

  const removeSubCategory = (categoryId: string, subCategoryId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId && cat.subCategories.length > 1) {
        return {
          ...cat,
          subCategories: cat.subCategories.filter(sub => sub.id !== subCategoryId)
        };
      }
      return cat;
    }));
  };

  const updateSubCategory = (categoryId: string, subCategoryId: string, field: keyof SubCategory, value: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subCategories: cat.subCategories.map(sub =>
            sub.id === subCategoryId ? { ...sub, [field]: value } : sub
          )
        };
      }
      return cat;
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Categories & Sub-Categories
            <Button onClick={addCategory} size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((category, categoryIndex) => (
            <Card key={category.id} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Category {categoryIndex + 1}</h4>
                  {categories.length > 1 && (
                    <Button
                      onClick={() => removeCategory(category.id)}
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
                      onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category Description</Label>
                    <Input
                      placeholder="Enter category description"
                      value={category.description}
                      onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                    />
                  </div>
                </div>

                {/* Sub-Categories */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Sub-Categories</Label>
                    <Button
                      onClick={() => addSubCategory(category.id)}
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
                      <div key={subCategory.id} className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">
                            Sub-Category {subIndex + 1}
                          </span>
                          {category.subCategories.length > 1 && (
                            <Button
                              onClick={() => removeSubCategory(category.id, subCategory.id)}
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
                              onChange={(e) => updateSubCategory(category.id, subCategory.id, 'name', e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Sub-Category Description</Label>
                            <Input
                              placeholder="Enter sub-category description"
                              value={subCategory.description}
                              onChange={(e) => updateSubCategory(category.id, subCategory.id, 'description', e.target.value)}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Entry Summary</h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-muted-foreground">Categories:</span>{' '}
              <span className="font-medium">
                {categories.filter(cat => cat.name.trim()).length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Sub-Categories:</span>{' '}
              <span className="font-medium">
                {categories.reduce((total, cat) => 
                  total + cat.subCategories.filter(sub => sub.name.trim()).length, 0
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualDataEntry;
