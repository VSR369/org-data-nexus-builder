
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';
import { IndustrySegment } from '@/types/industrySegments';
import { industrySegmentDataManager } from '../industrySegmentDataManager';
import { Category, SubCategory } from './types';
import CategoryCard from './CategoryCard';
import EntrySummary from './EntrySummary';

interface ManualDataEntryProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
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
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);

  useEffect(() => {
    // Load industry segments to get the selected segment name
    const loadedData = industrySegmentDataManager.loadData();
    setIndustrySegments(loadedData.industrySegments || []);
  }, []);

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

  const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);
  const domainGroupName = wizardData.selectedDomainGroup || '';

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
            <CategoryCard
              key={category.id}
              category={category}
              categoryIndex={categoryIndex}
              canRemove={categories.length > 1}
              onUpdateCategory={(field, value) => updateCategory(category.id, field, value)}
              onRemoveCategory={() => removeCategory(category.id)}
              onAddSubCategory={() => addSubCategory(category.id)}
              onUpdateSubCategory={(subCategoryId, field, value) => 
                updateSubCategory(category.id, subCategoryId, field, value)
              }
              onRemoveSubCategory={(subCategoryId) => 
                removeSubCategory(category.id, subCategoryId)
              }
            />
          ))}
        </CardContent>
      </Card>

      <EntrySummary categories={categories} />
    </div>
  );
};

export default ManualDataEntry;
