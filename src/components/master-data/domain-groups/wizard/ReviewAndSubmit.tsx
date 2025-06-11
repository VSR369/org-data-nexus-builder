
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Edit } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';
import { DomainGroupsData } from '@/types/domainGroups';
import { industrySegmentDataManager } from '../industrySegmentDataManager';

interface ReviewAndSubmitProps {
  wizardData: WizardData;
  existingData: DomainGroupsData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onSubmit: (newData: DomainGroupsData) => void;
  onValidationChange: (isValid: boolean) => void;
}

const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({
  wizardData,
  existingData,
  onUpdate,
  onSubmit,
  onValidationChange
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    validateData();
  }, [wizardData]);

  const validateData = () => {
    const errors: string[] = [];
    
    if (!wizardData.selectedIndustrySegment) {
      errors.push('Industry segment is required');
    }
    
    if (!wizardData.selectedDomainGroup) {
      errors.push('Domain group name is required');
    }

    if (wizardData.dataSource === 'excel') {
      if (!wizardData.excelData || wizardData.excelData.data.length === 0) {
        errors.push('No valid Excel data found');
      }
      if (wizardData.excelData?.errors.length > 0) {
        errors.push('Excel data contains validation errors');
      }
    } else if (wizardData.dataSource === 'manual') {
      if (!wizardData.manualData?.categories?.length) {
        errors.push('At least one category is required');
      }
      if (!wizardData.manualData?.subCategories?.length) {
        errors.push('At least one sub-category is required');
      }
    }

    setValidationErrors(errors);
    onValidationChange(errors.length === 0);
  };

  const getPreviewData = () => {
    const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
    const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);

    if (wizardData.dataSource === 'excel' && wizardData.excelData) {
      // Group Excel data by domain group
      const groupedData = wizardData.excelData.data.reduce((acc: any, row) => {
        if (!acc[row.domainGroup]) {
          acc[row.domainGroup] = {
            name: row.domainGroup,
            description: row.domainGroupDescription,
            categories: {}
          };
        }
        
        if (!acc[row.domainGroup].categories[row.category]) {
          acc[row.domainGroup].categories[row.category] = {
            name: row.category,
            description: row.categoryDescription,
            subCategories: []
          };
        }
        
        acc[row.domainGroup].categories[row.category].subCategories.push({
          name: row.subCategory,
          description: row.subCategoryDescription,
          isActive: row.isActive
        });
        
        return acc;
      }, {});

      return {
        industrySegment: selectedSegment?.name,
        domainGroups: Object.values(groupedData),
        totalCategories: wizardData.excelData.data.reduce((acc, row) => {
          return acc.add(row.category);
        }, new Set()).size,
        totalSubCategories: wizardData.excelData.data.length
      };
    } else if (wizardData.dataSource === 'manual' && wizardData.manualData) {
      return {
        industrySegment: selectedSegment?.name,
        domainGroups: [{
          name: wizardData.selectedDomainGroup,
          description: wizardData.manualData.domainGroups?.[0]?.description || '',
          categories: wizardData.manualData.categories?.map(cat => ({
            name: cat.name,
            description: cat.description,
            subCategories: wizardData.manualData.subCategories?.filter(sub => 
              sub.categoryName === cat.name
            ) || []
          })) || []
        }],
        totalCategories: wizardData.manualData.categories?.length || 0,
        totalSubCategories: wizardData.manualData.subCategories?.length || 0
      };
    }

    return null;
  };

  const handleSubmit = async () => {
    if (validationErrors.length > 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate IDs and prepare final data structure
      const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
      const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);
      
      const newDomainGroups: any[] = [];
      const newCategories: any[] = [];
      const newSubCategories: any[] = [];
      
      if (wizardData.dataSource === 'excel' && wizardData.excelData) {
        // Process Excel data
        const processedGroups = new Map();
        
        wizardData.excelData.data.forEach((row, index) => {
          // Create or get domain group
          let domainGroup = processedGroups.get(row.domainGroup);
          if (!domainGroup) {
            domainGroup = {
              id: `dg_${Date.now()}_${newDomainGroups.length}`,
              name: row.domainGroup,
              description: row.domainGroupDescription || '',
              industrySegmentId: wizardData.selectedIndustrySegment,
              industrySegmentName: selectedSegment?.name || '',
              isActive: true,
              createdAt: new Date().toISOString()
            };
            newDomainGroups.push(domainGroup);
            processedGroups.set(row.domainGroup, domainGroup);
          }
          
          // Create category if not exists
          let category = newCategories.find(c => 
            c.name === row.category && c.domainGroupId === domainGroup.id
          );
          if (!category) {
            category = {
              id: `cat_${Date.now()}_${newCategories.length}`,
              name: row.category,
              description: row.categoryDescription || '',
              domainGroupId: domainGroup.id,
              isActive: true,
              createdAt: new Date().toISOString()
            };
            newCategories.push(category);
          }
          
          // Create sub-category
          const subCategory = {
            id: `sub_${Date.now()}_${newSubCategories.length}_${index}`,
            name: row.subCategory,
            description: row.subCategoryDescription || '',
            categoryId: category.id,
            isActive: row.isActive,
            createdAt: new Date().toISOString()
          };
          newSubCategories.push(subCategory);
        });
        
      } else if (wizardData.dataSource === 'manual' && wizardData.manualData) {
        // Process manual data
        const domainGroup = {
          id: `dg_${Date.now()}`,
          name: wizardData.selectedDomainGroup || '',
          description: wizardData.manualData.domainGroups?.[0]?.description || '',
          industrySegmentId: wizardData.selectedIndustrySegment,
          industrySegmentName: selectedSegment?.name || '',
          isActive: true,
          createdAt: new Date().toISOString()
        };
        newDomainGroups.push(domainGroup);
        
        wizardData.manualData.categories?.forEach((cat, catIndex) => {
          const category = {
            id: `cat_${Date.now()}_${catIndex}`,
            name: cat.name,
            description: cat.description || '',
            domainGroupId: domainGroup.id,
            isActive: true,
            createdAt: new Date().toISOString()
          };
          newCategories.push(category);
          
          wizardData.manualData.subCategories
            ?.filter(sub => sub.categoryName === cat.name)
            .forEach((sub, subIndex) => {
              const subCategory = {
                id: `sub_${Date.now()}_${catIndex}_${subIndex}`,
                name: sub.name,
                description: sub.description || '',
                categoryId: category.id,
                isActive: true,
                createdAt: new Date().toISOString()
              };
              newSubCategories.push(subCategory);
            });
        });
      }
      
      // Merge with existing data
      const updatedData: DomainGroupsData = {
        domainGroups: [...(existingData.domainGroups || []), ...newDomainGroups],
        categories: [...(existingData.categories || []), ...newCategories],
        subCategories: [...(existingData.subCategories || []), ...newSubCategories]
      };
      
      onSubmit(updatedData);
      
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewData = getPreviewData();

  if (!previewData) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No data to review. Please complete the previous steps.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Review & Submit</h2>
        <p className="text-muted-foreground">
          Review your domain group hierarchy before submitting
        </p>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Please fix the following issues:</p>
              {validationErrors.map((error, index) => (
                <div key={index} className="text-sm">• {error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Hierarchy Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1</div>
              <div className="text-sm text-muted-foreground">Industry Segment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{previewData.domainGroups.length}</div>
              <div className="text-sm text-muted-foreground">Domain Groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{previewData.totalCategories}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{previewData.totalSubCategories}</div>
              <div className="text-sm text-muted-foreground">Sub-Categories</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-muted-foreground">Industry Segment:</span>{' '}
              <Badge variant="outline">{previewData.industrySegment}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Data Source:</span>{' '}
              <Badge variant="secondary" className="capitalize">{wizardData.dataSource}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hierarchy Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Hierarchy Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previewData.domainGroups.map((domainGroup: any, dgIndex: number) => (
              <div key={dgIndex} className="border rounded-lg p-4">
                <div className="font-medium text-lg mb-2">{domainGroup.name}</div>
                {domainGroup.description && (
                  <p className="text-sm text-muted-foreground mb-3">{domainGroup.description}</p>
                )}
                
                <div className="space-y-3">
                  {domainGroup.categories.map((category: any, catIndex: number) => (
                    <div key={catIndex} className="border-l-2 border-primary pl-4">
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {category.subCategories.map((subCategory: any, subIndex: number) => (
                          <div key={subIndex} className="text-sm bg-muted/30 rounded p-2">
                            <span className="font-medium">{subCategory.name}</span>
                            {subCategory.description && (
                              <p className="text-xs text-muted-foreground mt-1">{subCategory.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={validationErrors.length > 0 || isSubmitting}
          size="lg"
          className="px-8"
        >
          {isSubmitting ? 'Creating Hierarchy...' : 'Create Domain Group Hierarchy'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewAndSubmit;
