
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Building2, FolderTree } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';
import { IndustrySegment } from '@/types/industrySegments';
import { industrySegmentDataManager } from '../industrySegmentDataManager';
import CategoryCard from './CategoryCard';
import { Category, SubCategory } from './types';

interface DataEntryStepProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const DataEntryStep: React.FC<DataEntryStepProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  const [industrySegments, setIndustrySegments] = React.useState<IndustrySegment[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    const loadedData = industrySegmentDataManager.loadData();
    setIndustrySegments(loadedData.industrySegments || []);
  }, []);

  React.useEffect(() => {
    // Initialize categories from wizard data if available
    const wizardCategories = wizardData.manualData?.categories || [];
    const wizardSubCategories = wizardData.manualData?.subCategories || [];
    
    const initialCategories: Category[] = wizardCategories.map((cat, index) => ({
      id: `cat-${index}`,
      name: cat.name,
      description: cat.description || '',
      subCategories: wizardSubCategories
        .filter(sub => sub.categoryName === cat.name)
        .map((sub, subIndex) => ({
          id: `sub-${index}-${subIndex}`,
          name: sub.name,
          description: sub.description || ''
        }))
    }));

    setCategories(initialCategories);
  }, [wizardData.manualData]);

  React.useEffect(() => {
    // Validate that we have at least one category with a name and at least one sub-category
    const isValid = categories.length > 0 && 
      categories.every(cat => cat.name.trim().length > 0) &&
      categories.every(cat => cat.subCategories.length > 0 && 
        cat.subCategories.every(sub => sub.name.trim().length > 0)
      );
    
    console.log('DataEntryStep: Validation:', { categories: categories.length, isValid });
    onValidationChange(isValid);
  }, [categories, onValidationChange]);

  const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);
  const domainGroupName = wizardData.selectedDomainGroup || '';

  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const updateWizardData = (updatedCategories: Category[]) => {
    const categoriesData = updatedCategories.map(cat => ({
      name: cat.name,
      description: cat.description
    }));

    const subCategoriesData = updatedCategories.flatMap(cat =>
      cat.subCategories.map(sub => ({
        name: sub.name,
        description: sub.description,
        categoryName: cat.name
      }))
    );

    onUpdate({
      manualData: {
        ...wizardData.manualData,
        categories: categoriesData,
        subCategories: subCategoriesData
      }
    });
  };

  const addCategory = () => {
    const newCategory: Category = {
      id: generateId(),
      name: '',
      description: '',
      subCategories: [{
        id: generateId(),
        name: '',
        description: ''
      }]
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    updateWizardData(updatedCategories);
  };

  const updateCategory = (categoryId: string, field: keyof Category, value: string) => {
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    );
    setCategories(updatedCategories);
    updateWizardData(updatedCategories);
  };

  const removeCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    updateWizardData(updatedCategories);
  };

  const addSubCategory = (categoryId: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subCategories: [...cat.subCategories, {
            id: generateId(),
            name: '',
            description: ''
          }]
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    updateWizardData(updatedCategories);
  };

  const updateSubCategory = (categoryId: string, subCategoryId: string, field: keyof SubCategory, value: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subCategories: cat.subCategories.map(sub =>
            sub.id === subCategoryId ? { ...sub, [field]: value } : sub
          )
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    updateWizardData(updatedCategories);
  };

  const removeSubCategory = (categoryId: string, subCategoryId: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subCategories: cat.subCategories.filter(sub => sub.id !== subCategoryId)
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    updateWizardData(updatedCategories);
  };

  return (
    <div className="space-y-6">
      {/* Header with Industry Segment and Domain Group */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Category & Sub-Category Creation</h2>
        <p className="text-muted-foreground mb-6">
          Create multiple categories and sub-categories for your domain group
        </p>

        {/* Breadcrumb Style Display */}
        {(selectedSegment || domainGroupName) && (
          <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg mb-6">
            {selectedSegment && (
              <>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">{selectedSegment.industrySegment}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    Industry Segment
                  </Badge>
                </div>
                {domainGroupName && (
                  <span className="text-blue-600 font-bold mx-2">→</span>
                )}
              </>
            )}
            {domainGroupName && (
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-indigo-900">{domainGroupName}</span>
                <Badge variant="outline" className="border-indigo-300 text-indigo-700 text-xs">
                  Domain Group
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Categories Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Categories & Sub-Categories</CardTitle>
            <Button onClick={addCategory} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <FolderTree className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Categories Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first category to organize your domain group hierarchy.
              </p>
              <Button onClick={addCategory} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  categoryIndex={index}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataEntryStep;
